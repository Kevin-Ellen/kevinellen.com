// src/app/life-cycle/app-render/document/page/body/modules/quote/quote.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { QuoteModule } from "./quote.module.body.page.document.app-render";

type Module = Parameters<typeof QuoteModule>[0]["module"];

describe("QuoteModule", () => {
  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      text: "Every observation tells a story.",
      attribution: null,
      ...overrides,
    }) as Module;

  it("renders a semantic figure and blockquote", () => {
    const { container } = render(<QuoteModule module={createModule()} />);

    expect(container.querySelector("figure")).toHaveClass("m-quote");
    expect(container.querySelector("blockquote")).toHaveClass("m-quote__text");

    expect(
      screen.getByText("Every observation tells a story."),
    ).toBeInTheDocument();
  });

  it("renders quote text inside a paragraph", () => {
    const { container } = render(<QuoteModule module={createModule()} />);

    expect(container.querySelector("blockquote > p")).toHaveTextContent(
      "Every observation tells a story.",
    );
  });

  it("renders attribution when supplied", () => {
    const { container } = render(
      <QuoteModule
        module={createModule({
          attribution: "Field journal",
        })}
      />,
    );

    expect(container.querySelector("figcaption")).toHaveClass(
      "m-quote__attribution",
    );

    expect(screen.getByText("Field journal")).toBeInTheDocument();
  });

  it("omits attribution when null", () => {
    const { container } = render(<QuoteModule module={createModule()} />);

    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("preserves an explicitly empty attribution", () => {
    const { container } = render(
      <QuoteModule module={createModule({ attribution: "" })} />,
    );

    expect(container.querySelector("figcaption")).toBeEmptyDOMElement();
  });
});
