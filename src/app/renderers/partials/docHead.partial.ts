// src/app/renderers/partials/docHead.partial.ts

import type { DocHead, DocScript } from "@types-src/appPage.types";
import type { SiteConfig } from "@types-src/siteConfig.types";
import type {
  RenderedFragment,
  RenderedInlineAsset,
} from "@types-src/renderedDocument.types";

const renderDocHead = (
  siteConfig: SiteConfig,
  docHead: DocHead,
  css: string,
  scripts: DocScript[],
): RenderedFragment => {
  const headScriptsFragment = renderHeadScripts(scripts);

  return {
    html: `
<!doctype html>
<html lang="${siteConfig.language}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${docHead.pageTitle}</title>
    <meta name="description" content="${docHead.metaDescription}">
    <style>${css}</style>
    ${headScriptsFragment.html}
  </head>
  <body class="l-page">`,
    inlineAssets: [
      {
        kind: "style",
        content: css,
      },
      ...headScriptsFragment.inlineAssets,
    ],
  };
};

export default renderDocHead;

const renderHeadScripts = (scripts: DocScript[]): RenderedFragment => {
  const headScripts = scripts.filter((script) => script.location === "head");

  if (headScripts.length === 0) {
    return {
      html: "",
      inlineAssets: [],
    };
  }

  const inlineAssets: RenderedInlineAsset[] = [];
  const html = headScripts
    .map((script) => {
      if (script.kind === "inline") {
        inlineAssets.push({
          kind: "script",
          content: script.content,
        });

        return [
          `<script${script.type ? ` type="${script.type}"` : ""}>`,
          script.content,
          `</script>`,
        ].join("");
      }

      return [
        `<script src="${script.src}"`,
        script.type ? ` type="${script.type}"` : "",
        script.defer ? ` defer` : "",
        script.async ? ` async` : "",
        `></script>`,
      ].join("");
    })
    .join("");

  return {
    html,
    inlineAssets,
  };
};
