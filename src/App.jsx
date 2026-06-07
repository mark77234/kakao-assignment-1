import { useEffect, useState } from 'react'
import './App.css'

const TODOS_STORAGE_KEY = 'todoApp.todos'
const SELECTED_DATE_STORAGE_KEY = 'todoApp.selectedDate'
const WEEK_START_STORAGE_KEY = 'todoApp.weekStartDate'

const FILTER_TYPES = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

const FILTER_OPTIONS = [
  { label: '전체', value: FILTER_TYPES.ALL },
  { label: '진행 중', value: FILTER_TYPES.ACTIVE },
  { label: '완료', value: FILTER_TYPES.COMPLETED },
]

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일']

function formatDateKey(dateValue) {
  const dateObject =
    dateValue instanceof Date ? new Date(dateValue) : parseDateKey(dateValue)
  const year = dateObject.getFullYear()
  const month = String(dateObject.getMonth() + 1).padStart(2, '0')
  const day = String(dateObject.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)

  return new Date(year, month - 1, day)
}

function addDays(dateKey, offsetDays) {
  const movedDate = parseDateKey(dateKey)
  movedDate.setDate(movedDate.getDate() + offsetDays)

  return formatDateKey(movedDate)
}

function getWeekStart(dateKey) {
  const baseDate = parseDateKey(dateKey)
  const day = baseDate.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  baseDate.setDate(baseDate.getDate() + diffToMonday)

  return formatDateKey(baseDate)
}

function getWeekRange(weekStartDate) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStartDate, index))
}

function isToday(dateKey) {
  return dateKey === formatDateKey(new Date())
}

function isValidDateKey(dateKey) {
  if (typeof dateKey !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return false
  }

  return formatDateKey(parseDateKey(dateKey)) === dateKey
}

