// src/app-context/resolve/assets.resolve.app-context.test.ts

import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";

import { appContextResolveAssets } from "@app-context/resolve/assets.resolve.app-context";

describe("appContextResolveAssets", () => {
  it("merges global and page assets while deduplicating by id", () => {
    const globalAssets: AppStateAssets = {
      scripts: [
        {
          kind: "external",
          id: "header-condense",
          src: "/global.js",
          loading: "defer",
          location: "header",
        },
      ],
      svg: [
        {
          id: "icon-home",
          viewBox: "0 0 10 10",
          content: "<path />",
        },
      ],
    };

    const pageAssets: AppStateAssets = {
      scripts: [
        {
          kind: "external",
          id: "header-condense",
          src: "/page-duplicate.js",
          loading: "defer",
          location: "footer",
        },
      ],
      svg: [
        {
          id: "icon-home",
          viewBox: "0 0 20 20",
          content: "<circle />",
        },
        {
          id: "logo-rspb",
          viewBox: "0 0 10 10",
          content: "<path />",
        },
      ],
    };

    expect(appContextResolveAssets(globalAssets, pageAssets)).toEqual({
      scripts: [
        {
          kind: "external",
          id: "header-condense",
          src: "/global.js",
          loading: "defer",
          location: "header",
        },
      ],
      svg: [
        {
          id: "icon-home",
          viewBox: "0 0 10 10",
          content: "<path />",
        },
        {
          id: "logo-rspb",
          viewBox: "0 0 10 10",
          content: "<path />",
        },
      ],
    });
  });
});
