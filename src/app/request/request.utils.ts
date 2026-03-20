// src/app/request/request.utils.ts

export const getRequestPath = (req: Request): string => {
  return new URL(req.url).pathname;
};
