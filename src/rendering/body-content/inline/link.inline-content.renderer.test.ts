// src/rendering/body-content/inline/link.inline-content.renderer.test.ts

import type { AppRenderContextLinkInline } from "@shared-types/page-content/inline/link/app-render-context.link.inline-content.types";

import { renderLinkInline } from "@rendering/body-content/inline/link.inline.renderer";
import { renderTextLink } from "@rendering/shared/link.shared.renderer";

jest.mock("@rendering/shared/link.shared.renderer", () => ({
  renderTextLink: jest.fn(),
}));

describe("renderLinkInline", () => {
  const mockedRenderTextLink = jest.mocked(renderTextLink);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a text link", () => {
    mockedRenderTextLink.mockReturnValue(`<a href="/journal">Journal</a>`);

    const item = {
      kind: "link",
      link: {
        href: "/journal",
        text: "Journal",
        openInNewTab: false,
        svg: null,
      },
    } as unknown as AppRenderContextLinkInline;

    expect(renderLinkInline(item)).toBe(`<a href="/journal">Journal</a>`);

    expect(mockedRenderTextLink).toHaveBeenCalledWith(item.link);
  });
});
