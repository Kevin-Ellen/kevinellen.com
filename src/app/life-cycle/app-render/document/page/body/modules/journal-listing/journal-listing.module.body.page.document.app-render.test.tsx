// src/app/life-cycle/app-render/document/page/body/modules/journal-listing/journal-listing.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { JournalListingModule } from "./journal-listing.module.body.page.document.app-render";
import { JournalEntryFeaturedComponent } from "../../components/journal-entry-featured/journal-entry-featured.component.body.page.document.app-render";
import { JournalEntryListingComponent } from "../../components/journal-entry-listing/journal-entry-listing.component.body.page.document.app-render";
import { PaginationComponent } from "../../components/pagination/pagination.component.body.page.document.app-render";

jest.mock(
  "../../components/journal-entry-featured/journal-entry-featured.component.body.page.document.app-render",
  () => ({
    JournalEntryFeaturedComponent: jest.fn(() => (
      <div data-testid="featured-entry" />
    )),
  }),
);

jest.mock(
  "../../components/journal-entry-listing/journal-entry-listing.component.body.page.document.app-render",
  () => ({
    JournalEntryListingComponent: jest.fn(() => (
      <div data-testid="entry-listing" />
    )),
  }),
);

jest.mock(
  "../../components/pagination/pagination.component.body.page.document.app-render",
  () => ({
    PaginationComponent: jest.fn(() => <nav data-testid="pagination" />),
  }),
);

const mockedFeatured = jest.mocked(JournalEntryFeaturedComponent);
const mockedListing = jest.mocked(JournalEntryListingComponent);
const mockedPagination = jest.mocked(PaginationComponent);

type Module = Parameters<typeof JournalListingModule>[0]["module"];

describe("JournalListingModule", () => {
  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      eyebrow: "Latest entry",
      heading: { id: "journal-heading", text: "Field notes" },
      entries: [],
      featured: null,
      pagination: null,
      showViewAllLink: false,
      ...overrides,
    }) as Module;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("always delegates the journal listing", () => {
    const module = createModule();

    render(<JournalListingModule module={module} />);

    expect(mockedListing).toHaveBeenCalledTimes(1);
    expect(mockedListing.mock.calls[0]?.[0]).toEqual({
      entries: module.entries,
      heading: module.heading,
      showViewAllLink: false,
    });
  });

  it("omits optional featured and pagination components", () => {
    render(<JournalListingModule module={createModule()} />);

    expect(mockedFeatured).not.toHaveBeenCalled();
    expect(mockedPagination).not.toHaveBeenCalled();
    expect(screen.getByTestId("entry-listing")).toBeInTheDocument();
  });

  it("delegates the featured entry and eyebrow", () => {
    const featured = {
      id: "viru-bog",
      slug: "/journal/viru-bog",
      label: "Viru Bog",
    } as NonNullable<Module["featured"]>;

    const module = createModule({ featured });

    render(<JournalListingModule module={module} />);

    expect(mockedFeatured.mock.calls[0]?.[0]).toEqual({
      entry: featured,
      eyebrow: "Latest entry",
    });
  });

  it("delegates pagination with its accessible label", () => {
    const pagination: NonNullable<Module["pagination"]> = {
      currentPage: 1,
      totalPages: 2,
      previous: null,
      next: "/journal/page-2",
      pages: [
        {
          number: 1,
          href: "/journal",
          current: true,
        },
        {
          number: 2,
          href: "/journal/page-2",
          current: false,
        },
      ],
    };

    render(<JournalListingModule module={createModule({ pagination })} />);

    expect(mockedPagination).toHaveBeenCalledTimes(1);
    expect(mockedPagination.mock.calls[0]?.[0]).toEqual({
      pagination,
      label: "Journal pagination",
    });
  });

  it("forwards showViewAllLink unchanged", () => {
    render(
      <JournalListingModule module={createModule({ showViewAllLink: true })} />,
    );

    expect(mockedListing.mock.calls[0]?.[0].showViewAllLink).toBe(true);
  });

  it("renders featured, listing and pagination in order", () => {
    const { container } = render(
      <JournalListingModule
        module={createModule({
          featured: {} as NonNullable<Module["featured"]>,
          pagination: {} as NonNullable<Module["pagination"]>,
        })}
      />,
    );

    expect(
      Array.from(container.children).map((element) =>
        element.getAttribute("data-testid"),
      ),
    ).toEqual(["featured-entry", "entry-listing", "pagination"]);
  });
});
