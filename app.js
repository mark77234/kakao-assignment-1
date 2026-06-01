const STORAGE_KEY = "todoApp.todos";
const FILTER_TYPES = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed"
};
const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];

// 앱에서 공유하는 단일 상태입니다.
const state = {
  todos: loadTodos(),
  selectedDate: formatDateKey(new Date()),
  currentFilter: FILTER_TYPES.ALL,
  currentWeekStart: ""
};

const todoInputElement = document.getElementById("todo-input");
const addTodoButtonElement = document.getElementById("add-todo-button");
const inputMessageElement = document.getElementById("input-message");
const selectedDateLabelElement = document.getElementById("selected-date-label");
const weekViewElement = document.getElementById("week-view");
const todoListElement = document.getElementById("todo-list");
const emptyStateElement = document.getElementById("empty-state");
const filterTabElements = document.querySelectorAll(".filter-tab");
const prevDayButtonElement = document.getElementById("prev-day-button");
const nextDayButtonElement = document.getElementById("next-day-button");
const prevWeekButtonElement = document.getElementById("prev-week-button");
const nextWeekButtonElement = document.getElementById("next-week-button");

state.currentWeekStart = getWeekStart(state.selectedDate);

bindEvents();
renderApp();

function bindEvents() {
  addTodoButtonElement.addEventListener("click", handleAddTodo);
  todoInputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleAddTodo();
    }
  });

  filterTabElements.forEach((tabElement) => {
    tabElement.addEventListener("click", () => {
      state.currentFilter = tabElement.dataset.filter;
      renderApp();
    });
  });

  prevDayButtonElement.addEventListener("click", () => {
    state.selectedDate = addDays(state.selectedDate, -1);
    state.currentWeekStart = getWeekStart(state.selectedDate);
    renderApp();
  });

  nextDayButtonElement.addEventListener("click", () => {
    state.selectedDate = addDays(state.selectedDate, 1);
    state.currentWeekStart = getWeekStart(state.selectedDate);
    renderApp();
  });

  prevWeekButtonElement.addEventListener("click", () => {
    state.currentWeekStart = addDays(state.currentWeekStart, -7);
    state.selectedDate = addDays(state.selectedDate, -7);
    renderApp();
  });

  nextWeekButtonElement.addEventListener("click", () => {
    state.currentWeekStart = addDays(state.currentWeekStart, 7);
    state.selectedDate = addDays(state.selectedDate, 7);
    renderApp();
  });

  weekViewElement.addEventListener("click", (event) => {
    const clickedButton = event.target.closest("button[data-date]");
    if (!clickedButton) {
      return;
    }
    state.selectedDate = clickedButton.dataset.date;
    state.currentWeekStart = getWeekStart(state.selectedDate);
    renderApp();
  });

  todoListElement.addEventListener("click", (event) => {
    const clickedButton = event.target.closest("button[data-action]");
    if (!clickedButton) {
      return;
    }

    const targetTodoId = clickedButton.closest("li[data-id]")?.dataset.id;
    if (!targetTodoId) {
      return;
    }

    const actionType = clickedButton.dataset.action;
    if (actionType === "toggle") {
      toggleTodo(targetTodoId);
      return;
    }
    if (actionType === "delete") {
      deleteTodo(targetTodoId);
      return;
    }
    if (actionType === "edit") {
      editTodo(targetTodoId);
    }
  });
}

function handleAddTodo() {
  const todoText = todoInputElement.value.trim();
  if (!todoText) {
    showInputMessage("할 일을 입력한 뒤 추가해 주세요.");
    return;
  }

  addTodo(todoText);
  todoInputElement.value = "";
  showInputMessage("");
}

function addTodo(todoText) {
  const newTodo = {
    id: createTodoId(),
    text: todoText,
    isCompleted: false,
    date: state.selectedDate
  };
  state.todos.push(newTodo);
  persistAndRender();
}

function editTodo(todoId) {
  const targetTodo = state.todos.find((todo) => todo.id === todoId);
  if (!targetTodo) {
    return;
  }

  const editedText = window.prompt("수정할 내용을 입력하세요.", targetTodo.text);
  if (editedText === null) {
    return;
  }

  const normalizedText = editedText.trim();
  if (!normalizedText) {
    showInputMessage("수정 내용은 비워둘 수 없습니다.");
    return;
  }

  updateTodo(todoId, normalizedText);
}

function updateTodo(todoId, nextText) {
  state.todos = state.todos.map((todo) => {
    if (todo.id !== todoId) {
      return todo;
    }
    return {
      ...todo,
      text: nextText
    };
  });
  persistAndRender();
}

function toggleTodo(todoId) {
  state.todos = state.todos.map((todo) => {
    if (todo.id !== todoId) {
      return todo;
    }
    return {
      ...todo,
      isCompleted: !todo.isCompleted
    };
  });
  persistAndRender();
}

