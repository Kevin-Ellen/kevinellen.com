// tests/src/app-context/resolve/assets.resolve.app-context.test.ts

import { resolveAssetsAppContext } from "@app-context/resolve/assets.resolve.app-context";

describe("resolveAssetsAppContext", () => {
  it("returns global scripts when page scripts are empty", () => {
    const result = resolveAssetsAppContext(
      {
        scripts: [
          {
            id: "header-condense",
            kind: "inline",
            content: "console.log('global');",
            location: "footer",
          },
        ],
        svg: [],
      },
      {
        scripts: [],
        svg: [],
      },
    );

    expect(result.scripts).toEqual([
      {
        id: "header-condense",
        kind: "inline",
        content: "console.log('global');",
        location: "footer",
      },
    ]);
  });

  it("returns page scripts when global scripts are empty", () => {
    const result = resolveAssetsAppContext(
      {
        scripts: [],
        svg: [],
      },
      {
        scripts: [
          {
            id: "header-condense",
            kind: "inline",
            content: "console.log('page');",
            location: "footer",
          },
        ],
        svg: [],
      },
    );

    expect(result.scripts).toEqual([
      {
        id: "header-condense",
        kind: "inline",
        content: "console.log('page');",
        location: "footer",
      },
    ]);
  });

  it("deduplicates scripts by id and keeps the first occurrence", () => {
    const result = resolveAssetsAppContext(
      {
        scripts: [
          {
            id: "header-condense",
            kind: "inline",
            content: "console.log('global');",
            location: "footer",
          },
        ],
        svg: [],
      },
      {
        scripts: [
          {
            id: "header-condense",
            kind: "inline",
            content: "console.log('page');",
            location: "footer",
          },
        ],
        svg: [],
      },
    );

    expect(result.scripts).toEqual([
      {
        id: "header-condense",
        kind: "inline",
        content: "console.log('global');",
        location: "footer",
      },
    ]);
  });

  it("merges global and page svg assets", () => {
    const result = resolveAssetsAppContext(
      {
        scripts: [],
        svg: [
          {
            id: "icon-home",
            viewBox: "0 0 10 10",
            content: "<path />",
          },
        ],
      },
      {
        scripts: [],
        svg: [
          {
            id: "icon-github",
            viewBox: "0 0 20 20",
            content: "<circle />",
          },
        ],
      },
    );

    expect(result.svg).toEqual([
      {
        id: "icon-home",
        viewBox: "0 0 10 10",
        content: "<path />",
      },
      {
        id: "icon-github",
        viewBox: "0 0 20 20",
        content: "<circle />",
      },
    ]);
  });

  it("deduplicates svg assets by id and keeps the first occurrence", () => {
    const result = resolveAssetsAppContext(
      {
        scripts: [],
        svg: [
          {
            id: "icon-home",
            viewBox: "0 0 10 10",
            content: "<path />",
          },
        ],
      },
      {
        scripts: [],
        svg: [
          {
            id: "icon-home",
            viewBox: "0 0 20 20",
            content: "<circle />",
          },
        ],
      },
    );

    expect(result.svg).toEqual([
      {
        id: "icon-home",
        viewBox: "0 0 10 10",
        content: "<path />",
      },
    ]);
  });

  it("returns empty arrays when both sources are empty", () => {
    const result = resolveAssetsAppContext(
      {
        scripts: [],
        svg: [],
      },
      {
        scripts: [],
        svg: [],
      },
    );

    expect(result).toEqual({
      scripts: [],
      svg: [],
    });
  });

  it("returns page assets when global assets are empty", () => {
    const result = resolveAssetsAppContext(
      {
        scripts: [],
        svg: [],
      },
      {
        scripts: [
          {
            id: "header-condense",
            kind: "inline",
            content: "console.log('page');",
            location: "footer",
          },
        ],
        svg: [
          {
            id: "icon-home",
            viewBox: "0 0 20 20",
            content: "<circle />",
          },
        ],
      },
    );

    expect(result).toEqual({
      scripts: [
        {
          id: "header-condense",
          kind: "inline",
          content: "console.log('page');",
          location: "footer",
        },
      ],
      svg: [
        {
          id: "icon-home",
          viewBox: "0 0 20 20",
          content: "<circle />",
        },
      ],
    });
  });
});
