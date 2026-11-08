// src/app/content/errors/404.error.static.content.authored.ts

import type { ErrorContentAuthored } from "../../../content-schema/content/error.content.content-schema.authored.type";

export const notFoundContentAuthored = {
  kind: "error",
  render: "static",
  pageType: "standard",
  label: "404 | Page not found",
  id: "404-error",
  status: 404,
  breadcrumbs: ["home"],
  dates: {
    created: "2026-04-26",
  },

  metadata: {
    title: "Page Not Found",
    description: "The requested page could not be found.",
  },
  body: {
    modules: [],
  },
} as const satisfies ErrorContentAuthored;
