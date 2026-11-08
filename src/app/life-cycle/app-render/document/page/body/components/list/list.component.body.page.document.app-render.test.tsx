// src/app/life-cycle/app-render/document/page/body/components/list/list.component.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { ListComponent } from "./list.component.body.page.document.app-render";
import { Inline } from "../../inline/inline.body.page.document.app-render";

jest.mock("../../inline/inline.body.page.document.app-render", () => ({
  Inline: jest.fn(({ content }: Parameters<typeof Inline>[0]) => (
    <span data-testid="inline">{content.kind}</span>
  )),
}));

const mockedInline = jest.mocked(Inline);

type List = Parameters<typeof ListComponent>[0]["list"];
type Item = List["items"][number];
type InlineContent = Item["content"][number];

describe("ListComponent", () => {
  const createInline = (value: string): InlineContent =>
    ({
      kind: "text",
      value,
    }) as InlineContent;

  const createList = (items: Item[] = []): List =>
    ({
      kind: "list",
      items,
    }) as List;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders an unordered list", () => {
    render(<ListComponent list={createList()} />);

    expect(screen.getByRole("list")).toHaveClass("c-list");
  });

  it("renders list items in order", () => {
    const items = [
      { content: [createInline("First")] },
      { content: [createInline("Second")] },
    ] as Item[];

    render(<ListComponent list={createList(items)} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(mockedInline).toHaveBeenCalledTimes(2);
    expect(mockedInline.mock.calls[0]?.[0].content).toBe(items[0].content[0]);
    expect(mockedInline.mock.calls[1]?.[0].content).toBe(items[1].content[0]);
  });

  it("renders multiple inline contents within one item", () => {
    const first = createInline("First");
    const second = createInline("Second");

    render(
      <ListComponent
        list={createList([{ content: [first, second] } as Item])}
      />,
    );

    expect(screen.getAllByTestId("inline")).toHaveLength(2);
    expect(mockedInline.mock.calls[0]?.[0].content).toBe(first);
    expect(mockedInline.mock.calls[1]?.[0].content).toBe(second);
  });

  it("supports an empty list", () => {
    render(<ListComponent list={createList()} />);

    expect(screen.getByRole("list")).toBeEmptyDOMElement();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(mockedInline).not.toHaveBeenCalled();
  });

  it("supports an item with no inline content", () => {
    render(<ListComponent list={createList([{ content: [] } as Item])} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(mockedInline).not.toHaveBeenCalled();
  });
});
