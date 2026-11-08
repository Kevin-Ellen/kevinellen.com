// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/rich-list/rich-list.component.body.page.document.content.resolver.app-render-context.test.ts

import { resolveRichListComponentContentAppRenderContext } from "./rich-list.component.body.page.document.content.resolver.app-render-context";

type Content = Parameters<
  typeof resolveRichListComponentContentAppRenderContext
>[0]["content"];

describe("Rich-list component AppRenderContext resolver", () => {
  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      kind: "richList",
      heading: "Field observations",
      items: [
        {
          id: "first",
          title: "Woodland",
        },
        {
          id: "second",
          title: "Wetland",
        },
      ],
      ...overrides,
    }) as unknown as Content;

  it("preserves the complete content shape", () => {
    const content = createContent();

    expect(
      resolveRichListComponentContentAppRenderContext({
        content,
      }),
    ).toEqual(content);
  });

  it("creates a new top-level object", () => {
    const content = createContent();

    const result = resolveRichListComponentContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
  });

  it("preserves the original items reference", () => {
    const content = createContent();

    const result = resolveRichListComponentContentAppRenderContext({
      content,
    });

    expect(result.items).toBe(content.items);
  });

  it("supports empty collections", () => {
    const content = createContent({ items: [] });

    const result = resolveRichListComponentContentAppRenderContext({
      content,
    });

    expect(result.items).toEqual([]);
    expect(result.items).toBe(content.items);
  });

  it("does not mutate frozen content", () => {
    const content = Object.freeze(createContent());

    const result = resolveRichListComponentContentAppRenderContext({
      content,
    });

    expect(result).toEqual(content);
    expect(result).not.toBe(content);
  });
});
