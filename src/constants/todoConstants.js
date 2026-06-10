export const TODOS_STORAGE_KEY = "todoApp.todos";
export const SELECTED_DATE_STORAGE_KEY = "todoApp.selectedDate";
export const WEEK_START_STORAGE_KEY = "todoApp.weekStartDate";

export const FILTER_TYPES = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

export const FILTER_OPTIONS = [
  { label: "전체", value: FILTER_TYPES.ALL },
  { label: "진행 중", value: FILTER_TYPES.ACTIVE },
  { label: "완료", value: FILTER_TYPES.COMPLETED },
];

export const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];
