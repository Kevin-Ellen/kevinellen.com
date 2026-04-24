// tests/src/app-render-context/resolve/shared/scripts.resolve.app-render-context.test.ts

import { resolveScriptsAppRenderContext } from "@app-render-context/resolve/shared/scripts.assets.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolveScriptsAppRenderContext", () => {
  it("resolves inline and link scripts for the requested location", () => {
    const appContext = {
      assets: {
        scripts: [
          {
            kind: "inline",
            location: "header",
            content: "console.log('header inline');",
          },
          {
            kind: "link",
            location: "header",
            src: "/assets/header.js",
            loading: "defer",
          },
          {
            kind: "inline",
            location: "footer",
            content: "console.log('footer inline');",
          },
        ],
      },
    } as unknown as AppContext;

    const result = resolveScriptsAppRenderContext(appContext, {
      location: "header",
      nonce: "test-nonce",
    });

    expect(result).toEqual({
      inlineScripts: [
        {
          content: "console.log('header inline');",
          nonce: "test-nonce",
        },
      ],
      linkScripts: [
        {
          src: "/assets/header.js",
          nonce: "test-nonce",
          loading: "defer",
        },
      ],
    });
  });

  it("defaults link script loading to blocking", () => {
    const appContext = {
      assets: {
        scripts: [
          {
            kind: "link",
            location: "footer",
            src: "/assets/footer.js",
          },
        ],
      },
    } as unknown as AppContext;

    const result = resolveScriptsAppRenderContext(appContext, {
      location: "footer",
      nonce: "test-nonce",
    });

    expect(result).toEqual({
      inlineScripts: [],
      linkScripts: [
        {
          src: "/assets/footer.js",
          nonce: "test-nonce",
          loading: "blocking",
        },
      ],
    });
  });

  it("returns empty script arrays when no scripts match the requested location", () => {
    const appContext = {
      assets: {
        scripts: [
          {
            kind: "inline",
            location: "header",
            content: "console.log('header inline');",
          },
        ],
      },
    } as unknown as AppContext;

    const result = resolveScriptsAppRenderContext(appContext, {
      location: "footer",
      nonce: "test-nonce",
    });

    expect(result).toEqual({
      inlineScripts: [],
      linkScripts: [],
    });
  });
});
