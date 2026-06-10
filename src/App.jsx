import { useEffect, useState } from "react";
import "./App.css";

import AppHeader from "./components/AppHeader";
import WeekCalendar from "./components/WeekCalendar";
import TodoInput from "./components/TodoInput";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";

import {
  FILTER_TYPES,
  SELECTED_DATE_STORAGE_KEY,
  WEEK_START_STORAGE_KEY,
} from "./constants/todoConstants";

import {
  addDays,
  formatReadableDate,
  getWeekRange,
  getWeekStart,
} from "./utils/dateUtils";

import {
  createTodoId,
  getEmptyStateMessage,
  getFilteredTodos,
} from "./utils/todoUtils";

import {
  loadSelectedDate,
  loadTodos,
  loadWeekStartDate,
  saveDate,
  saveTodos,
} from "./utils/storageUtils";

export default function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [todoInput, setTodoInput] = useState("");
  const [message, setMessage] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [currentFilter, setCurrentFilter] = useState(FILTER_TYPES.ALL);
  const [selectedDate, setSelectedDate] = useState(loadSelectedDate);
  const [weekStartDate, setWeekStartDate] = useState(() =>
    loadWeekStartDate(selectedDate),
  );

  const todosForSelectedDate = todos.filter((todo) => {
    return todo.date === selectedDate;
  });
  const visibleTodos = getFilteredTodos(todosForSelectedDate, currentFilter);
  const emptyStateMessage = getEmptyStateMessage(todos, todosForSelectedDate);
  const selectedDateLabel = formatReadableDate(selectedDate);
  const weekDates = getWeekRange(weekStartDate);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    saveDate(SELECTED_DATE_STORAGE_KEY, selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    saveDate(WEEK_START_STORAGE_KEY, weekStartDate);
  }, [weekStartDate]);

  const resetTransientTodoState = () => {
    setEditingTodoId(null);
    setEditingText("");
    setMessage("");
  };

  const selectDate = (dateKey) => {
    setSelectedDate(dateKey);
    setWeekStartDate(getWeekStart(dateKey));
    resetTransientTodoState();
  };

  const handleMoveDate = (offsetDays) => {
    const nextDate = addDays(selectedDate, offsetDays);

    selectDate(nextDate);
  };

  const handleMoveWeek = (offsetWeeks) => {
    const offsetDays = offsetWeeks * 7;

    setSelectedDate((currentDate) => addDays(currentDate, offsetDays));
    setWeekStartDate((currentWeekStartDate) =>
      addDays(currentWeekStartDate, offsetDays),
    );
    resetTransientTodoState();
  };

  const handleAddTodo = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const normalizedText = String(formData.get("todoText") ?? "").trim();
    if (!normalizedText) {
      setMessage("할 일을 입력한 뒤 추가해 주세요.");
      return;
    }

    const newTodo = {
      id: createTodoId(),
      text: normalizedText,
      isCompleted: false,
      date: selectedDate,
    };

    setTodos((currentTodos) => [...currentTodos, newTodo]);
    setTodoInput("");
    setMessage("");
  };

  const handleTodoInputKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  const handleStartEdit = (todo) => {
    setEditingTodoId(todo.id);
    setEditingText(todo.text);
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingText("");
    setMessage("");
  };

  const handleSaveEdit = (todoId, nextText = editingText) => {
    const normalizedText = nextText.trim();
    if (!normalizedText) {
      setMessage("수정 내용은 비워둘 수 없습니다.");
      return;
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          text: normalizedText,
        };
      }),
    );
    setEditingTodoId(null);
    setEditingText("");
    setMessage("");
  };

  const handleToggleTodo = (todoId) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          isCompleted: !todo.isCompleted,
        };
      }),
    );
    setMessage("");
  };

  const handleDeleteTodo = (todoId) => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== todoId),
    );

    if (editingTodoId === todoId) {
      setEditingTodoId(null);
      setEditingText("");
    }

    setMessage("");
  };

  return (
    <main className="app-shell">
      <AppHeader
        selectedDateLabel={selectedDateLabel}
        onMoveDate={handleMoveDate}
      />

      <WeekCalendar
        weekDates={weekDates}
        selectedDate={selectedDate}
        todos={todos}
        onMoveWeek={handleMoveWeek}
        selectDate={selectDate}
      />

      <TodoInput
        todoInput={todoInput}
        message={message}
        onTodoInputChange={setTodoInput}
        onAddTodo={handleAddTodo}
        onTodoInputKeyDown={handleTodoInputKeyDown}
      />

      <TodoFilter
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />

      <TodoList
        visibleTodos={visibleTodos}
        emptyStateMessage={emptyStateMessage}
        editingTodoId={editingTodoId}
        editingText={editingText}
        onEditingTextChange={setEditingText}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </main>
  );
}
