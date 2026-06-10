# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

components/

- AppHeader.jsx 날짜 이동 헤더
- WeekCalendar.jsx 주간 날짜 선택
- TodoInput.jsx Todo 추가 form
- TodoFilter.jsx 전체/진행중/완료 탭
- TodoList.jsx 빈 상태 or 리스트 렌더링
- TodoItem.jsx 개별 Todo 수정/완료/삭제

utils/todoUtils.js

- createTodoId
- normalizeTodos
- getFilteredTodos
- getEmptyStateMessage
- getTodoCountByDate

utils/storageUtils.js

- saveTodos
- loadTodos
- saveDate
- loadDate
- loadSelectedDate
- loadWeekStartDate

utils/dateUtils.js

- formatDateKey
- parseDateKey
- addDays
- getWeekStart
- getWeekRange
- isToday
- isValidDateKey
- formatReadableDate

constants/todoConstants.js

- TODOS_STORAGE_KEY
- SELECTED_DATE_STORAGE_KEY
- WEEK_START_STORAGE_KEY
- FILTER_TYPES
- FILTER_OPTIONS
- DAY_NAMES
