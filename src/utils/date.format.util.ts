// src/utils/date.format.util.ts

type DateFormatOptions = Readonly<{
  includeTime?: boolean;
}>;

const formatDateParts = (date: Date, includeTime: boolean): string => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  return formatter.format(date);
};

export const formatDate = (
  value: string | Date,
  options: DateFormatOptions = {},
): string => {
  const { includeTime = false } = options;

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: "${value}"`);
  }

  return formatDateParts(date, includeTime);
};
