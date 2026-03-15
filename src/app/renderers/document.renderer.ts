// src/app/renderer/document.renderer.ts

import type { AppPage } from "@types-src/appPage.types";

import renderDocHead from "@app.renderers/partials/docHead.partial";
import renderPageHead from "@app.renderers/partials/pageHead.partial";
import renderPageFooter from "@app.renderers/partials/pageFooter.partial";
import renderPageScripts from "@app.renderers/partials/pageScripts.partial";
import renderDocFooter from "@app.renderers/partials/docFooter.partial";

const documentRenderer = (page: AppPage): string => {
  return [
    renderDocHead(),
    renderPageHead(),
    `<main>${page.content}</main>`,
    renderPageFooter(),
    renderPageScripts(),
    renderDocFooter(),
  ].join("");
};
export default documentRenderer;
