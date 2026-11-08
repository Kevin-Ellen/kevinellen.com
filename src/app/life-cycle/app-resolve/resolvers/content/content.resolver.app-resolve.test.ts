// src/app/life-cycle/app-resolve/resolvers/content/content.resolver.app-resolve.test.ts

import { resolveContentAppResolve } from "./content.resolver.app-resolve";

import { resolveContentBodyAppResolve } from "./body/body.content.app-resolve";
import { resolveContentBreadcrumbsAppResolve } from "./breadcrumbs/breadcrumbs.content.resolver.app-resolve";

jest.mock("./body/body.content.app-resolve", () => ({
  resolveContentBodyAppResolve: jest.fn(),
}));

jest.mock("./breadcrumbs/breadcrumbs.content.resolver.app-resolve", () => ({
  resolveContentBreadcrumbsAppResolve: jest.fn(),
}));

const mockedBody = jest.mocked(resolveContentBodyAppResolve);
const mockedBreadcrumbs = jest.mocked(resolveContentBreadcrumbsAppResolve);

type Input = Parameters<typeof resolveContentAppResolve>[0];
type Content = Input["content"];
type ResolvedBody = Awaited<ReturnType<typeof resolveContentBodyAppResolve>>;
type ResolvedBreadcrumbs = ReturnType<
  typeof resolveContentBreadcrumbsAppResolve
>;

