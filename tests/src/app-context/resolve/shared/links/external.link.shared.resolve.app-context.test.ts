// tests/src/app-context/resolve/shared/links/external.link.shared.resolve.app-context.test.ts

import { resolveExternalLinkAppContext } from "@app-context/resolve/shared/links/external.link.shared.resolve.app-context";

describe("resolveExternalLinkAppContext", () => {
  it("returns the external link unchanged in value", () => {
    const link = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    } as const;

    const result = resolveExternalLinkAppContext(link);

    expect(result).toEqual(link);
  });

  it("returns a new object", () => {
    const link = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    } as const;

    const result = resolveExternalLinkAppContext(link);

    expect(result).not.toBe(link);
  });
});
