// src/app/life-cycle/app-render/document/page/body/components/paragraph/paragraph.component.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { ParagraphComponent } from "./paragraph.component.body.page.document.app-render";
import { Inline } from "../../inline/inline.body.page.document.app-render";

jest.mock("../../inline/inline.body.page.document.app-render", () => ({
  Inline: jest.fn(({ content }: Parameters<typeof Inline>[0]) => (
    <span data-testid="inline">{content.kind}</span>
  )),
}));

const mockedInline = jest.mocked(Inline);

type Paragraph = Parameters<typeof ParagraphComponent>[0]["paragraph"];
type InlineContent = Paragraph["content"][number];

describe("ParagraphComponent", () => {
  const createInline = (value: string): InlineContent =>
    ({
      kind: "text",
      value,
    }) as InlineContent;

  const createParagraph = (content: InlineContent[] = []): Paragraph =>
    ({
      kind: "paragraph",
      content,
    }) as Paragraph;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a paragraph with the base class", () => {
    const { container } = render(
      <ParagraphComponent paragraph={createParagraph()} />,
    );

    expect(container.querySelector("p")).toHaveClass("c-paragraph");
  });

  it("combines the base and custom classes", () => {
    const { container } = render(
      <ParagraphComponent
        paragraph={createParagraph()}
        className="m-article__intro"
      />,
    );

    expect(container.querySelector("p")).toHaveClass(
      "c-paragraph",
      "m-article__intro",
    );
  });

  it("renders inline contents in order", () => {
    const first = createInline("First");
    const second = createInline("Second");

    render(<ParagraphComponent paragraph={createParagraph([first, second])} />);

    expect(screen.getAllByTestId("inline")).toHaveLength(2);
    expect(mockedInline.mock.calls[0]?.[0].content).toBe(first);
    expect(mockedInline.mock.calls[1]?.[0].content).toBe(second);
  });

  it("supports an empty paragraph", () => {
    const { container } = render(
      <ParagraphComponent paragraph={createParagraph()} />,
    );

    expect(container.querySelector("p")).toBeEmptyDOMElement();
    expect(mockedInline).not.toHaveBeenCalled();
  });

  it("does not add a wrapper around each inline item", () => {
    const { container } = render(
      <ParagraphComponent
        paragraph={createParagraph([createInline("Observation")])}
      />,
    );

    const paragraph = container.querySelector("p");

    expect(paragraph?.children).toHaveLength(1);
    expect(paragraph?.firstElementChild).toHaveAttribute(
      "data-testid",
      "inline",
    );
  });
});