describe("Content AppResolve resolver", () => {
  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["contentRegistry"];

  const getPhoto = jest.fn<
    ReturnType<Input["getPhoto"]>,
    Parameters<Input["getPhoto"]>
  >();

  const journalLedger = {
    bySlug: {},
    newestFirst: [],
  } as unknown as Input["journalLedger"];

  const person = {
    name: "Kevin Ellen",
  } as Input["person"];

  const site = {
    titleSuffix: " | Kevin Ellen",
  } as Input["site"];

  const resolvedBody = {
    modules: [],
  } as unknown as ResolvedBody;

  const resolvedBreadcrumbs = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/journals",
      label: "Journals",
    },
  ] as unknown as ResolvedBreadcrumbs;

  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      id: "forest-journal",
      label: "Forest Journal",
      metadata: {
        title: "Forest Journal",
        description: "A morning in Epping Forest",
      },
      breadcrumbs: ["home", "journals"],
      dates: {
        created: "2026-10-15",
        lastUpdated: "2026-10-20",
      },
      body: {
        modules: [],
      },
      ...overrides,
    }) as unknown as Content;

  const createInput = (overrides: Partial<Input> = {}): Input => ({
    content: createContent(),
    contentRegistry,
    getPhoto,
    person,
    site,
    journalLedger,
    requestedPage: 1,
    ...overrides,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedBody.mockResolvedValue(resolvedBody);
    mockedBreadcrumbs.mockReturnValue(resolvedBreadcrumbs);
  });

  it("appends the configured site title suffix", async () => {
    const result = await resolveContentAppResolve(createInput());

    expect(result.metadata.title).toBe("Forest Journal | Kevin Ellen");
  });

  it("preserves other page metadata", async () => {
    const content = createContent();

    const result = await resolveContentAppResolve(createInput({ content }));

    expect(result.metadata).toEqual({
      ...content.metadata,
      title: "Forest Journal | Kevin Ellen",
    });
  });

  it("uses the supplied site configuration", async () => {
    const customSite = {
      ...site,
      titleSuffix: " — Wildlife Photography",
    } as Input["site"];

    const result = await resolveContentAppResolve(
      createInput({ site: customSite }),
    );

    expect(result.metadata.title).toBe("Forest Journal — Wildlife Photography");
  });

  it("supports an empty site title suffix", async () => {
    const customSite = {
      ...site,
      titleSuffix: "",
    } as Input["site"];

    const result = await resolveContentAppResolve(
      createInput({ site: customSite }),
    );

    expect(result.metadata.title).toBe("Forest Journal");
  });

  it("passes initialised breadcrumbs and registry to the breadcrumb resolver", async () => {
    const input = createInput();

    await resolveContentAppResolve(input);

    expect(mockedBreadcrumbs).toHaveBeenCalledTimes(1);
    expect(mockedBreadcrumbs).toHaveBeenCalledWith({
      breadcrumbs: input.content.breadcrumbs,
      contentRegistry,
    });
  });

  it("uses the exact resolved breadcrumb collection", async () => {
    const result = await resolveContentAppResolve(createInput());

    expect(result.breadcrumbs).toBe(resolvedBreadcrumbs);
  });

  it("passes the content body and all dependencies to the body resolver", async () => {
    const input = createInput({ requestedPage: 3 });

    await resolveContentAppResolve(input);

    expect(mockedBody).toHaveBeenCalledTimes(1);
    expect(mockedBody).toHaveBeenCalledWith({
      content: input.content.body,
      contentRegistry,
      getPhoto,
      journalLedger,
      requestedPage: 3,
      publication: {
        author: "Kevin Ellen",
        published: "2026-10-15",
        lastUpdated: "2026-10-20",
      },
    });
  });

  it("derives the publication author from the person configuration", async () => {
    const customPerson = {
      ...person,
      name: "Another Photographer",
    } as Input["person"];

    await resolveContentAppResolve(createInput({ person: customPerson }));

    expect(mockedBody).toHaveBeenCalledWith(
      expect.objectContaining({
        publication: expect.objectContaining({
          author: "Another Photographer",
        }),
      }),
    );
  });

  it("passes null when the content has no update date", async () => {
    const content = createContent({
      dates: {
        created: "2026-10-15",
        lastUpdated: null,
      },
    });

    await resolveContentAppResolve(createInput({ content }));

    expect(mockedBody).toHaveBeenCalledWith(
      expect.objectContaining({
        publication: {
          author: "Kevin Ellen",
          published: "2026-10-15",
          lastUpdated: null,
        },
      }),
    );
  });

  it("uses the exact resolved body object", async () => {
    const result = await resolveContentAppResolve(createInput());

    expect(result.body).toBe(resolvedBody);
  });

  it("preserves the original content properties", async () => {
    const content = createContent();

    const result = await resolveContentAppResolve(createInput({ content }));

    expect(result.id).toBe(content.id);
    expect(result.label).toBe(content.label);
    expect(result.dates).toBe(content.dates);
  });

  it("returns a new content and metadata object", async () => {
    const content = createContent();

    const result = await resolveContentAppResolve(createInput({ content }));

    expect(result).not.toBe(content);
    expect(result.metadata).not.toBe(content.metadata);
  });

  it("does not mutate the original content", async () => {
    const content = createContent();
    const originalTitle = content.metadata.title;
    const originalBody = content.body;
    const originalBreadcrumbs = content.breadcrumbs;

    await resolveContentAppResolve(createInput({ content }));

    expect(content.metadata.title).toBe(originalTitle);
    expect(content.body).toBe(originalBody);
    expect(content.breadcrumbs).toBe(originalBreadcrumbs);
  });

  it("returns a Promise", async () => {
    const operation = resolveContentAppResolve(createInput());

    expect(operation).toBeInstanceOf(Promise);

    await expect(operation).resolves.toMatchObject({
      metadata: {
        title: "Forest Journal | Kevin Ellen",
      },
    });
  });

  it("propagates breadcrumb resolution failures", async () => {
    const error = new Error("Unable to resolve breadcrumb");

    mockedBreadcrumbs.mockImplementation(() => {
      throw error;
    });

    await expect(resolveContentAppResolve(createInput())).rejects.toThrow(
      error,
    );

    expect(mockedBody).not.toHaveBeenCalled();
  });

  it("propagates body resolution failures", async () => {
    const error = new Error("Unable to resolve content body");

    mockedBody.mockRejectedValue(error);

    await expect(resolveContentAppResolve(createInput())).rejects.toThrow(
      error,
    );

    expect(mockedBreadcrumbs).toHaveBeenCalledTimes(1);
    expect(mockedBody).toHaveBeenCalledTimes(1);
  });
});
