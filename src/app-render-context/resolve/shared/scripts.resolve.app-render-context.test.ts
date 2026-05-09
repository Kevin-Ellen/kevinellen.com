// src/app-render-context/resolve/shared/scripts.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveScripts } from "@app-render-context/resolve/shared/scripts.assets.resolve.app-render-context";

describe("appRenderContextResolveScripts", () => {
  it("resolves inline and link scripts for the requested location", () => {
    const appContext = {
      assets: {
        scripts: [
          {
            kind: "inline",
            location: "header",
            content: "console.log('header');",
          },
          {
            kind: "link",
            location: "header",
            src: "/header.js",
            loading: "defer",
          },
          {
            kind: "link",
            location: "footer",
            src: "/footer.js",
          },
        ],
      },
    } as unknown as AppContext;

    expect(
      appRenderContextResolveScripts(appContext, {
        location: "header",
        nonce: "nonce-one",
      }),
    ).toEqual({
      inlineScripts: [
        {
          content: "console.log('header');",
          nonce: "nonce-one",
        },
      ],
      linkScripts: [
        {
          src: "/header.js",
          nonce: "nonce-one",
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
            src: "/footer.js",
          },
        ],
      },
    } as unknown as AppContext;

    expect(
      appRenderContextResolveScripts(appContext, {
        location: "footer",
        nonce: "nonce-two",
      }),
    ).toEqual({
      inlineScripts: [],
      linkScripts: [
        {
          src: "/footer.js",
          nonce: "nonce-two",
          loading: "blocking",
        },
      ],
    });
  });

  it("returns empty script arrays when no scripts match the location", () => {
    const appContext = {
      assets: {
        scripts: [
          {
            kind: "inline",
            location: "footer",
            content: "console.log('footer');",
          },
        ],
      },
    } as unknown as AppContext;

    expect(
      appRenderContextResolveScripts(appContext, {
        location: "header",
        nonce: "nonce-three",
      }),
    ).toEqual({
      inlineScripts: [],
      linkScripts: [],
    });
  });
});
