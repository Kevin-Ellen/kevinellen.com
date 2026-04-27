// packages/content-pipeline/src/utils/format.local.date.time.with.offset.util.ts

const pad = (value: number): string => String(value).padStart(2, "0");

export const formatLocalDateTimeWithOffset = (date: Date): string => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = pad(Math.floor(absoluteOffsetMinutes / 60));
  const offsetRemainingMinutes = pad(absoluteOffsetMinutes % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetRemainingMinutes}`;
};
