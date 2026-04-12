// src/app/appContext/helpers/publishedDate.sort.helper.appContext.ts

export const sortContentByPublished = (
  dateA: string,
  dateB: string,
): number => {
  return new Date(dateB).getTime() - new Date(dateA).getTime();
};
