import {
  SELECTED_DATE_STORAGE_KEY,
  TODOS_STORAGE_KEY,
  WEEK_START_STORAGE_KEY,
} from "../constants/todoConstants";
import { formatDateKey, getWeekStart, isValidDateKey } from "./dateUtils";
import { normalizeTodos } from "./todoUtils";

export function saveTodos(todos) {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}

export function loadTodos() {
  const storedValue = localStorage.getItem(TODOS_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    return normalizeTodos(parsedValue);
  } catch {
    return [];
  }
}

export function saveDate(storageKey, dateKey) {
  localStorage.setItem(storageKey, dateKey);
}

export function loadDate(storageKey, fallbackDate) {
  const storedDate = localStorage.getItem(storageKey);

  return isValidDateKey(storedDate) ? storedDate : fallbackDate;
}

export function loadSelectedDate() {
  return loadDate(SELECTED_DATE_STORAGE_KEY, formatDateKey(new Date()));
}

export function loadWeekStartDate(selectedDate) {
  const fallbackWeekStartDate = getWeekStart(selectedDate);

  const storedWeekStartDate = loadDate(
    WEEK_START_STORAGE_KEY,
    fallbackWeekStartDate,
  );

  if (getWeekStart(selectedDate) !== storedWeekStartDate) {
    return fallbackWeekStartDate;
  }

  return storedWeekStartDate;
}
