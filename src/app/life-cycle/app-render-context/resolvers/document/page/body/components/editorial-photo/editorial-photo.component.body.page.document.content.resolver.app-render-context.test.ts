// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context.test.ts

import { resolveEditorialPhotoComponentContentAppRenderContext } from "./editorial-photo.component.body.page.document.content.resolver.app-render-context";

type Content = Parameters<
  typeof resolveEditorialPhotoComponentContentAppRenderContext
>[0]["content"];

describe("Editorial photo component AppRenderContext resolver", () => {
  const createContent = (overrides: Partial<Content> = {}): Content => ({
    kind: "editorialPhoto",
    src: "/media/photo/1200/800/fox-001",
    alt: "A red fox in woodland",
    width: 1200,
    height: 800,
    priority: false,
    description: "Photographed in Epping Forest",
    ...overrides,
  });

  it("preserves all content properties", () => {
    const content = createContent();

    expect(
      resolveEditorialPhotoComponentContentAppRenderContext({
        content,
      }),
    ).toEqual(content);
  });

  it("returns a new object reference", () => {
    const content = createContent();

    const result = resolveEditorialPhotoComponentContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
  });

  it("preserves image source and dimensions", () => {
    const content = createContent();

    const result = resolveEditorialPhotoComponentContentAppRenderContext({
      content,
    });

    expect(result.src).toBe(content.src);
    expect(result.width).toBe(content.width);
    expect(result.height).toBe(content.height);
  });

  it("preserves alternative text and description", () => {
    const content = createContent();

    const result = resolveEditorialPhotoComponentContentAppRenderContext({
      content,
    });

    expect(result.alt).toBe(content.alt);
    expect(result.description).toBe(content.description);
  });

  it("preserves the priority flag", () => {
    const content = createContent({ priority: true });

    const result = resolveEditorialPhotoComponentContentAppRenderContext({
      content,
    });

    expect(result.priority).toBe(true);
  });

  it("supports omitted optional properties", () => {
    const content: Content = {
      kind: "editorialPhoto",
      src: "/media/photo/800/533/fox-001",
      alt: "A red fox",
      width: 800,
      height: 533,
    };

    const result = resolveEditorialPhotoComponentContentAppRenderContext({
      content,
    });

    expect(result).toEqual(content);
    expect(result.priority).toBeUndefined();
    expect(result.description).toBeUndefined();
  });

  it("does not mutate frozen content", () => {
    const content = Object.freeze(createContent());

    const result = resolveEditorialPhotoComponentContentAppRenderContext({
      content,
    });

    expect(result).toEqual(content);
    expect(result).not.toBe(content);
  });
});
