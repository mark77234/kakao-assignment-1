# Next.js Todo Planner

FastAPI 백엔드와 Next.js App Router 프론트엔드를 분리해 구현한 Todo 앱입니다. 2차 과제의 Todo Planner UI/UX를 기준으로 화면 스타일을 마이그레이션했고, 로컬스토리지 기반 데이터 흐름을 서버 API 기반 흐름으로 전환했습니다.

## 프로젝트 구조

```txt
kakao-assignment-1/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.local
└── frontend/
    ├── app/
    │   ├── api/todos/route.ts
    │   ├── api/todos/[todoId]/route.ts
    │   ├── todos/page.tsx
    │   ├── todos/new/page.tsx
    │   ├── todos/[todoId]/page.tsx
    │   ├── todos/error.tsx
    │   ├── todos/loading.tsx
    │   ├── actions.ts
    │   ├── layout.tsx
    │   └── page.tsx
    └── .env.local
```

## 구현 기능

- Todo 목록 조회
- Todo 생성, 수정, 삭제
- Todo 완료/진행 중 상태 토글
- `?filter=active`, `?filter=completed` 기반 서버 필터링
- `?search=키워드` 기반 서버 검색
- 필터와 검색 조건 동시 적용
- Next.js API Route를 통한 FastAPI 프록시 연동
- Server Actions 기반 생성/수정/삭제 처리
- `loading.tsx`, `error.tsx` 화면 처리
- 빈 목록/빈 검색 결과 화면 처리
- 2차 과제 Todo Planner UI/UX 스타일 마이그레이션

## 데이터 흐름

```txt
브라우저
→ Next.js Page / Server Action
→ Next.js API Route
→ FastAPI
→ SQLite
```

목록 조회, 필터링, 검색은 서버에서 데이터를 가져와 렌더링하고, 생성/수정/삭제/완료 토글은 Server Action을 통해 API Route와 FastAPI로 전달됩니다.

## 실행 방법

백엔드 실행:

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

프론트엔드 실행:

```bash
cd frontend
npm install
npm run dev
```

확인 URL:

```txt
Frontend: http://localhost:3000/todos
Backend Docs: http://localhost:8000/docs
```

## 검증

```bash
cd frontend
npm run lint
npm run build
```

```bash
cd backend
python -m py_compile main.py
```

브라우저에서 Todo 생성, 검색, 필터링, 완료 토글, 수정, 삭제, 빈 검색 결과 화면을 확인했습니다.
