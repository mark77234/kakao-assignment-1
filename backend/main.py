from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

# DB 설정
DATABASE_URL = "sqlite:///./todos.db"  # SQLite DB 파일 위치
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# DB 모델 (테이블 구조 정의)
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)  # 필수 필드
    completed = Column(Boolean, default=False)  # 디폴트값이 False


# Pydantic 스키마 (요청/응답 데이터 구조 정의)
class TodoCreate(BaseModel):  # Todo 생성 모델
    title: str


class TodoUpdate(BaseModel):
    title: str
    completed: bool  # completed 역할이 뭐지


# 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(title="Todo API")

# FastAPI 앱 미들웨어 및 CORS 설정
app.add_middleware(  # 전체적으로 필드 뭐하는 애들인지
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 엔드포인트 구현
# API 목록에 해당되는 부분을 직접 구현해보세요.


@app.get("/todos")
def get_todos(db: Session = Depends(get_db)):
    return db.query(Todo).all()


@app.post("/todos")
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    new_todo = Todo(title=todo.title, completed=False)

    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return new_todo


@app.put("/todos/{id}")
def update_todo(id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == id).first()

    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db_todo.title = todo.title
    db_todo.completed = todo.completed

    db.commit()
    db.refresh(db_todo)

    return db_todo


@app.delete("/todos/{id}")
def delete_todo(id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == id).first()

    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(db_todo)
    db.commit()

    return {"message": "Todo deleted"}
