import { FILTER_TYPES } from "../constants/todoConstants";

export function createTodoId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeTodos(rawTodos) {
  if (!Array.isArray(rawTodos)) {
    return [];
  }

  return rawTodos
    .filter((todo) => {
      return (
        typeof todo?.id === "string" &&
        typeof todo?.text === "string" &&
        typeof todo?.date === "string"
      );
    })
    .map((todo) => {
      return {
        id: todo.id,
        text: todo.text,
        isCompleted: Boolean(todo.isCompleted),
        date: todo.date,
      };
    });
}

export function getFilteredTodos(todos, currentFilter) {
  if (currentFilter === FILTER_TYPES.ACTIVE) {
    return todos.filter((todo) => !todo.isCompleted);
  }

  if (currentFilter === FILTER_TYPES.COMPLETED) {
    return todos.filter((todo) => todo.isCompleted);
  }

  return todos;
}

export function getEmptyStateMessage(todos, todosForSelectedDate) {
  if (todos.length === 0) {
    return "등록된 Todo가 없습니다.";
  }

  if (todosForSelectedDate.length === 0) {
    return "선택한 날짜의 Todo가 없습니다.";
  }

  return "해당 조건의 Todo가 없습니다.";
}

export function getTodoCountByDate(todos, dateKey) {
  return todos.filter((todo) => todo.date === dateKey).length;
}
