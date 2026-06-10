export function formatDateKey(dateValue) {
  const dateObject =
    dateValue instanceof Date ? new Date(dateValue) : parseDateKey(dateValue);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function addDays(dateKey, offsetDays) {
  const movedDate = parseDateKey(dateKey);
  movedDate.setDate(movedDate.getDate() + offsetDays);

  return formatDateKey(movedDate);
}

export function getWeekStart(dateKey) {
  const baseDate = parseDateKey(dateKey);
  const day = baseDate.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  baseDate.setDate(baseDate.getDate() + diffToMonday);

  return formatDateKey(baseDate);
}

export function getWeekRange(weekStartDate) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStartDate, index));
}

export function isToday(dateKey) {
  return dateKey === formatDateKey(new Date());
}

export function isValidDateKey(dateKey) {
  if (typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return false;
  }

  return formatDateKey(parseDateKey(dateKey)) === dateKey;
}

export function formatReadableDate(dateKey) {
  const dateObject = parseDateKey(dateKey);

  return dateObject.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}
