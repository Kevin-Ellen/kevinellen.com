// src/app/life-cycle/app-render/document/page/body/components/rich-list/rich-list.component.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { RichListComponent } from "./rich-list.component.body.page.document.app-render";
import { Svg } from "../../../../../primitives/svg/svg.primitive.app-render";

jest.mock("../../../../../primitives/svg/svg.primitive.app-render", () => ({
  Svg: jest.fn(({ svg }: Parameters<typeof Svg>[0]) => (
    <svg data-testid="rich-list-icon">
      <use href={`#${svg.id}`} />
    </svg>
  )),
}));

const mockedSvg = jest.mocked(Svg);

type RichList = Parameters<typeof RichListComponent>[0]["list"];
type Item = RichList["items"][number];

describe("RichListComponent", () => {
  const createItem = (label: string, values: string[], iconId: string): Item =>
    ({
      label,
      values,
      icon: {
        id: iconId,
        width: 24,
        height: 24,
      },
    }) as unknown as Item;

  const createList = (items: Item[] = []): RichList =>
    ({
      kind: "richList",
      items,
    }) as RichList;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders an unordered list", () => {
    render(<RichListComponent list={createList()} />);

    expect(screen.getByRole("list")).toHaveClass("c-rich-list");
  });

  it("supports custom classes", () => {
    render(
      <RichListComponent list={createList()} className="m-article__facts" />,
    );

    expect(screen.getByRole("list")).toHaveClass(
      "c-rich-list",
      "m-article__facts",
    );
  });

  it("renders items in the supplied order", () => {
    render(
      <RichListComponent
        list={createList([
          createItem("Camera", ["EOS R7"], "icon-camera"),
          createItem("Location", ["Essex"], "icon-location"),
        ])}
      />,
    );

    const items = screen.getAllByRole("listitem");

    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Camera");
    expect(items[0]).toHaveTextContent("EOS R7");
    expect(items[1]).toHaveTextContent("Location");
    expect(items[1]).toHaveTextContent("Essex");
  });

  it("renders multiple values for one item", () => {
    const { container } = render(
      <RichListComponent
        list={createList([
          createItem(
            "Equipment",
            ["Canon EOS R7", "RF 100–500mm", "1.4× Extender"],
            "icon-camera",
          ),
        ])}
      />,
    );

    expect(
      Array.from(
        container.querySelectorAll(".c-rich-list__content > span"),
      ).map((element) => element.textContent),
    ).toEqual(["Equipment", "Canon EOS R7", "RF 100–500mm", "1.4× Extender"]);
  });

  it("forwards the correct SVG reference and class", () => {
    const item = createItem("Location", ["Epping Forest"], "icon-location");

    render(<RichListComponent list={createList([item])} />);

    expect(mockedSvg).toHaveBeenCalledTimes(1);

    expect(mockedSvg.mock.calls[0]?.[0]).toEqual({
      svg: item.icon,
      className: "c-rich-list__icon",
    });

    expect(
      screen.getByTestId("rich-list-icon").querySelector("use"),
    ).toHaveAttribute("href", "#icon-location");
  });

  it("supports an item with no values", () => {
    render(
      <RichListComponent
        list={createList([createItem("Camera", [], "icon-camera")])}
      />,
    );

    expect(screen.getByText("Camera")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("supports an empty list", () => {
    render(<RichListComponent list={createList()} />);

    expect(screen.getByRole("list")).toBeEmptyDOMElement();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(mockedSvg).not.toHaveBeenCalled();
  });
});
