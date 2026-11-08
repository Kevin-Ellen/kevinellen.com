// src/app/life-cycle/app-render-context/resolvers/document/head/head.document.resolver.app-render-context.test.ts

import { resolveHeadDocumentAppRenderContext } from "./head.document.resolver.app-render-context";

type Input = Parameters<typeof resolveHeadDocumentAppRenderContext>[0];
type Scripts = Input["scripts"];
type Script = Scripts["registry"][keyof Scripts["registry"]];
type Content = Input["content"];

describe("Document head AppRenderContext resolver", () => {
  const createScript = (id: string, location: "head" | "end"): Script =>
    ({
      id,
      location,
    }) as unknown as Script;

  const createScripts = (
    global: readonly string[] = ["global-head"],
  ): Scripts =>
    ({
      global,
      registry: {
        "global-head": createScript("global-head", "head"),
        "page-head": createScript("page-head", "head"),
        "end-only": createScript("end-only", "end"),
      },
    }) as unknown as Scripts;

  const getScript = (scripts: Scripts, id: string): Script | undefined =>
    (scripts.registry as Record<string, Script>)[id];

  const site = {
    canonicalDomain: "https://kevinellen.com",
    locale: "en-GB",
    themeColor: "#26382d",
    icons: [],
    manifest: "/manifest.webmanifest",
  } as unknown as Input["site"];

  const structuredData = [] as unknown as Input["structuredData"];

  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      slug: "/journals/forest",
      metadata: {
        title: "Forest Journal | Kevin Ellen",
        description: "Observations from Epping Forest",
      },
      scripts: ["page-head"],
      ...overrides,
    }) as unknown as Content;

  const resolve = (overrides: Partial<Input> = {}) =>
    resolveHeadDocumentAppRenderContext({
      site,
      content: createContent(),
      scripts: createScripts(),
      structuredData,
      ...overrides,
    });

  it("uses the resolved page title and description", () => {
    const result = resolve();

    expect(result.title).toBe("Forest Journal | Kevin Ellen");
    expect(result.description).toBe("Observations from Epping Forest");
  });

  it("constructs an absolute canonical URL", () => {
    expect(resolve().canonical).toBe("https://kevinellen.com/journals/forest");
  });

  it("supports a canonical URL at the website root", () => {
    const result = resolve({
      content: createContent({ slug: "/" }),
    });

    expect(result.canonical).toBe("https://kevinellen.com/");
  });

  it("returns null when the content has no slug", () => {
    const result = resolve({
      content: createContent({ slug: null }),
    });

    expect(result.canonical).toBeNull();
  });

  it("preserves the site presentation configuration", () => {
    const result = resolve();

    expect(result.locale).toBe(site.locale);
    expect(result.themeColor).toBe(site.themeColor);
    expect(result.icons).toBe(site.icons);
    expect(result.manifest).toBe(site.manifest);
  });

  it("preserves the structured-data registry reference", () => {
    const result = resolve();

    expect(result.structuredData).toBe(structuredData);
  });

  it("selects global and page-specific head scripts", () => {
    const result = resolve();

    expect(result.scripts.map((script) => script.id)).toEqual([
      "global-head",
      "page-head",
    ]);
  });

  it("excludes end-of-document scripts", () => {
    const result = resolve({
      scripts: createScripts(["global-head", "end-only"]),
      content: createContent({
        scripts: ["page-head", "end-only"],
      }),
    });

    expect(result.scripts.map((script) => script.id)).toEqual([
      "global-head",
      "page-head",
    ]);
  });

  it("deduplicates global and page-specific scripts", () => {
    const result = resolve({
      scripts: createScripts(["global-head", "page-head"]),
      content: createContent({
        scripts: ["page-head", "global-head"],
      }),
    });

    expect(result.scripts.map((script) => script.id)).toEqual([
      "global-head",
      "page-head",
    ]);
  });

  it("preserves the original script registry references", () => {
    const scripts = createScripts();
    const result = resolve({ scripts });

    expect(result.scripts[0]).toBe(getScript(scripts, "global-head"));
    expect(result.scripts[1]).toBe(getScript(scripts, "page-head"));
  });

  it("silently skips an unknown script ID", () => {
    const result = resolve({
      content: createContent({
        scripts: ["missing", "page-head"],
      }),
    });

    expect(result.scripts.map((script) => script.id)).toEqual([
      "global-head",
      "page-head",
    ]);
  });

  it("supports no selected scripts", () => {
    const result = resolve({
      scripts: createScripts([]),
      content: createContent({ scripts: [] }),
    });

    expect(result.scripts).toEqual([]);
  });

  it("preserves the original content and script collections", () => {
    const content = createContent();
    const scripts = createScripts();

    const originalPageScripts = content.scripts;
    const originalGlobalScripts = scripts.global;

    resolve({ content, scripts });

    expect(content.scripts).toBe(originalPageScripts);
    expect(scripts.global).toBe(originalGlobalScripts);
  });

  it("propagates invalid canonical URL errors", () => {
    const invalidSite = {
      ...site,
      canonicalDomain: "not-a-valid-base-url",
    } as Input["site"];

    expect(() => resolve({ site: invalidSite })).toThrow("Invalid URL");
  });
});
