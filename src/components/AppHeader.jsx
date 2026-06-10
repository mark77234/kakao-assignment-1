export default function AppHeader({ selectedDateLabel, onMoveDate }) {
  return (
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
          onClick={() => onMoveDate(-1)}
        >
          ‹
        </button>

        <p className="selected-date-text">{selectedDateLabel}</p>

        <button
          type="button"
          className="icon-button"
          aria-label="다음 날짜"
          onClick={() => onMoveDate(1)}
        >
          ›
        </button>
      </div>
    </header>
  );
}
