// src/app/renderers/partials/docFooter.partial.ts

import type { DocFooter, DocScript } from "@types-src/appPage.types";
import type {
  RenderedFragment,
  RenderedInlineAsset,
} from "@types-src/renderedDocument.types";

const renderDocFooter = (docFooter: DocFooter): RenderedFragment => {
  const inlineSvgSpriteHtml = renderInlineSvgSprite(docFooter.inlineSvgSprite);

  const structuredDataFragment = renderStructuredData(docFooter.structuredData);
  const scriptsFragment = renderScripts(docFooter.scripts);

  return {
    html: [
      inlineSvgSpriteHtml,
      structuredDataFragment.html,
      scriptsFragment.html,
      `</body>`,
      `</html>`,
    ].join(""),
    inlineAssets: [
      ...structuredDataFragment.inlineAssets,
      ...scriptsFragment.inlineAssets,
    ],
  };
};

export default renderDocFooter;

const renderInlineSvgSprite = (inlineSvgSprite: string[]): string => {
  if (inlineSvgSprite.length === 0) {
    return "";
  }

  return [
    `<svg aria-hidden="true" focusable="false" width="0" height="0" class="u-hidden-svg-sprite">`,
    inlineSvgSprite.join(""),
    `</svg>`,
  ].join("");
};

const renderStructuredData = (
  structuredData: DocFooter["structuredData"],
): RenderedFragment => {
  if (structuredData.length === 0) {
    return {
      html: "",
      inlineAssets: [],
    };
  }

  const inlineAssets: RenderedInlineAsset[] = structuredData.map((node) => ({
    kind: "script",
    content: JSON.stringify(node),
  }));

  const html = inlineAssets
    .map((asset) =>
      [`<script type="application/ld+json">`, asset.content, `</script>`].join(
        "",
      ),
    )
    .join("");

  return {
    html,
    inlineAssets,
  };
};

const renderScripts = (scripts: DocScript[]): RenderedFragment => {
  const footerScripts = scripts.filter(
    (script) => script.location === "footer",
  );

  if (footerScripts.length === 0) {
    return {
      html: "",
      inlineAssets: [],
    };
  }

  const inlineAssets: RenderedInlineAsset[] = [];
  const html = footerScripts
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
