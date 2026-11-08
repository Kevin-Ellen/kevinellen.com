// src/content-schema/content/modules/article-footer.module.content.content-schema.authored.type.ts

export type ArticleFooterModuleContentAuthored = Readonly<{
  kind: "articleFooter";
  fieldNotes: Readonly<{
    cameras: readonly string[];
    lenses: readonly string[];
  }>;
}>;
