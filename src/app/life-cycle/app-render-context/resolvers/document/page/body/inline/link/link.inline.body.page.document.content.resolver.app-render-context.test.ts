// src/app/life-cycle/app-render-context/resolvers/document/page/body/inline/link/link.inline.body.page.document.content.resolver.app-render-context.test.ts

import { resolveLinkInlineContentAppRenderContext } from "./link.inline.body.page.document.content.resolver.app-render-context";

type Content = Parameters<
  typeof resolveLinkInlineContentAppRenderContext
>[0]["content"];

describe("Link inline content AppRenderContext resolver", () => {
  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      kind: "link",
      label: "Wildlife journals",
      href: "/journals",
      ...overrides,
    }) as unknown as Content;

  it("returns the original link content reference", () => {
    const content = createContent();

    expect(resolveLinkInlineContentAppRenderContext({ content })).toBe(content);
  });

  it("preserves internal link properties", () => {
    const content = createContent();

    expect(resolveLinkInlineContentAppRenderContext({ content })).toEqual(
      content,
    );
  });

  it("preserves external link properties", () => {
    const content = createContent({
      href: "https://www.essexwt.org.uk",
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    });

    expect(resolveLinkInlineContentAppRenderContext({ content })).toBe(content);
  });

  it("does not mutate frozen content", () => {
    const content = Object.freeze(createContent());

    expect(resolveLinkInlineContentAppRenderContext({ content })).toBe(content);
  });
});