function formatReadableDate(dateKey) {
  const dateObject = parseDateKey(dateKey)

  return dateObject.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

function createTodoId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function saveTodos(todos) {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
}

function loadTodos() {
  const storedValue = localStorage.getItem(TODOS_STORAGE_KEY)
  if (!storedValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(storedValue)

    return normalizeTodos(parsedValue)
  } catch {
    return []
  }
}

function normalizeTodos(rawTodos) {
  if (!Array.isArray(rawTodos)) {
    return []
  }

  return rawTodos
    .filter((todo) => {
      return (
        typeof todo?.id === 'string' &&
        typeof todo?.text === 'string' &&
        typeof todo?.date === 'string'
      )
    })
    .map((todo) => {
      return {
        id: todo.id,
        text: todo.text,
        isCompleted: Boolean(todo.isCompleted),
        date: todo.date,
      }
    })
}

function saveDate(storageKey, dateKey) {
  localStorage.setItem(storageKey, dateKey)
}

function loadDate(storageKey, fallbackDate) {
  const storedDate = localStorage.getItem(storageKey)

  return isValidDateKey(storedDate) ? storedDate : fallbackDate
}

function loadSelectedDate() {
  return loadDate(SELECTED_DATE_STORAGE_KEY, formatDateKey(new Date()))
}

function loadWeekStartDate(selectedDate) {
  const fallbackWeekStartDate = getWeekStart(selectedDate)
  const storedWeekStartDate = loadDate(
    WEEK_START_STORAGE_KEY,
    fallbackWeekStartDate,
  )

  if (getWeekStart(selectedDate) !== storedWeekStartDate) {
    return fallbackWeekStartDate
  }

  return storedWeekStartDate
}

function getFilteredTodos(todos, currentFilter) {
  if (currentFilter === FILTER_TYPES.ACTIVE) {
    return todos.filter((todo) => !todo.isCompleted)
  }

  if (currentFilter === FILTER_TYPES.COMPLETED) {
    return todos.filter((todo) => todo.isCompleted)
  }

  return todos
}

function getEmptyStateMessage(todos, todosForSelectedDate) {
  if (todos.length === 0) {
    return '등록된 Todo가 없습니다.'
  }

  if (todosForSelectedDate.length === 0) {
    return '선택한 날짜의 Todo가 없습니다.'
  }

  return '해당 조건의 Todo가 없습니다.'
}

function getTodoCountByDate(todos, dateKey) {
  return todos.filter((todo) => todo.date === dateKey).length
}

function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [todoInput, setTodoInput] = useState('')
  const [message, setMessage] = useState('')
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [currentFilter, setCurrentFilter] = useState(FILTER_TYPES.ALL)
  const [selectedDate, setSelectedDate] = useState(loadSelectedDate)
  const [weekStartDate, setWeekStartDate] = useState(() =>
    loadWeekStartDate(selectedDate),
  )

  const todosForSelectedDate = todos.filter((todo) => {
    return todo.date === selectedDate
  })
  const visibleTodos = getFilteredTodos(todosForSelectedDate, currentFilter)
  const emptyStateMessage = getEmptyStateMessage(todos, todosForSelectedDate)
  const selectedDateLabel = formatReadableDate(selectedDate)
  const weekDates = getWeekRange(weekStartDate)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  useEffect(() => {
    saveDate(SELECTED_DATE_STORAGE_KEY, selectedDate)
  }, [selectedDate])

  useEffect(() => {
    saveDate(WEEK_START_STORAGE_KEY, weekStartDate)
  }, [weekStartDate])

  const resetTransientTodoState = () => {
    setEditingTodoId(null)
    setEditingText('')
    setMessage('')
  }

  const selectDate = (dateKey) => {
    setSelectedDate(dateKey)
    setWeekStartDate(getWeekStart(dateKey))
    resetTransientTodoState()
  }

  const handleMoveDate = (offsetDays) => {
    const nextDate = addDays(selectedDate, offsetDays)

    selectDate(nextDate)
  }

  const handleMoveWeek = (offsetWeeks) => {
    const offsetDays = offsetWeeks * 7

    setSelectedDate((currentDate) => addDays(currentDate, offsetDays))
    setWeekStartDate((currentWeekStartDate) =>
      addDays(currentWeekStartDate, offsetDays),
    )
    resetTransientTodoState()
  }

  const handleAddTodo = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const normalizedText = String(formData.get('todoText') ?? '').trim()
    if (!normalizedText) {
      setMessage('할 일을 입력한 뒤 추가해 주세요.')
      return
    }

    const newTodo = {
      id: createTodoId(),
      text: normalizedText,
      isCompleted: false,
      date: selectedDate,
    }

    setTodos((currentTodos) => [...currentTodos, newTodo])
    setTodoInput('')
    setMessage('')
  }

  const handleTodoInputKeyDown = (event) => {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    event.currentTarget.form?.requestSubmit()
  }

  const handleStartEdit = (todo) => {
    setEditingTodoId(todo.id)
    setEditingText(todo.text)
    setMessage('')
  }

  const handleCancelEdit = () => {
    setEditingTodoId(null)
    setEditingText('')
    setMessage('')
  }

  const handleSaveEdit = (todoId, nextText = editingText) => {
    const normalizedText = nextText.trim()
    if (!normalizedText) {
      setMessage('수정 내용은 비워둘 수 없습니다.')
      return
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) => {
        if (todo.id !== todoId) {
          return todo
        }

        return {
          ...todo,
          text: normalizedText,
        }
      }),
    )
    setEditingTodoId(null)
    setEditingText('')
    setMessage('')
  }

  const handleToggleTodo = (todoId) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => {
        if (todo.id !== todoId) {
          return todo
        }

        return {
          ...todo,
          isCompleted: !todo.isCompleted,
        }
      }),
    )
    setMessage('')
  }

  const handleDeleteTodo = (todoId) => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== todoId),
    )

    if (editingTodoId === todoId) {
      setEditingTodoId(null)
      setEditingText('')
    }

    setMessage('')
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">React Migration</p>
          <h1>Todo Planner</h1>
        </div>
        <div className="date-header">
          <button
            type="button"
            className="icon-button"
            aria-label="이전 날짜"
            onClick={() => handleMoveDate(-1)}
          >
            ‹
          </button>
          <p className="selected-date-text">{selectedDateLabel}</p>
          <button
            type="button"
            className="icon-button"
            aria-label="다음 날짜"
            onClick={() => handleMoveDate(1)}
          >
            ›
          </button>
        </div>
      </header>

      <section className="week-section" aria-label="주간 뷰">
        <div className="week-nav">
          <button
            type="button"
            className="text-button"
            onClick={() => handleMoveWeek(-1)}
          >
            이전 주
          </button>
          <button
            type="button"
            className="text-button"
            onClick={() => handleMoveWeek(1)}
          >
            다음 주
          </button>
        </div>
        <div className="week-grid">
          {weekDates.map((dateKey, index) => {
            const dateObject = parseDateKey(dateKey)
            const isSelectedDate = selectedDate === dateKey
            const isTodayDate = isToday(dateKey)
            const todoCount = getTodoCountByDate(todos, dateKey)

            return (
              <button
                key={dateKey}
                type="button"
                className={`week-day ${isSelectedDate ? 'is-selected' : ''} ${
                  isTodayDate ? 'is-today' : ''
                }`}
                data-date={dateKey}
                aria-pressed={isSelectedDate}
                onClick={() => selectDate(dateKey)}
              >
                <span className="week-day-name">{DAY_NAMES[index]}</span>
                <span className="week-day-date">
                  {String(dateObject.getMonth() + 1).padStart(2, '0')}/
                  {String(dateObject.getDate()).padStart(2, '0')}
                </span>
                <span className="week-day-count">{todoCount}개</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="input-section" aria-label="Todo 추가">
        <form className="input-row" onSubmit={handleAddTodo}>
          <label htmlFor="todo-input" className="sr-only">
            할 일 입력
          </label>
          <input
            id="todo-input"
            name="todoText"
            type="text"
            value={todoInput}
            placeholder="할 일을 입력하세요"
            autoComplete="off"
            onChange={(event) => setTodoInput(event.target.value)}
            onKeyDown={handleTodoInputKeyDown}
          />
          <button type="submit" className="primary-button">
            추가
          </button>
        </form>
        <p className="input-message" role="alert" aria-live="polite">
          {message}
        </p>
      </section>

      <section className="filter-section" aria-label="상태 필터">
        <div className="filter-tabs" role="tablist">
          {FILTER_OPTIONS.map((filterOption) => {
            const isActive = currentFilter === filterOption.value

            return (
              <button
                key={filterOption.value}
                type="button"
                className={`filter-tab ${isActive ? 'is-active' : ''}`}
                role="tab"
                aria-selected={isActive}
                onClick={() => setCurrentFilter(filterOption.value)}
              >
                {filterOption.label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="list-section" aria-label="Todo 목록">
        {visibleTodos.length === 0 ? (
          <p className="empty-state">{emptyStateMessage}</p>
        ) : (
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isEditing={editingTodoId === todo.id}
                editingText={editingText}
                onEditingTextChange={setEditingText}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

function TodoItem({
  todo,
  isEditing,
  editingText,
  onEditingTextChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleTodo,
  onDeleteTodo,
}) {
  return (
    <li className={`todo-item ${todo.isCompleted ? 'is-completed' : ''}`}>
      {isEditing ? (
        <form
          className="edit-form"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            onSaveEdit(todo.id, String(formData.get('editingText') ?? ''))
          }}
        >
          <label htmlFor={`edit-${todo.id}`} className="sr-only">
            Todo 수정
          </label>
          <input
            id={`edit-${todo.id}`}
            name="editingText"
            className="edit-input"
            type="text"
            value={editingText}
            autoComplete="off"
            onChange={(event) => onEditingTextChange(event.target.value)}
          />
          <div className="todo-actions">
            <button type="submit" className="todo-action-button">
              저장
            </button>
            <button
              type="button"
              className="todo-action-button secondary"
              onClick={onCancelEdit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="todo-text">{todo.text}</p>
          <div className="todo-actions">
            <button
              type="button"
              className="todo-action-button"
              onClick={() => onToggleTodo(todo.id)}
            >
              {todo.isCompleted ? '복구' : '완료'}
            </button>
            <button
              type="button"
              className="todo-action-button secondary"
              onClick={() => onStartEdit(todo)}
            >
              수정
            </button>
            <button
              type="button"
              className="todo-action-button danger"
              onClick={() => onDeleteTodo(todo.id)}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  )
}

export default App
