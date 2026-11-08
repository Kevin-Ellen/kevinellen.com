// src/app/life-cycle/app-render-context/resolvers/document/end/end.document.resolver.app-render-context.test.ts

import { resolveDocumentEndAppRenderContext } from "./end.document.resolver.app-render-context";

type Input = Parameters<typeof resolveDocumentEndAppRenderContext>[0];
type Scripts = Input["scripts"];
type Script = Scripts["registry"][keyof Scripts["registry"]];
type Content = Input["content"];
type Svgs = Input["svgs"];

describe("Document end AppRenderContext resolver", () => {
  const createScript = (id: string, location: "head" | "end"): Script =>
    ({
      id,
      location,
    }) as unknown as Script;

  const createScripts = (global: readonly string[] = ["test-end"]): Scripts =>
    ({
      global,
      registry: {
        "test-end": createScript("test-end", "end"),
        "page-end": createScript("page-end", "end"),
        "test-head": createScript("test-head", "head"),
      },
    }) as unknown as Scripts;

  const createContent = (ids: readonly string[] = ["page-end"]): Content =>
    ({
      scripts: ids,
    }) as unknown as Content;

  const createSvgs = (): Svgs =>
    ({
      camera: { id: "camera" },
      arrow: { id: "arrow" },
    }) as unknown as Svgs;

  // Synthetic IDs are intentionally outside the production ScriptAssetId union.
  const getScript = (scripts: Scripts, id: string): Script | undefined =>
    (scripts.registry as Record<string, Script>)[id];

  const resolve = (overrides: Partial<Input> = {}) =>
    resolveDocumentEndAppRenderContext({
      scripts: createScripts(),
      svgs: createSvgs(),
      content: createContent(),
      ...overrides,
    });

  it("selects global and page-specific end scripts", () => {
    const result = resolve();

    expect(result.scripts.map((script) => script.id)).toEqual([
      "test-end",
      "page-end",
    ]);
  });

  it("excludes scripts assigned to the document head", () => {
    const result = resolve({
      scripts: createScripts(["test-head", "test-end"]),
      content: createContent(["page-end", "test-head"]),
    });

    expect(result.scripts.map((script) => script.id)).toEqual([
      "test-end",
      "page-end",
    ]);
  });

  it("deduplicates global and page-specific script IDs", () => {
    const result = resolve({
      scripts: createScripts(["test-end", "page-end"]),
      content: createContent(["page-end", "test-end"]),
    });

    expect(result.scripts.map((script) => script.id)).toEqual([
      "test-end",
      "page-end",
    ]);
  });

  it("preserves script references from the registry", () => {
    const scripts = createScripts();

    const result = resolve({ scripts });

    expect(result.scripts).toHaveLength(2);
    expect(result.scripts[0]).toBe(getScript(scripts, "test-end"));
    expect(result.scripts[1]).toBe(getScript(scripts, "page-end"));
  });

  it("includes every registered SVG value", () => {
    const svgs = createSvgs();
    const result = resolve({ svgs });

    expect(result.svg).toEqual(Object.values(svgs));
    expect(result.svg[0]).toBe(Object.values(svgs)[0]);
  });

  it("supports empty script selections and SVG registries", () => {
    const result = resolve({
      scripts: createScripts([]),
      content: createContent([]),
      svgs: {},
    });

    expect(result).toEqual({
      svg: [],
      scripts: [],
    });
  });

  it("throws for an unknown global script", () => {
    expect(() =>
      resolve({
        scripts: createScripts(["missing"]),
        content: createContent([]),
      }),
    ).toThrow("Unknown script: missing");
  });

  it("throws for an unknown page-specific script", () => {
    expect(() =>
      resolve({
        content: createContent(["missing"]),
      }),
    ).toThrow("Unknown script: missing");
  });

  it("throws for an unknown script even when another script is valid", () => {
    expect(() =>
      resolve({
        content: createContent(["page-end", "missing"]),
      }),
    ).toThrow("Unknown script: missing");
  });

  it("does not mutate the original script selections", () => {
    const scripts = createScripts();
    const content = createContent();

    const originalGlobal = scripts.global;
    const originalPageScripts = content.scripts;

    resolve({ scripts, content });

    expect(scripts.global).toBe(originalGlobal);
    expect(content.scripts).toBe(originalPageScripts);
    expect(content.scripts).toEqual(["page-end"]);
  });
});
