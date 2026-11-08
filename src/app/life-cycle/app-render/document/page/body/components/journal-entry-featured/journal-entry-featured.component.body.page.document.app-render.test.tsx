// src/app/life-cycle/app-render/document/page/body/components/journal-entry-featured/journal-entry-featured.component.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { JournalEntryFeaturedComponent } from "./journal-entry-featured.component.body.page.document.app-render";

type Props = Parameters<typeof JournalEntryFeaturedComponent>[0];
type Entry = Props["entry"];
type Photo = Entry["photos"][number];

describe("JournalEntryFeaturedComponent", () => {
  const createPhoto = (id: string): Photo =>
    ({
      id,
      image: {
        src: `/media/${id}.webp`,
        srcSet: `/media/${id}-400.webp 400w`,
      },
      width: 1200,
      height: 800,
      alt: `Photo ${id}`,
    }) as unknown as Photo;

  const createEntry = (overrides: Partial<Entry> = {}): Entry =>
    ({
      id: "viru-bog",
      slug: "/journal/viru-bog",
      label: "Morning at Viru Bog",
      intro: "A quiet morning among the wetlands.",
      dateCreated: "2026-10-15T07:30:00Z",
      photos: [createPhoto("first"), createPhoto("second")],
      ...overrides,
    }) as unknown as Entry;

  it("renders the featured entry heading and introduction", () => {
    render(
      <JournalEntryFeaturedComponent
        entry={createEntry()}
        eyebrow="Latest journal"
      />,
    );

    expect(screen.getByText("Latest journal")).toHaveClass(
      "m-latest-entry__eyebrow",
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Morning at Viru Bog",
      }),
    ).toHaveAttribute("id", "latest-entry-title");

    expect(
      screen.getByText("A quiet morning among the wetlands."),
    ).toBeInTheDocument();
  });

  it("associates the section with its heading", () => {
    const { container } = render(
      <JournalEntryFeaturedComponent
        entry={createEntry()}
        eyebrow="Featured"
      />,
    );

    expect(container.querySelector("section")).toHaveAttribute(
      "aria-labelledby",
      "latest-entry-title",
    );
  });

  it("formats the date using en-GB and UTC", () => {
    const { container } = render(
      <JournalEntryFeaturedComponent
        entry={createEntry()}
        eyebrow="Featured"
      />,
    );

    const time = container.querySelector("time");

    expect(time).toHaveAttribute("datetime", "2026-10-15");
    expect(time).toHaveTextContent("15 October 2026");
  });

  it("uses the calendar date irrespective of timestamp offset", () => {
    const { container } = render(
      <JournalEntryFeaturedComponent
        entry={createEntry({
          dateCreated: "2026-10-15T23:30:00-05:00",
        })}
        eyebrow="Featured"
      />,
    );

    expect(container.querySelector("time")).toHaveTextContent(
      "15 October 2026",
    );
  });

  it("links to the journal entry", () => {
    render(
      <JournalEntryFeaturedComponent
        entry={createEntry()}
        eyebrow="Featured"
      />,
    );

    const link = screen.getByRole("link", {
      name: "Read entry",
    });

    expect(link).toHaveAttribute("href", "/journal/viru-bog");
    expect(link).toHaveClass("c-editorial-link", "c-editorial-link--subtle");

    expect(link.querySelector(".c-editorial-link__arrow")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders every gallery image in order", () => {
    render(
      <JournalEntryFeaturedComponent
        entry={createEntry()}
        eyebrow="Featured"
      />,
    );

    const images = screen.getAllByRole("img");

    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", "/media/first.webp");
    expect(images[1]).toHaveAttribute("src", "/media/second.webp");
  });

  it("marks only the first image as featured", () => {
    render(
      <JournalEntryFeaturedComponent
        entry={createEntry()}
        eyebrow="Featured"
      />,
    );

    const images = screen.getAllByRole("img");

    expect(images[0]).toHaveClass("m-latest-entry__image--featured");
    expect(images[1]).not.toHaveClass("m-latest-entry__image--featured");
  });

  it("preserves responsive image attributes", () => {
    render(
      <JournalEntryFeaturedComponent
        entry={createEntry()}
        eyebrow="Featured"
      />,
    );

    const image = screen.getAllByRole("img")[0];

    expect(image).toHaveAttribute("srcset", "/media/first-400.webp 400w");
    expect(image).toHaveAttribute("sizes", "(max-width: 48rem) 100vw, 50vw");
    expect(image).toHaveAttribute("width", "1200");
    expect(image).toHaveAttribute("height", "800");
    expect(image).toHaveAttribute("alt", "Photo first");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("supports an empty gallery", () => {
    const { container } = render(
      <JournalEntryFeaturedComponent
        entry={createEntry({ photos: [] })}
        eyebrow="Featured"
      />,
    );

    expect(screen.queryAllByRole("img")).toHaveLength(0);
    expect(
      container.querySelector(".m-latest-entry__gallery"),
    ).toBeInTheDocument();
  });
});
