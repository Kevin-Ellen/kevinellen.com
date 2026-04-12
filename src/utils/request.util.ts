// src/app/request/request.util.ts

export const getRequestPath = (req: Request): string => {
  const url = new URL(req.url);

  if (url.pathname === "/") return "/";

  // remove trailing slash
  const path = url.pathname.endsWith("/")
    ? url.pathname.slice(0, -1)
    : url.pathname;

  // enforce lowercase for deterministic matching
  return path.toLowerCase();
};
