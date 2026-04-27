// src/rendering/body-content/header.body-content.renderer.ts

import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

type Header = AppRenderContextBodyContent["header"];

export const renderBodyContentHeader = (header: Header): string => {
  const eyebrow = header.eyebrow
    ? `<p class="m-heading__eyebrow">${escapeHtml(header.eyebrow)}</p>`
    : "";

  const intro = header.intro
    ? `<p class="m-heading__intro">${escapeHtml(header.intro)}</p>`
    : "";

  return `<header class="m-heading l-content">
    ${eyebrow}
    <h1 class="m-heading__title">${escapeHtml(header.title)}</h1>
    ${intro}
  </header>`;
};
