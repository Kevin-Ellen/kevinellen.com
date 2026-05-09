// src/rendering/body-content/body-content.renderer.ts

import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

import { renderBodyContentFooter } from "@rendering/body-content/footer/footer.renderer";
import { renderBodyContentHeader } from "@rendering/body-content/header.body-content.renderer";
import { renderBlock } from "@rendering/body-content/block/block.renderer";

export const renderBodyContent = (
  bodyContent: AppRenderContextBodyContent,
): string =>
  [
    `<main class="l-main">`,
    `<div class="l-page__frame">`,
    renderBodyContentHeader(bodyContent.header),
    bodyContent.content.map(renderBlock).join(""),
    renderBodyContentFooter(bodyContent.footer),
    `</div>`,
    `</main>`,
  ].join("");
