// src/app/life-cycle/app-render/document/page/body/inline/text/text.inline.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { TextInline } from "./text.inline.body.page.document.app-render";

type Content = Parameters<typeof TextInline>[0]["content"];

describe("TextInline AppRender", () => {
  const createContent = (value: string): Content =>
    ({
      kind: "text",
      value,
    }) as Content;

  it("renders the supplied text", () => {
    render(<TextInline content={createContent("Wildlife photography")} />);

    expect(screen.getByText("Wildlife photography")).toBeInTheDocument();
  });

  it("renders text without introducing additional markup", () => {
    const { container } = render(
      <TextInline content={createContent("Epping Forest")} />,
    );

    expect(container.textContent).toBe("Epping Forest");
    expect(container.children).toHaveLength(0);
  });

  it("supports empty text", () => {
    const { container } = render(<TextInline content={createContent("")} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders special characters as text rather than HTML", () => {
    const { container } = render(
      <TextInline
        content={createContent("<strong>Wildlife</strong> & nature")}
      />,
    );

    expect(container.textContent).toBe("<strong>Wildlife</strong> & nature");

    expect(container.querySelector("strong")).toBeNull();
  });

  it("renders Unicode characters", () => {
    render(<TextInline content={createContent("Estonia — Viru Bog 🦅")} />);

    expect(screen.getByText("Estonia — Viru Bog 🦅")).toBeInTheDocument();
  });

  it("updates rendered text when content changes", () => {
    const { container, rerender } = render(
      <TextInline content={createContent("First observation")} />,
    );

    rerender(<TextInline content={createContent("Second observation")} />);

    expect(container.textContent).toBe("Second observation");
    expect(container.textContent).not.toContain("First observation");
  });
});
