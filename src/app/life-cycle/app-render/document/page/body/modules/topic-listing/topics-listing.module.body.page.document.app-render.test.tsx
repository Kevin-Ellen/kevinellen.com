// src/app/life-cycle/app-render/document/page/body/modules/topic-listing/topics-listing.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { TopicsListingModule } from "./topics-listing.module.body.page.document.app-render";
import { PaginationComponent } from "../../components/pagination/pagination.component.body.page.document.app-render";

jest.mock(
  "../../components/pagination/pagination.component.body.page.document.app-render",
  () => ({
    PaginationComponent: jest.fn(() => <nav data-testid="topics-pagination" />),
  }),
);

const mockedPagination = jest.mocked(PaginationComponent);

type Module = Parameters<typeof TopicsListingModule>[0]["module"];
type Item = Module["items"][number];

describe("TopicsListingModule", () => {
  const createItem = (id: string): Item =>
    ({
      id,
      href: `/topics/${id}`,
      label: id === "birds" ? "Birds" : "Woodlands",
      description: `Explore ${id}`,
      image: {
        src: `/media/${id}.webp`,
        alt: `${id} photograph`,
        width: 1200,
        height: 800,
      },
    }) as Item;

  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      heading: "All topics",
      items: [],
      pagination: null,
      ...overrides,
    }) as Module;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the labelled listing section", () => {
    const { container } = render(
      <TopicsListingModule module={createModule()} />,
    );

    expect(container.querySelector("section")).toHaveClass(
      "m-topic-listing",
      "l-frame",
    );

    expect(container.querySelector("section")).toHaveAttribute(
      "aria-labelledby",
      "topics-heading",
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "All topics",
      }),
    ).toHaveAttribute("id", "topics-heading");
  });

  it("renders topic articles in order", () => {
    const { container } = render(
      <TopicsListingModule
        module={createModule({
          items: [createItem("birds"), createItem("woodlands")],
        })}
      />,
    );

    const articles = Array.from(container.querySelectorAll("article"));

    expect(articles).toHaveLength(2);

    expect(articles[0].querySelector("a")).toHaveAttribute(
      "href",
      "/topics/birds",
    );

    expect(articles[1].querySelector("a")).toHaveAttribute(
      "href",
      "/topics/woodlands",
    );
  });

  it("uses the topic heading as the link's accessible name", () => {
    render(
      <TopicsListingModule
        module={createModule({
          items: [createItem("birds")],
        })}
      />,
    );

    const heading = screen.getByRole("heading", {
      level: 3,
      name: "Birds",
    });

    expect(heading).toHaveAttribute("id", "topic-birds");

    const link = screen.getByRole("link", { name: "Birds" });

    expect(link).toHaveAttribute("aria-labelledby", "topic-birds");
    expect(link).toHaveAttribute("href", "/topics/birds");
  });

  it("renders responsive image metadata", () => {
    render(
      <TopicsListingModule
        module={createModule({
          items: [createItem("birds")],
        })}
      />,
    );

    const image = screen.getByRole("img", {
      name: "birds photograph",
    });

    expect(image).toHaveAttribute("src", "/media/birds.webp");
    expect(image).toHaveAttribute("width", "1200");
    expect(image).toHaveAttribute("height", "800");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("renders an accessible decorative call to action", () => {
    const { container } = render(
      <TopicsListingModule
        module={createModule({
          items: [createItem("birds")],
        })}
      />,
    );

    const indicator = container.querySelector(
      ".m-topic-listing__content .c-editorial-link",
    );

    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(indicator).toHaveTextContent("Explore topic");
    expect(indicator).toHaveTextContent("→");
  });

  it("delegates optional pagination with the correct label", () => {
    const pagination: NonNullable<Module["pagination"]> = {
      currentPage: 2,
      totalPages: 3,
      previous: "/topics",
      next: "/topics/page-3",
      pages: [
        {
          number: 1,
          href: "/topics",
          current: false,
        },
        {
          number: 2,
          href: "/topics/page-2",
          current: true,
        },
        {
          number: 3,
          href: "/topics/page-3",
          current: false,
        },
      ],
    };

    render(<TopicsListingModule module={createModule({ pagination })} />);

    expect(mockedPagination).toHaveBeenCalledTimes(1);

    expect(mockedPagination.mock.calls[0]?.[0]).toEqual({
      pagination,
      label: "Topics pagination",
    });
  });

  it("omits pagination when absent", () => {
    render(<TopicsListingModule module={createModule()} />);

    expect(screen.queryByTestId("topics-pagination")).toBeNull();
    expect(mockedPagination).not.toHaveBeenCalled();
  });

  it("supports an empty topic listing", () => {
    const { container } = render(
      <TopicsListingModule module={createModule()} />,
    );

    expect(container.querySelectorAll("article")).toHaveLength(0);
    expect(
      container.querySelector(".m-topic-listing__grid"),
    ).toBeEmptyDOMElement();
  });
});
