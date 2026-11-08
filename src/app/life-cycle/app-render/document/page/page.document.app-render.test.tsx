// src/app/life-cycle/app-render/document/page/page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { Page } from "./page.document.app-render";
import { PageHeader } from "./header/header.page.document.app-render";
import { PageFooter } from "./footer/footer.page.document.app-render";
import { ContentBody } from "./body/body.page.document.app-render";
import { Breadcrumbs } from "./body/breadcrumbs/breadcrumbs.body.page.document.app-render";

jest.mock("./header/header.page.document.app-render", () => ({
  PageHeader: jest.fn(() => <header data-testid="page-header" />),
}));

jest.mock("./footer/footer.page.document.app-render", () => ({
  PageFooter: jest.fn(() => <footer data-testid="page-footer" />),
}));

jest.mock("./body/body.page.document.app-render", () => ({
  ContentBody: jest.fn(() => <div data-testid="content-body" />),
}));

jest.mock(
  "./body/breadcrumbs/breadcrumbs.body.page.document.app-render",
  () => ({
    Breadcrumbs: jest.fn(() => (
      <nav data-testid="breadcrumbs" aria-label="Breadcrumb" />
    )),
  }),
);

const mockedHeader = jest.mocked(PageHeader);
const mockedFooter = jest.mocked(PageFooter);
const mockedBody = jest.mocked(ContentBody);
const mockedBreadcrumbs = jest.mocked(Breadcrumbs);

type PageContext = Parameters<typeof Page>[0]["page"];
type Breadcrumb = PageContext["breadcrumbs"][number];

describe("Page AppRender", () => {
  const createBreadcrumb = (label: string, href: string): Breadcrumb =>
    ({
      href,
      label,
      variant: null,
      icon: null,
      ariaLabel: null,
      title: null,
      target: null,
      rel: null,
    }) as Breadcrumb;

  /*
   * The child renderers are mocked.
   * This fixture only supplies the structure Page itself consumes.
   */
  const createPage = (overrides: Partial<PageContext> = {}): PageContext =>
    ({
      pageType: "standard",
      header: {},
      footer: {},
      body: {},
      breadcrumbs: [],
      ...overrides,
    }) as unknown as PageContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the header, main and footer in order", () => {
    const { container } = render(<Page page={createPage()} />);

    expect(
      Array.from(container.children).map((element) =>
        element.tagName.toLowerCase(),
      ),
    ).toEqual(["header", "main", "footer"]);
  });

  it("renders the accessible main content target", () => {
    render(<Page page={createPage()} />);

    const main = screen.getByRole("main");

    expect(main).toHaveAttribute("id", "main-content");

    expect(screen.getByTestId("content-body")).toBeInTheDocument();
  });

  it("forwards the original context objects to child renderers", () => {
    const page = createPage();

    render(<Page page={page} />);

    expect(mockedHeader).toHaveBeenCalledTimes(1);
    expect(mockedFooter).toHaveBeenCalledTimes(1);
    expect(mockedBody).toHaveBeenCalledTimes(1);

    expect(mockedHeader.mock.calls[0]?.[0].header).toBe(page.header);

    expect(mockedBody.mock.calls[0]?.[0].body).toBe(page.body);

    expect(mockedFooter.mock.calls[0]?.[0].footer).toBe(page.footer);
  });

  it("does not wrap standard page content in an article", () => {
    const { container } = render(
      <Page page={createPage({ pageType: "standard" })} />,
    );

    const main = screen.getByRole("main");

    expect(main.querySelector("article")).toBeNull();
    expect(main.firstElementChild).toBe(screen.getByTestId("content-body"));

    expect(container.querySelectorAll("article")).toHaveLength(0);
  });

  it("wraps journal entry content in an article", () => {
    render(<Page page={createPage({ pageType: "journalEntry" })} />);

    const main = screen.getByRole("main");
    const article = main.querySelector("article");

    expect(article).not.toBeNull();

    expect(article?.firstElementChild).toBe(screen.getByTestId("content-body"));
  });

  it.each([0, 1])("omits breadcrumbs when there are %i entries", (count) => {
    const breadcrumbs = [createBreadcrumb("Home", "/")].slice(0, count);

    render(<Page page={createPage({ breadcrumbs })} />);

    expect(mockedBreadcrumbs).not.toHaveBeenCalled();
    expect(screen.queryByTestId("breadcrumbs")).toBeNull();
  });

  it("renders breadcrumbs when there are multiple entries", () => {
    const breadcrumbs = [
      createBreadcrumb("Home", "/"),
      createBreadcrumb("Journal", "/journal"),
    ];

    render(<Page page={createPage({ breadcrumbs })} />);

    expect(mockedBreadcrumbs).toHaveBeenCalledTimes(1);

    expect(mockedBreadcrumbs.mock.calls[0]?.[0].breadcrumbs).toBe(breadcrumbs);

    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
  });

  it("renders breadcrumbs before the content body", () => {
    const breadcrumbs = [
      createBreadcrumb("Home", "/"),
      createBreadcrumb("Journal", "/journal"),
    ];

    render(<Page page={createPage({ breadcrumbs })} />);

    const main = screen.getByRole("main");

    expect(
      Array.from(main.children).map((element) =>
        element.getAttribute("data-testid"),
      ),
    ).toEqual(["breadcrumbs", "content-body"]);
  });

  it("keeps breadcrumbs outside the journal article", () => {
    const breadcrumbs = [
      createBreadcrumb("Home", "/"),
      createBreadcrumb("Journal", "/journal"),
      createBreadcrumb("Viru Bog", "/journal/viru-bog"),
    ];

    render(
      <Page
        page={createPage({
          pageType: "journalEntry",
          breadcrumbs,
        })}
      />,
    );

    const main = screen.getByRole("main");

    expect(main.firstElementChild).toBe(screen.getByTestId("breadcrumbs"));

    expect(main.children[1]?.tagName).toBe("ARTICLE");

    expect(
      main.querySelector("article > [data-testid='content-body']"),
    ).toBeInTheDocument();

    expect(
      main.querySelector("article [data-testid='breadcrumbs']"),
    ).toBeNull();
  });

  it("updates the page wrapper when the page type changes", () => {
    const page = createPage();

    const { rerender } = render(<Page page={page} />);

    expect(screen.getByRole("main").querySelector("article")).toBeNull();

    rerender(
      <Page
        page={{
          ...page,
          pageType: "journalEntry",
        }}
      />,
    );

    expect(screen.getByRole("main").querySelector("article")).not.toBeNull();
  });
});
