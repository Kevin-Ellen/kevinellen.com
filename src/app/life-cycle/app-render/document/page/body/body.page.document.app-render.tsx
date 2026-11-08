// src/app/life-cycle/app-render/document/page/body/body.page.document.app-render.tsx

import type { ContentBodyAppRenderContext } from "../../../../../types/document/page/body.page.document.app-render-context.type";

import { Module } from "./modules/module.body.page.document.app-render";

type Props = Readonly<{
  body: ContentBodyAppRenderContext;
}>;

export const ContentBody = ({ body }: Props) => (
  <>
    {body.modules.map((module, index) => (
      <Module key={index} module={module} />
    ))}

    {body.footer.map((module, index) => (
      <Module key={index} module={module} />
    ))}
  </>
);
