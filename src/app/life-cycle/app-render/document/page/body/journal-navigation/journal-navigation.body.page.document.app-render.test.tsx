// src/app/life-cycle/app-render/document/page/body/journal-navigation/journal-navigation.body.page.document.app-render.test.tsx

import { render, screen, within } from "@testing-library/react";

import type { JournalNavigationAppRenderContext } from "../../../../../../types/document/page/content/journal-navigation.content.page.document.app-render-context.type";

import { JournalNavigationBodyPageDocumentAppRender } from "./journal-navigation.body.page.document.app-render";

const previous = {
  slug: "/journal/starting-the-year-in-epping-forest",
  title: "Starting the Year in Epping Forest",
};

const next = {
  slug: "/journal/autumn-afternoon-with-marsh-harriers-at-abberton-reservoir",
  title: "Marsh Harriers at Abberton Reservoir",
};

const createNavigation = (
  overrides: Partial<JournalNavigationAppRenderContext> = {},
): JournalNavigationAppRenderContext => ({
  previous,
  next,
  ...overrides,
});

describe("JournalNavigationBodyPageDocumentAppRender", () => {
  it("renders previous and next journal links", () => {
    render(
      <JournalNavigationBodyPageDocumentAppRender
        navigation={createNavigation()}
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Journal navigation",
    });

    const links = within(navigation).getAllByRole("link");

    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute("href", previous.slug);
    expect(links[0]).toHaveAttribute("rel", "prev");

    expect(links[1]).toHaveAttribute("href", next.slug);
    expect(links[1]).toHaveAttribute("rel", "next");
  });

  it("renders accessible link names containing direction and title", () => {
    render(
      <JournalNavigationBodyPageDocumentAppRender
        navigation={createNavigation()}
      />,
    );

    expect(
      screen.getByRole("link", {
        name: `Previous ${previous.title}`,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: `Next ${next.title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders only the previous link when no next journal exists", () => {
    render(
      <JournalNavigationBodyPageDocumentAppRender
        navigation={createNavigation({ next: null })}
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Journal navigation",
    });

    expect(within(navigation).getAllByRole("link")).toHaveLength(1);

    expect(
      within(navigation).getByRole("link", {
        name: `Previous ${previous.title}`,
      }),
    ).toHaveAttribute("href", previous.slug);

    expect(
      within(navigation).queryByRole("link", { name: /next/i }),
    ).not.toBeInTheDocument();
  });

  it("renders only the next link when no previous journal exists", () => {
    render(
      <JournalNavigationBodyPageDocumentAppRender
        navigation={createNavigation({ previous: null })}
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Journal navigation",
    });

    expect(within(navigation).getAllByRole("link")).toHaveLength(1);

    expect(
      within(navigation).getByRole("link", {
        name: `Next ${next.title}`,
      }),
    ).toHaveAttribute("href", next.slug);

    expect(
      within(navigation).queryByRole("link", { name: /previous/i }),
    ).not.toBeInTheDocument();
  });

  it("renders nothing when navigation is null", () => {
    const { container } = render(
      <JournalNavigationBodyPageDocumentAppRender navigation={null} />,
    );

    expect(container).toBeEmptyDOMElement();

    expect(
      screen.queryByRole("navigation", { name: "Journal navigation" }),
    ).not.toBeInTheDocument();
  });

  it("renders nothing when both journal directions are null", () => {
    const { container } = render(
      <JournalNavigationBodyPageDocumentAppRender
        navigation={createNavigation({
          previous: null,
          next: null,
        })}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("uses the existing component and reading layout classes", () => {
    render(
      <JournalNavigationBodyPageDocumentAppRender
        navigation={createNavigation()}
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Journal navigation",
    });

    expect(navigation).toHaveClass("c-journal-navigation", "l-reading");

    for (const link of within(navigation).getAllByRole("link")) {
      expect(link).toHaveClass("c-journal-navigation__link");
    }
  });

  it("marks directional arrows as decorative", () => {
    const { container } = render(
      <JournalNavigationBodyPageDocumentAppRender
        navigation={createNavigation()}
      />,
    );

    const arrows = container.querySelectorAll(
      ".c-journal-navigation__label [aria-hidden='true']",
    );

    expect(arrows).toHaveLength(2);
    expect(arrows[0]).toHaveTextContent("←");
    expect(arrows[1]).toHaveTextContent("→");
  });

  it("renders journal titles as text without interpreting HTML", () => {
    const title = "Birds <script>alert('test')</script> & Wildlife";

    const { container } = render(
      <JournalNavigationBodyPageDocumentAppRender
        navigation={createNavigation({
          previous: {
            slug: previous.slug,
            title,
          },
          next: null,
        })}
      />,
    );

    expect(
      screen.getByRole("link", {
        name: `Previous ${title}`,
      }),
    ).toBeInTheDocument();

    expect(container.querySelector("script")).not.toBeInTheDocument();
  });
});
