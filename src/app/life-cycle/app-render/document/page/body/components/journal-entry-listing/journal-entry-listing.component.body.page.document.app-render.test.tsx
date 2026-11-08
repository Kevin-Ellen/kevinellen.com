// src/app/life-cycle/app-render/document/page/body/components/journal-entry-listing/journal-entry-listing.component.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { JournalEntryListingComponent } from "./journal-entry-listing.component.body.page.document.app-render";

type Props = Parameters<typeof JournalEntryListingComponent>[0];
type Entry = Props["entries"][number];
type Photo = Entry["photos"][number];

describe("JournalEntryListingComponent", () => {
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

  const createEntry = (id: string, overrides: Partial<Entry> = {}): Entry =>
    ({
      id,
      slug: `/journal/${id}`,
      label: `Journal ${id}`,
      dateCreated: "2026-10-15T12:00:00Z",
      photos: [createPhoto(id)],
      ...overrides,
    }) as unknown as Entry;

  const createProps = (overrides: Partial<Props> = {}): Props => ({
    heading: {
      id: "journal-heading",
      text: "Field notes",
    } as Props["heading"],
    entries: [createEntry("forest"), createEntry("wetlands")],
    showViewAllLink: false,
    ...overrides,
  });

  it("renders the heading and associated section", () => {
    const { container } = render(
      <JournalEntryListingComponent {...createProps()} />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Field notes",
      }),
    ).toHaveAttribute("id", "journal-heading");

    expect(container.querySelector("section")).toHaveAttribute(
      "aria-labelledby",
      "journal-heading",
    );
  });

  it("renders an article for each entry", () => {
    const { container } = render(
      <JournalEntryListingComponent {...createProps()} />,
    );

    expect(container.querySelectorAll("article")).toHaveLength(2);

    expect(
      screen.getByRole("link", { name: /Journal forest/ }),
    ).toHaveAttribute("href", "/journal/forest");

    expect(
      screen.getByRole("link", { name: /Journal wetlands/ }),
    ).toHaveAttribute("href", "/journal/wetlands");
  });

  it("renders entry dates in UTC", () => {
    const { container } = render(
      <JournalEntryListingComponent
        {...createProps({
          entries: [createEntry("forest")],
        })}
      />,
    );

    const time = container.querySelector("time");

    expect(time).toHaveAttribute("datetime", "2026-10-15");
    expect(time).toHaveTextContent("15 October 2026");
  });

  it("renders entry images with responsive attributes", () => {
    render(<JournalEntryListingComponent {...createProps()} />);

    const image = screen.getByRole("img", {
      name: "Photo forest",
    });

    expect(image).toHaveAttribute("src", "/media/forest.webp");
    expect(image).toHaveAttribute("srcset", "/media/forest-400.webp 400w");
    expect(image).toHaveAttribute(
      "sizes",
      "(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 25vw",
    );
    expect(image).toHaveAttribute("width", "1200");
    expect(image).toHaveAttribute("height", "800");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("uses only the first photo for an entry", () => {
    render(
      <JournalEntryListingComponent
        {...createProps({
          entries: [
            createEntry("forest", {
              photos: [createPhoto("first"), createPhoto("second")],
            }),
          ],
        })}
      />,
    );

    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/media/first.webp");
  });

  it("supports entries without photographs", () => {
    render(
      <JournalEntryListingComponent
        {...createProps({
          entries: [createEntry("forest", { photos: [] })],
        })}
      />,
    );

    expect(screen.queryByRole("img")).toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Journal forest",
      }),
    ).toBeInTheDocument();
  });

  it("shows the View all entries link when enabled", () => {
    render(
      <JournalEntryListingComponent
        {...createProps({ showViewAllLink: true })}
      />,
    );

    const link = screen.getByRole("link", {
      name: "View all entries",
    });

    expect(link).toHaveAttribute("href", "/journal");
    expect(link).toHaveClass("c-editorial-link--subtle");
  });

  it("omits View all entries when disabled", () => {
    render(<JournalEntryListingComponent {...createProps()} />);

    expect(screen.queryByRole("link", { name: "View all entries" })).toBeNull();
  });

  it("renders a decorative read-entry indicator", () => {
    const { container } = render(
      <JournalEntryListingComponent
        {...createProps({
          entries: [createEntry("forest")],
        })}
      />,
    );

    const indicator = container.querySelector(
      ".m-journal-listing__content .c-editorial-link",
    );

    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(indicator).toHaveTextContent("Read entry");
    expect(indicator).toHaveTextContent("→");
  });

  it("supports an empty listing", () => {
    const { container } = render(
      <JournalEntryListingComponent {...createProps({ entries: [] })} />,
    );

    expect(container.querySelectorAll("article")).toHaveLength(0);
    expect(
      screen.getByRole("heading", {
        name: "Field notes",
      }),
    ).toBeInTheDocument();
  });
});
