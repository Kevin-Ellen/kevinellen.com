// shared-types/page-content/site/content-head/authored.content-head.types.ts

export type AuthoredPageContentHead = Readonly<{
  eyebrow?: string;
  title: string;
  intro?: string;
  showInBody?: boolean;
}>;
