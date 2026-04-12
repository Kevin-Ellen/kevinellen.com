// src/app/rendering/utils/formatDate.util.ts

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};
