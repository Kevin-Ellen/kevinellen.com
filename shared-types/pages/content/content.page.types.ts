// shared-types/pages/content/content.page.types.ts

export type PageContent = Readonly<{
  head?: unknown;
  body: readonly unknown[];
  footer?: readonly unknown[];
}>;
