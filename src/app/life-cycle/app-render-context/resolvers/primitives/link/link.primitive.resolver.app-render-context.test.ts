// src/app/life-cycle/app-render-context/resolvers/primitives/link/link.primitive.resolver.app-render-context.test.ts

import { resolveLinkAppRenderContext } from "./link.primitive.resolver.app-render-context";

type Link = Parameters<typeof resolveLinkAppRenderContext>[0]["link"];

describe("Link primitive AppRenderContext resolver", () => {
  const createLink = (overrides: Record<string, unknown> = {}): Link => ({
    href: "/journals",
    label: "Journals",
    ariaLabel: null,
    title: null,
    variant: null,
    icon: null,
    target: null,
    rel: null,
    ...overrides,
  });

  it("returns the original link reference", () => {
    const link = createLink();

    expect(resolveLinkAppRenderContext({ link })).toBe(link);
  });

  it("preserves internal link properties", () => {
    const link = createLink();

    expect(resolveLinkAppRenderContext({ link })).toEqual(link);
  });

  it("preserves external link properties", () => {
    const link = createLink({
      href: "https://example.com",
      target: "_blank",
      rel: ["noopener"],
    });

    expect(resolveLinkAppRenderContext({ link })).toBe(link);
  });

  it("does not mutate frozen input", () => {
    const link = Object.freeze(createLink());

    expect(resolveLinkAppRenderContext({ link })).toBe(link);
  });
});
