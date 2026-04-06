// src/app/appContext/content/content.appContext.types.ts

export type AppContextContentSection = {
  kind: "contentSection";
  heading?: {
    text: string;
    visuallyHidden?: boolean;
    level: 2 | 3 | 4 | 5 | 6;
  };
  modules: readonly AppContextContentLeafModule[];
};

type AppContextContentLeafModule =
  | {
      kind: "paragraph";
      text: string;
    }
  | {
      kind: "quote";
      text: string;
      attribution?: string;
    };

export type AppContextPageHeadContent = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type AppContextPageBodyContent = {
  head: AppContextPageHeadContent;
  sections: readonly AppContextContentSection[];
};
