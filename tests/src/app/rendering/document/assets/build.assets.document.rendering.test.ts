// tests/src/app/rendering/document/assets/build.assets.document.rendering.test.ts

import { buildAssets } from "@app/rendering/document/assets/build.assets.document.rendering";
import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";
import type { ScriptAsset } from "@app/assets/scripts/scripts.assets.types";
import type { SvgAsset } from "@app/assets/svgs/svgs.assets.types";

const createInlineScript = (id: string, content: string): ScriptAsset => ({
  id,
  kind: "inline",
  content,
  location: "footer",
});

const createSvg = (id: string): SvgAsset => ({
  id,
  viewBox: "0 0 24 24",
  content: `<path d="${id}" />`,
});

const createPage = (
  scripts: readonly ScriptAsset[] = [],
  svgs: readonly SvgAsset[] = [],
): PageDefinition =>
  ({
    core: {
      id: "home",
      kind: "home",
      label: "Home",
      slug: "/",
      renderMode: "request-composed",
    },
    config: {
      robots: {
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
      robotsTxt: {
        disallow: false,
      },
      sitemap: {
        include: true,
      },
    },
    docHead: {
      pageTitle: "Home",
      metaDescription: "Home page",
    },
    pageHead: {
      breadcrumbs: ["home"],
    },
    content: {
      head: {
        eyebrow: "Eyebrow",
        title: "Title",
        intro: "Intro",
      },
      body: [],
      footer: [],
    },
    docFooter: {
      scripts,
      svgs,
      structuredData: [],
    },
  }) as PageDefinition;

const createAppState = (
  scripts: readonly ScriptAsset[] = [],
  svgs: readonly SvgAsset[] = [],
): AppState =>
  ({
    appAssets: {
      scripts,
      svgs,
    },
  }) as AppState;

describe("buildAssets", () => {
  it("returns global assets when page assets are empty", () => {
    const globalScript = createInlineScript(
      "global-script",
      "console.log('a');",
    );
    const globalSvg = createSvg("global-icon");

    const appState = createAppState([globalScript], [globalSvg]);
    const page = createPage();

    const result = buildAssets(appState, page);

    expect(result.scripts).toEqual([globalScript]);
    expect(result.svgs).toEqual([globalSvg]);
  });

  it("returns page assets when global assets are empty", () => {
    const pageScript = createInlineScript("page-script", "console.log('b');");
    const pageSvg = createSvg("page-icon");

    const appState = createAppState();
    const page = createPage([pageScript], [pageSvg]);

    const result = buildAssets(appState, page);

    expect(result.scripts).toEqual([pageScript]);
    expect(result.svgs).toEqual([pageSvg]);
  });

  it("merges global and page assets when ids are unique", () => {
    const globalScript = createInlineScript(
      "global-script",
      "console.log('a');",
    );
    const pageScript = createInlineScript("page-script", "console.log('b');");

    const globalSvg = createSvg("global-icon");
    const pageSvg = createSvg("page-icon");

    const appState = createAppState([globalScript], [globalSvg]);
    const page = createPage([pageScript], [pageSvg]);

    const result = buildAssets(appState, page);

    expect(result.scripts).toEqual([globalScript, pageScript]);
    expect(result.svgs).toEqual([globalSvg, pageSvg]);
  });

  it("deduplicates scripts by id and keeps the first occurrence", () => {
    const globalScript = createInlineScript(
      "shared-script",
      "console.log('global');",
    );
    const pageScript = createInlineScript(
      "shared-script",
      "console.log('page');",
    );

    const appState = createAppState([globalScript], []);
    const page = createPage([pageScript], []);

    const result = buildAssets(appState, page);

    expect(result.scripts).toEqual([globalScript]);
  });

  it("deduplicates svgs by id and keeps the first occurrence", () => {
    const globalSvg = createSvg("shared-icon");
    const pageSvg = {
      id: "shared-icon",
      viewBox: "0 0 24 24",
      content: `<path d="page" />`,
    } as SvgAsset;

    const appState = createAppState([], [globalSvg]);
    const page = createPage([], [pageSvg]);

    const result = buildAssets(appState, page);

    expect(result.svgs).toEqual([globalSvg]);
  });

  it("preserves deterministic order based on first appearance", () => {
    const globalScriptA = createInlineScript("a", "a");
    const globalScriptB = createInlineScript("b", "b");
    const pageScriptB = createInlineScript("b", "page-b");
    const pageScriptC = createInlineScript("c", "c");

    const appState = createAppState([globalScriptA, globalScriptB], []);
    const page = createPage([pageScriptB, pageScriptC], []);

    const result = buildAssets(appState, page);

    expect(result.scripts.map((script) => script.id)).toEqual(["a", "b", "c"]);
  });

  it("returns empty arrays when both sources are empty", () => {
    const appState = createAppState();
    const page = createPage();

    const result = buildAssets(appState, page);

    expect(result).toEqual({
      scripts: [],
      svgs: [],
    });
  });
});
