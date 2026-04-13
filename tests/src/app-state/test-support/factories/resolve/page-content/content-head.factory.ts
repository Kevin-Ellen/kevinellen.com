// tests/src/app-state/test-support/factories/resolve/page-content/content-head.factory.ts

import type { AuthoredPageContentHead } from "@shared-types/page-content/site/content-head/authored.content-head.page-content.types";
import type { AppStatePageContentHead } from "@shared-types/page-content/site/content-head/app-state.content-head.page-content.types";

export const makeAuthoredPageContentHead = (
  overrides: Omit<Partial<AuthoredPageContentHead>, "title"> & {
    title?: AuthoredPageContentHead["title"];
  } = {},
): AuthoredPageContentHead => {
  return {
    title: overrides.title ?? "Default title",
    ...overrides,
  };
};

export const makeAppStatePageContentHead = (
  overrides: Partial<AppStatePageContentHead> = {},
): AppStatePageContentHead => {
  return {
    title: "Default title",
    eyebrow: null,
    intro: null,
    ...overrides,
  };
};
