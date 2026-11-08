// src/app/life-cycle/app-render/document/page/body/modules/article-section/article-section.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { ArticleSectionModule } from "./article-section.module.body.page.document.app-render";

type Props = Parameters<typeof ArticleSectionModule>[0];
type Section = Props["module"];
type Entry = Section["entries"][number];

const mockedModule = jest.fn(
  ({ module }: { module: Entry["module"]; contained?: boolean }) => (
    <div data-testid="child-module" data-kind={module.kind} />
  ),
);

describe("ArticleSectionModule", () => {
  const createEntry = (layout: Entry["layout"]): Entry =>
    ({
      layout,
      module: {
        kind: "paragraph",
        content: [],
      },
    }) as unknown as Entry;

  const createSection = (overrides: Partial<Section> = {}): Section =>
    ({
      heading: {
        id: "observations",
        text: "Field observations",
        level: 2,
      },
      entries: [],
      ...overrides,
    }) as Section;

  const renderSection = (module: Section) =>
    render(
      <ArticleSectionModule
        module={module}
        renderModule={mockedModule as unknown as Props["renderModule"]}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a labelled section with a dynamic heading", () => {
    const { container } = renderSection(createSection());

    expect(container.querySelector("section")).toHaveAttribute(
      "aria-labelledby",
      "observations",
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Field observations",
      }),
    ).toHaveAttribute("id", "observations");
  });

  it.each([2, 3, 4] as const)("renders heading level %i", (level) => {
    renderSection(
      createSection({
        heading: {
          id: "observations",
          text: "Field observations",
          level,
        },
      }),
    );

    expect(
      screen.getByRole("heading", {
        level,
        name: "Field observations",
      }),
    ).toBeInTheDocument();
  });

  it("wraps reading entries in l-reading", () => {
    const entry = createEntry("reading");
    const { container } = renderSection(createSection({ entries: [entry] }));

    expect(
      container.querySelector(".l-reading > [data-testid='child-module']"),
    ).toBeInTheDocument();

    expect(mockedModule.mock.calls[0]?.[0]).toEqual({
      module: entry.module,
      contained: false,
    });
  });

  it("wraps frame entries in l-frame", () => {
    const entry = createEntry("frame");
    const { container } = renderSection(createSection({ entries: [entry] }));

    expect(
      container.querySelector(".l-frame > [data-testid='child-module']"),
    ).toBeInTheDocument();
  });

  it("does not wrap entries using the none layout", () => {
    const entry = createEntry("none");
    const { container } = renderSection(createSection({ entries: [entry] }));

    expect(
      container.querySelector("section > [data-testid='child-module']"),
    ).toBeInTheDocument();
  });

  it("renders entries in their original order", () => {
    const entries = [
      createEntry("reading"),
      createEntry("none"),
      createEntry("frame"),
    ];

    renderSection(createSection({ entries }));

    expect(screen.getAllByTestId("child-module")).toHaveLength(3);
    expect(mockedModule).toHaveBeenCalledTimes(3);

    entries.forEach((entry, index) => {
      expect(mockedModule.mock.calls[index]?.[0].module).toBe(entry.module);
      expect(mockedModule.mock.calls[index]?.[0].contained).toBe(false);
    });
  });

  it("supports a section without entries", () => {
    renderSection(createSection());

    expect(screen.queryAllByTestId("child-module")).toHaveLength(0);
    expect(mockedModule).not.toHaveBeenCalled();
  });
});
