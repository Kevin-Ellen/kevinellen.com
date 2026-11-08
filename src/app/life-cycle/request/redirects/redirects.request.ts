// src/app/life-cycle/request/redirects/redirects.request.ts

import type { RedirectStatus } from "../../../types/system/redirects.system.type";
import type { RedirectEntry } from "../config.request";

export type ResolvedRedirect = Readonly<{
  url: URL;
  status: RedirectStatus;
  external: boolean;
}>;

type Input = Readonly<{
  original: URL;
  redirects: readonly RedirectEntry[];
  defaultStatus: RedirectStatus;
}>;

const normalisePath = (pathname: string): string =>
  pathname.replace(/\/+$/, "") || "/";

export const resolveRedirect = ({
  original,
  redirects,
  defaultStatus,
}: Input): ResolvedRedirect | null => {
  const visited = new Set<string>();

  let current = new URL(original);
  let status: RedirectStatus = defaultStatus;

  while (true) {
    const path = normalisePath(current.pathname);

    if (visited.has(current.href)) {
      throw new Error(`Redirect loop detected: ${current.href}`);
    }

    visited.add(current.href);

    const rule = redirects.find(({ from }) => normalisePath(from) === path);

    if (!rule) {
      break;
    }

    const destination = new URL(rule.to, current);

    if (!rule.to.includes("?")) {
      destination.search = current.search;
    }

    if (destination.href === current.href) {
      throw new Error(`Self redirect detected: ${current.href}`);
    }

    status = rule.status ?? defaultStatus;
    current = destination;

    if (current.origin !== original.origin) {
      break;
    }
  }

  if (current.href === original.href) {
    return null;
  }

  return {
    url: current,
    status,
    external: current.origin !== original.origin,
  };
};
