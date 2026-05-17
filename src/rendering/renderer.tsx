// src/rendering/renderer.tsx

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

import { DocumentTemplate } from "@rendering/document.template";

export const render = (appRenderContext: AppRenderContext): string =>
  `<!doctype html>${renderToStaticMarkup(
    createElement(DocumentTemplate, {
      appRenderContext,
    }),
  )}`;
