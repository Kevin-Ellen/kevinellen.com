// src/app/life-cycle/app-render/document/page/body/inline/inline.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { Inline } from "./inline.body.page.document.app-render";
import { TextInline } from "./text/text.inline.body.page.document.app-render";
import { LinkInline } from "./link/link.inline.body.page.document.app-render";

jest.mock("./text/text.inline.body.page.document.app-render", () => ({
  TextInline: jest.fn(({ content }: Parameters<typeof TextInline>[0]) => (
    <span data-testid="text-inline">{content.value}</span>
  )),
}));

jest.mock("./link/link.inline.body.page.document.app-render", () => ({
  LinkInline: jest.fn(({ content }: Parameters<typeof LinkInline>[0]) => (
    <a data-testid="link-inline" href={content.link.href}>
      {content.link.label}
    </a>
  )),
}));

const mockedTextInline = jest.mocked(TextInline);
const mockedLinkInline = jest.mocked(LinkInline);

type Content = Parameters<typeof Inline>[0]["content"];
type TextContent = Extract<Content, { kind: "text" }>;
type LinkContent = Extract<Content, { kind: "link" }>;

describe("Inline AppRender dispatcher", () => {
  const createText = (value: string): TextContent =>
    ({
      kind: "text",
      value,
    }) as TextContent;

  const createLink = (href = "/journal", label = "Journal"): LinkContent =>
    ({
      kind: "link",
      link: {
        href,
        label,
        variant: null,
        icon: null,
        ariaLabel: null,
        title: null,
        target: null,
        rel: null,
      },
    }) as LinkContent;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches text content to TextInline", () => {
    const content = createText("Wildlife photography");

    render(<Inline content={content} />);

    expect(mockedTextInline).toHaveBeenCalledTimes(1);
    expect(mockedLinkInline).not.toHaveBeenCalled();

    expect(screen.getByTestId("text-inline")).toHaveTextContent(
      "Wildlife photography",
    );
  });

  it("dispatches link content to LinkInline", () => {
    const content = createLink("/topics/birds", "Birds");

    render(<Inline content={content} />);

    expect(mockedLinkInline).toHaveBeenCalledTimes(1);
    expect(mockedTextInline).not.toHaveBeenCalled();

    expect(screen.getByTestId("link-inline")).toHaveAttribute(
      "href",
      "/topics/birds",
    );
  });

  it.each([
    ["text", createText("Epping Forest")],
    ["link", createLink()],
  ] as const)(
    "forwards the original %s content reference",
    (_kind, content) => {
      render(<Inline content={content} />);

      const renderer =
        content.kind === "text" ? mockedTextInline : mockedLinkInline;

      expect(renderer.mock.calls[0]?.[0].content).toBe(content);
    },
  );

  it("passes only the content prop to TextInline", () => {
    const content = createText("Field notes");

    render(<Inline content={content} />);

    expect(mockedTextInline.mock.calls[0]?.[0]).toEqual({
      content,
    });
  });

  it("passes only the content prop to LinkInline", () => {
    const content = createLink();

    render(<Inline content={content} />);

    expect(mockedLinkInline.mock.calls[0]?.[0]).toEqual({
      content,
    });
  });

  it("renders the selected child without additional wrappers", () => {
    const { container } = render(
      <Inline content={createText("A woodland observation")} />,
    );

    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toHaveAttribute(
      "data-testid",
      "text-inline",
    );
  });

  it("switches renderers when the content kind changes", () => {
    const { rerender } = render(
      <Inline content={createText("First observation")} />,
    );

    expect(screen.getByTestId("text-inline")).toBeInTheDocument();

    rerender(<Inline content={createLink("/journal", "Journal")} />);

    expect(screen.queryByTestId("text-inline")).toBeNull();
    expect(screen.getByTestId("link-inline")).toBeInTheDocument();

    expect(mockedTextInline).toHaveBeenCalledTimes(1);
    expect(mockedLinkInline).toHaveBeenCalledTimes(1);
  });

  it("updates content when the same renderer is reused", () => {
    const { rerender } = render(<Inline content={createText("First")} />);

    rerender(<Inline content={createText("Second")} />);

    expect(screen.getByTestId("text-inline")).toHaveTextContent("Second");

    expect(mockedTextInline).toHaveBeenCalledTimes(2);
  });

  it("propagates errors from TextInline", () => {
    const error = new Error("Text rendering failed");

    mockedTextInline.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      render(<Inline content={createText("Observation")} />),
    ).toThrow(error);

    expect(mockedLinkInline).not.toHaveBeenCalled();
  });

  it("propagates errors from LinkInline", () => {
    const error = new Error("Link rendering failed");

    mockedLinkInline.mockImplementation(() => {
      throw error;
    });

    expect(() => render(<Inline content={createLink()} />)).toThrow(error);

    expect(mockedTextInline).not.toHaveBeenCalled();
  });
});
