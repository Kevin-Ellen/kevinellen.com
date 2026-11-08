// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/page-intro/page-intro.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolvePageIntroModuleContentAppRenderContext } from "./page-intro.module.body.page.document.content.resolver.app-render-context";

import { resolveDisplayDateAppRenderContext } from "../../../../../primitives/datetime/datetime.primitive.resolver.app-render-context";

jest.mock(
  "../../../../../primitives/datetime/datetime.primitive.resolver.app-render-context",
  () => ({
    resolveDisplayDateAppRenderContext: jest.fn(),
  }),
);

const mockedDate = jest.mocked(resolveDisplayDateAppRenderContext);

type Content = Parameters<
  typeof resolvePageIntroModuleContentAppRenderContext
>[0]["content"];

type DisplayDate = ReturnType<typeof resolveDisplayDateAppRenderContext>;

describe("Page intro module AppRenderContext resolver", () => {
  const createContent = (date = "2026-10-15"): Content =>
    ({
      kind: "pageIntro",
      heading: "An autumn morning",
      description: "Field notes from Epping Forest",
      date,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedDate.mockImplementation(({ iso }) => ({
      iso,
      label: `Formatted: ${iso}`,
    }));
  });

  it("passes the original ISO date to the datetime resolver", () => {
    resolvePageIntroModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(mockedDate).toHaveBeenCalledTimes(1);
    expect(mockedDate).toHaveBeenCalledWith({
      iso: "2026-10-15",
    });
  });

  it("uses the exact resolved display date", () => {
    const resolvedDate: DisplayDate = {
      iso: "2026-10-15",
      label: "15 October 2026",
    };

    mockedDate.mockReturnValue(resolvedDate);

    const result = resolvePageIntroModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result.date).toBe(resolvedDate);
  });

  it("preserves the remaining module properties", () => {
    const content = createContent();

    const result = resolvePageIntroModuleContentAppRenderContext({
      content,
    });

    expect(result).toEqual({
      ...content,
      date: {
        iso: "2026-10-15",
        label: "Formatted: 2026-10-15",
      },
    });
  });

  it("preserves a full ISO timestamp when forwarding", () => {
    const iso = "2026-10-15T09:30:00.000Z";

    resolvePageIntroModuleContentAppRenderContext({
      content: createContent(iso),
    });

    expect(mockedDate).toHaveBeenCalledWith({ iso });
  });

  it("returns a new module object", () => {
    const content = createContent();

    const result = resolvePageIntroModuleContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
  });

  it("propagates date resolution errors", () => {
    const error = new Error("Date formatting failed");

    mockedDate.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolvePageIntroModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);
  });

  it("does not mutate frozen content", () => {
    const content = Object.freeze(createContent());

    const result = resolvePageIntroModuleContentAppRenderContext({
      content,
    });

    expect(content.date).toBe("2026-10-15");
    expect(result.date).not.toBe(content.date);
  });
});
