// src/app/life-cycle/app-render/document/page/body/modules/article-footer/article-footer.module.body.page.document.app-render.test.tsx

import { render, screen, within } from "@testing-library/react";

import { ArticleFooterModule } from "./article-footer.module.body.page.document.app-render";

type Module = Parameters<typeof ArticleFooterModule>[0]["module"];

describe("ArticleFooterModule", () => {
  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      publication: {
        author: "Kevin Ellen",
        published: {
          iso: "2026-10-15",
          label: "15 October 2026",
        },
        lastUpdated: null,
      },
      fieldNotes: {
        cameras: ["Canon EOS R7"],
        lenses: ["RF 100–500mm", "RF 1.4× Extender"],
      },
      ...overrides,
    }) as Module;

  it("renders a semantic article footer", () => {
    const { container } = render(
      <ArticleFooterModule module={createModule()} />,
    );

    expect(container.querySelector("footer")).toHaveClass(
      "m-article-footer",
      "l-reading",
    );
  });

  it("renders the publication and field notes sections", () => {
    render(<ArticleFooterModule module={createModule()} />);

    expect(
      screen.getByRole("region", { name: "Publication" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("region", { name: "Field notes" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "Publication" }),
    ).toHaveAttribute("id", "publication-heading");

    expect(
      screen.getByRole("heading", { level: 2, name: "Field notes" }),
    ).toHaveAttribute("id", "field-notes-heading");
  });

  it("renders the author and publication date", () => {
    const { container } = render(
      <ArticleFooterModule module={createModule()} />,
    );

    expect(screen.getByText("Kevin Ellen")).toBeInTheDocument();

    const time = container.querySelector("time");

    expect(time).toHaveAttribute("datetime", "2026-10-15");
    expect(time).toHaveTextContent("15 October 2026");
  });

  it("renders the last updated date when provided", () => {
    const module = createModule();

    render(
      <ArticleFooterModule
        module={{
          ...module,
          publication: {
            ...module.publication,
            lastUpdated: {
              iso: "2026-11-01",
              label: "1 November 2026",
            },
          },
        }}
      />,
    );

    expect(screen.getByText("Last updated")).toBeInTheDocument();

    expect(screen.getByText("1 November 2026")).toHaveAttribute(
      "datetime",
      "2026-11-01",
    );
  });

  it("omits the last updated row when absent", () => {
    const { container } = render(
      <ArticleFooterModule module={createModule()} />,
    );

    expect(screen.queryByText("Last updated")).toBeNull();
    expect(container.querySelectorAll("time")).toHaveLength(1);
  });

  it("renders comma-separated cameras and lenses", () => {
    render(<ArticleFooterModule module={createModule()} />);

    const fieldNotes = screen.getByRole("region", {
      name: "Field notes",
    });

    expect(within(fieldNotes).getByText("Canon EOS R7")).toBeInTheDocument();

    expect(
      within(fieldNotes).getByText("RF 100–500mm, RF 1.4× Extender"),
    ).toBeInTheDocument();
  });

  it("supports empty equipment collections", () => {
    const { container } = render(
      <ArticleFooterModule
        module={createModule({
          fieldNotes: {
            cameras: [],
            lenses: [],
          },
        })}
      />,
    );

    const fieldNotes = container.querySelector(
      '[aria-labelledby="field-notes-heading"]',
    );

    expect(fieldNotes?.querySelectorAll("dd")).toHaveLength(2);
    expect(
      Array.from(fieldNotes?.querySelectorAll("dd") ?? []).map(
        (element) => element.textContent,
      ),
    ).toEqual(["", ""]);
  });
});
