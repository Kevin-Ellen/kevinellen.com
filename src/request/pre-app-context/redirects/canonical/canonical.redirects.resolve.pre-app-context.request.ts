// src/request/pre-app-context/redirects/canonical/canonical.redirects.resolve.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";

export const resolveCanonicalUrl = (
  inputUrl: URL,
  appState: AppState,
  env: Env,
): URL => {
  const url = new URL(inputUrl.href);

  const isProd = env.APP_ENV === "prod";

  if (isProd) {
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.replace(/^www\./, "");
    }
  }

  if (isProd && url.protocol !== "https:") {
    url.protocol = "https:";
  }

  const isRoot = url.pathname === "/";

  if (!isRoot) {
    url.pathname = url.pathname.toLowerCase();

    if (url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }
  }
  return url;
};
