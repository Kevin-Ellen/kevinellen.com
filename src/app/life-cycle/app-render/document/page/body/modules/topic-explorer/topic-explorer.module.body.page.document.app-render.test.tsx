// src/app/life-cycle/app-render/document/page/body/modules/topic-explorer/topic-explorer.module.body.page.document.app-render.test.tsx

import { render, screen, within } from "@testing-library/react";

import { TopicExplorerModule } from "./topic-explorer.module.body.page.document.app-render";

type Module = Parameters<typeof TopicExplorerModule>[0]["module"];
type Featured = Module["featured"][number];
type TopicLink = Module["links"][number];

describe("TopicExplorerModule", () => {
  const createFeatured = (id: string): Featured =>
    ({
      id,
      href: `/topics/${id}`,
      label: id === "birds" ? "Birds" : "Woodlands",
      description: `Explore ${id}`,
      image: {
        src: `/media/${id}.webp`,
        alt: `${id} photograph`,
      },
    }) as Featured;

  const createLink = (id: string): TopicLink =>
    ({
      id,
      href: `/topics/${id}`,
      label: id === "wetlands" ? "Wetlands" : "Wildlife",
    }) as TopicLink;

  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      heading: "Explore by topic",
      featured: [],
      links: [],
      ...overrides,
    }) as Module;

  it("renders a labelled topic explorer section", () => {
    const { container } = render(
      <TopicExplorerModule module={createModule()} />,
    );

    expect(container.querySelector("section")).toHaveClass(
      "m-topic-explorer",
      "l-frame",
    );
    expect(container.querySelector("section")).toHaveAttribute(
      "aria-labelledby",
      "topic-explorer-title",
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Explore by topic",
      }),
    ).toHaveAttribute("id", "topic-explorer-title");
  });

  it("renders the link to the complete topics index", () => {
    render(<TopicExplorerModule module={createModule()} />);

    const link = screen.getByRole("link", {
      name: "View all topics",
    });

    expect(link).toHaveAttribute("href", "/topics");
    expect(link).toHaveClass("c-editorial-link", "c-editorial-link--subtle");

    expect(link.querySelector(".c-editorial-link__arrow")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders featured topic cards in order", () => {
    const { container } = render(
      <TopicExplorerModule
        module={createModule({
          featured: [createFeatured("birds"), createFeatured("woodlands")],
        })}
      />,
    );

    const cards = Array.from(
      container.querySelectorAll(".m-topic-explorer__card"),
    );

    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveAttribute("href", "/topics/birds");
    expect(cards[1]).toHaveAttribute("href", "/topics/woodlands");

    expect(
      within(cards[0] as HTMLElement).getByRole("heading", {
        level: 3,
        name: "Birds",
      }),
    ).toBeInTheDocument();

    expect(
      within(cards[1] as HTMLElement).getByRole("heading", {
        level: 3,
        name: "Woodlands",
      }),
    ).toBeInTheDocument();
  });

  it("renders featured card images with lazy loading", () => {
    render(
      <TopicExplorerModule
        module={createModule({
          featured: [createFeatured("birds")],
        })}
      />,
    );

    const image = screen.getByRole("img", {
      name: "birds photograph",
    });

    expect(image).toHaveAttribute("src", "/media/birds.webp");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("renders the additional topics navigation", () => {
    render(
      <TopicExplorerModule
        module={createModule({
          links: [createLink("wetlands"), createLink("wildlife")],
        })}
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "More topics",
    });

    expect(
      within(navigation).getByRole("link", { name: "Wetlands" }),
    ).toHaveAttribute("href", "/topics/wetlands");

    expect(
      within(navigation).getByRole("link", { name: "Wildlife" }),
    ).toHaveAttribute("href", "/topics/wildlife");
  });

  it("omits additional navigation when there are no links", () => {
    render(<TopicExplorerModule module={createModule()} />);

    expect(
      screen.queryByRole("navigation", { name: "More topics" }),
    ).toBeNull();
  });

  it("supports an empty featured collection", () => {
    const { container } = render(
      <TopicExplorerModule module={createModule()} />,
    );

    expect(
      container.querySelector(".m-topic-explorer__grid"),
    ).toBeEmptyDOMElement();

    expect(
      screen.getByRole("link", { name: "View all topics" }),
    ).toBeInTheDocument();
  });
});
