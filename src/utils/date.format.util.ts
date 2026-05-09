// src/utils/date.format.util.ts

type DateFormatOptions = Readonly<{
  includeTime?: boolean;
  timeZone?: string;
}>;

const createDateFormatOptions = (
  timeZone?: string,
): Intl.DateTimeFormatOptions => ({
  day: "numeric",
  month: "long",
  year: "numeric",
  ...(timeZone && { timeZone }),
});

const createTimeFormatOptions = (
  timeZone?: string,
): Intl.DateTimeFormatOptions => ({
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  ...(timeZone && { timeZone }),
});

const formatDateParts = (
  date: Date,
  includeTime: boolean,
  timeZone?: string,
): string => {
  const datePart = new Intl.DateTimeFormat(
    "en-GB",
    createDateFormatOptions(timeZone),
  ).format(date);

  if (!includeTime) {
    return datePart;
  }

  const timePart = new Intl.DateTimeFormat(
    "en-GB",
    createTimeFormatOptions(timeZone),
  ).format(date);

  return `${datePart}, ${timePart}`;
};

export const formatDate = (
  value: string | Date,
  options: DateFormatOptions = {},
): string => {
  const { includeTime = false, timeZone } = options;

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: "${value}"`);
  }

  return formatDateParts(date, includeTime, timeZone);
};
