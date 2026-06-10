import { DAY_NAMES } from "../constants/todoConstants";
import { isToday, parseDateKey } from "../utils/dateUtils";
import { getTodoCountByDate } from "../utils/todoUtils";

export default function WeekCalendar({
  weekDates,
  selectedDate,
  todos,
  onMoveWeek,
  selectDate,
}) {
  return (
    <section className="week-section" aria-label="주간 뷰">
      <div className="week-nav">
        <button
          type="button"
          className="text-button"
          onClick={() => onMoveWeek(-1)}
        >
          이전 주
        </button>
        <button
          type="button"
          className="text-button"
          onClick={() => onMoveWeek(1)}
        >
          다음 주
        </button>
      </div>
      <div className="week-grid">
        {weekDates.map((dateKey, index) => {
          const dateObject = parseDateKey(dateKey);
          const isSelectedDate = selectedDate === dateKey;
          const isTodayDate = isToday(dateKey);
          const todoCount = getTodoCountByDate(todos, dateKey);

          return (
            <button
              key={dateKey}
              type="button"
              className={`week-day ${isSelectedDate ? "is-selected" : ""} ${
                isTodayDate ? "is-today" : ""
              }`}
              data-date={dateKey}
              aria-pressed={isSelectedDate}
              onClick={() => selectDate(dateKey)}
            >
              <span className="week-day-name">{DAY_NAMES[index]}</span>
              <span className="week-day-date">
                {String(dateObject.getMonth() + 1).padStart(2, "0")}/
                {String(dateObject.getDate()).padStart(2, "0")}
              </span>
              <span className="week-day-count">{todoCount}개</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