function deleteTodo(todoId) {
  state.todos = state.todos.filter((todo) => todo.id !== todoId);
  persistAndRender();
}

function persistAndRender() {
  // 상태 변경 후 항상 저장 -> 재렌더 순서를 유지합니다.
  saveTodos(state.todos);
  renderApp();
}

function renderApp() {
  renderDateHeader();
  renderWeekView();
  renderFilterTabs();
  renderTodoList();
}

function renderDateHeader() {
  selectedDateLabelElement.textContent = formatReadableDate(state.selectedDate);
}

function renderWeekView() {
  const weekDates = getWeekRange(state.currentWeekStart);
  weekViewElement.innerHTML = weekDates
    .map((dateKey, index) => {
      const dateObject = parseDateKey(dateKey);
      const isSelectedDate = dateKey === state.selectedDate;
      const isTodayDate = isToday(dateKey);
      const todoCount = state.todos.filter((todo) => todo.date === dateKey).length;

      return `
        <button type="button" class="week-day ${isSelectedDate ? "is-selected" : ""} ${isTodayDate ? "is-today" : ""}" data-date="${dateKey}">
          <span class="week-day-name">${DAY_NAMES[index]}</span>
          <span class="week-day-date">${String(dateObject.getMonth() + 1).padStart(2, "0")}/${String(dateObject.getDate()).padStart(2, "0")}</span>
          <span class="week-day-count">${todoCount}개</span>
        </button>
      `;
    })
    .join("");
}

function renderFilterTabs() {
  filterTabElements.forEach((tabElement) => {
    const isActive = tabElement.dataset.filter === state.currentFilter;
    tabElement.classList.toggle("is-active", isActive);
    tabElement.setAttribute("aria-selected", String(isActive));
  });
}

function renderTodoList() {
  const visibleTodos = getVisibleTodos();
  todoListElement.innerHTML = visibleTodos
    .map((todo) => {
      return `
        <li class="todo-item ${todo.isCompleted ? "is-completed" : ""}" data-id="${todo.id}">
          <p class="todo-text">${escapeHtml(todo.text)}</p>
          <div class="todo-actions">
            <button type="button" class="todo-action-button" data-action="toggle">${todo.isCompleted ? "복구" : "완료"}</button>
            <button type="button" class="todo-action-button" data-action="edit">수정</button>
            <button type="button" class="todo-action-button" data-action="delete">삭제</button>
          </div>
        </li>
      `;
    })
    .join("");

  emptyStateElement.hidden = visibleTodos.length > 0;
}

function getVisibleTodos() {
  const todosForSelectedDate = state.todos.filter((todo) => todo.date === state.selectedDate);
  if (state.currentFilter === FILTER_TYPES.ALL) {
    return todosForSelectedDate;
  }
  if (state.currentFilter === FILTER_TYPES.ACTIVE) {
    return todosForSelectedDate.filter((todo) => !todo.isCompleted);
  }
  return todosForSelectedDate.filter((todo) => todo.isCompleted);
}

function showInputMessage(messageText) {
  inputMessageElement.textContent = messageText;
}

function formatDateKey(dateValue) {
  // Date를 로컬 기준 YYYY-MM-DD 문자열로 통일합니다.
  const dateObject = dateValue instanceof Date ? new Date(dateValue) : parseDateKey(dateValue);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(dateKey, offsetDays) {
  const movedDate = parseDateKey(dateKey);
  movedDate.setDate(movedDate.getDate() + offsetDays);
  return formatDateKey(movedDate);
}

function getWeekStart(dateInput) {
  // 주간 뷰 기준은 월요일 시작입니다.
  const baseDate = typeof dateInput === "string" ? parseDateKey(dateInput) : new Date(dateInput);
  const day = baseDate.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  baseDate.setDate(baseDate.getDate() + diffToMonday);
  return formatDateKey(baseDate);
}

function getWeekRange(weekStartDateKey) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStartDateKey, index));
}

function isToday(dateKey) {
  return dateKey === formatDateKey(new Date());
}

function formatReadableDate(dateKey) {
  const dateObject = parseDateKey(dateKey);
  return dateObject.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  });
}

function createTodoId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function saveTodos(todos) {
  // localStorage에는 문자열만 저장 가능하므로 JSON 직렬화를 사용합니다.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const storedValue = localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return normalizeTodos(parsedValue);
  } catch (error) {
    return [];
  }
}

function normalizeTodos(rawTodos) {
  if (!Array.isArray(rawTodos)) {
    return [];
  }

  return rawTodos
    .filter((todo) => {
      return typeof todo?.id === "string" && typeof todo?.text === "string" && typeof todo?.date === "string";
    })
    .map((todo) => {
      return {
        id: todo.id,
        text: todo.text,
        isCompleted: Boolean(todo.isCompleted),
        date: todo.date
      };
    });
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
