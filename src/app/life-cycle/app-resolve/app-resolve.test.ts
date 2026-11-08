// src/app/life-cycle/app-resolve/app-resolve.test.ts

import { createAppResolve } from "./app-resolve";
import { AppResolve } from "./class.app-resolve";

import { resolveSiteConfigAppResolve } from "./resolvers/site/site.config.resolver.app-resolve";
import { resolveContentRegistryAppResolve } from "./resolvers/registry/content/content.registry.resolver.app-resolve";
import { resolveScriptsRegistryAppResolve } from "./resolvers/registry/scripts/scripts.registry.resolver.app-resolve";
import { resolveSvgRegistryAppResolve } from "./resolvers/registry/svg/svg.registry.resolver.app-resolve";
import { resolveStructuredDataRegistryAppResolve } from "./resolvers/registry/structured-data/structured-data.registry.resolver.app-resolve";
import { resolveShellAppResolve } from "./resolvers/shell/shell.resolver.app-resolve";
import { resolveContentAppResolve } from "./resolvers/content/content.resolver.app-resolve";

import { getContentAppResolve } from "./getters/content/content.getter.app-resolve";
import { createPhotoGetter } from "./getters/photo-kv/photo-kv.getter.app-resolve";

jest.mock("./resolvers/site/site.config.resolver.app-resolve", () => ({
  resolveSiteConfigAppResolve: jest.fn(),
}));

jest.mock(
  "./resolvers/registry/content/content.registry.resolver.app-resolve",
  () => ({
    resolveContentRegistryAppResolve: jest.fn(),
  }),
);

jest.mock(
  "./resolvers/registry/scripts/scripts.registry.resolver.app-resolve",
  () => ({
    resolveScriptsRegistryAppResolve: jest.fn(),
  }),
);

jest.mock("./resolvers/registry/svg/svg.registry.resolver.app-resolve", () => ({
  resolveSvgRegistryAppResolve: jest.fn(),
}));

jest.mock(
  "./resolvers/registry/structured-data/structured-data.registry.resolver.app-resolve",
  () => ({
    resolveStructuredDataRegistryAppResolve: jest.fn(),
  }),
);

jest.mock("./resolvers/shell/shell.resolver.app-resolve", () => ({
  resolveShellAppResolve: jest.fn(),
}));

jest.mock("./resolvers/content/content.resolver.app-resolve", () => ({
  resolveContentAppResolve: jest.fn(),
}));

jest.mock("./getters/content/content.getter.app-resolve", () => ({
  getContentAppResolve: jest.fn(),
}));

jest.mock("./getters/photo-kv/photo-kv.getter.app-resolve", () => ({
  createPhotoGetter: jest.fn(),
}));

const mockedSite = jest.mocked(resolveSiteConfigAppResolve);
const mockedContentRegistry = jest.mocked(resolveContentRegistryAppResolve);
const mockedScripts = jest.mocked(resolveScriptsRegistryAppResolve);
const mockedSvg = jest.mocked(resolveSvgRegistryAppResolve);
const mockedStructuredData = jest.mocked(
  resolveStructuredDataRegistryAppResolve,
);
const mockedShell = jest.mocked(resolveShellAppResolve);
const mockedContent = jest.mocked(resolveContentAppResolve);
const mockedGetContent = jest.mocked(getContentAppResolve);
const mockedCreatePhotoGetter = jest.mocked(createPhotoGetter);

type Input = Parameters<typeof createAppResolve>[0];
type Routing = Input["routing"];
type Ledger = Routing["ledger"];
type SelectedContent = Awaited<ReturnType<typeof getContentAppResolve>>;
type ResolvedContent = Awaited<ReturnType<typeof resolveContentAppResolve>>;
type PhotoGetter = ReturnType<typeof createPhotoGetter>;

describe("AppResolve factory", () => {
  const ledger = {
    bySlug: {},
    newestFirst: [],
  } as unknown as Ledger;

  const appInit = {
    site: {
      title: "Kevin Ellen",
      titleSuffix: " | Kevin Ellen",
    },
    person: {
      name: "Kevin Ellen",
    },
    navigation: {},
    footer: {},
    assets: {},
    content: {},
  } as unknown as Input["appInit"];

  const env = {
    PHOTO_KV: {},
  } as unknown as Input["env"];

  const site = {
    title: "Kevin Ellen",
  } as unknown as ReturnType<typeof resolveSiteConfigAppResolve>;

  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as ReturnType<typeof resolveContentRegistryAppResolve>;

  const scripts = {} as ReturnType<typeof resolveScriptsRegistryAppResolve>;

  const svg = {} as ReturnType<typeof resolveSvgRegistryAppResolve>;

  const structuredData = [] as unknown as ReturnType<
    typeof resolveStructuredDataRegistryAppResolve
  >;

  const shell = {
    navigation: {},
    footer: {},
  } as unknown as ReturnType<typeof resolveShellAppResolve>;

  const selectedContent = {
    id: "forest-journal",
    status: 200,
  } as unknown as SelectedContent;

  const resolvedContent = {
    id: "forest-journal",
    status: 200,
    pagePresentation: {
      layout: "contained",
    },
  } as unknown as ResolvedContent;

  const getPhoto = jest.fn<ReturnType<PhotoGetter>, Parameters<PhotoGetter>>();

  const createRouting = (
    kind: Routing["kind"] = "selected",
    pagination?: { page: number },
  ): Routing =>
    ({
      kind,
      ledger,
      ...(kind === "selected" ? { pagination } : {}),
    }) as unknown as Routing;

  const createInput = (overrides: Partial<Input> = {}): Input => ({
    appInit,
    routing: createRouting(),
    env,
    ...overrides,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedSite.mockReturnValue(site);
    mockedContentRegistry.mockReturnValue(contentRegistry);
    mockedScripts.mockReturnValue(scripts);
    mockedSvg.mockReturnValue(svg);
    mockedStructuredData.mockReturnValue(structuredData);
    mockedShell.mockReturnValue(shell);

    mockedGetContent.mockResolvedValue(selectedContent);
    mockedContent.mockResolvedValue(resolvedContent);
    mockedCreatePhotoGetter.mockReturnValue(getPhoto);
  });

  it("returns an AppResolve instance", async () => {
    const result = await createAppResolve(createInput());

    expect(result).toBeInstanceOf(AppResolve);
  });

  it("resolves the site using AppInit configuration", async () => {
    await createAppResolve(createInput());

    expect(mockedSite).toHaveBeenCalledTimes(1);
    expect(mockedSite).toHaveBeenCalledWith({
      appInit: appInit.site,
    });
  });

  it("creates the content registry using AppInit and the routing ledger", async () => {
    await createAppResolve(createInput());

    expect(mockedContentRegistry).toHaveBeenCalledTimes(1);
    expect(mockedContentRegistry).toHaveBeenCalledWith({
      appInit,
      ledger,
    });
  });

  it("passes the content registry to the content getter", async () => {
    const input = createInput();

    await createAppResolve(input);

    expect(mockedGetContent).toHaveBeenCalledTimes(1);
    expect(mockedGetContent).toHaveBeenCalledWith({
      appInit,
      routing: input.routing,
      env,
      contentRegistry,
    });
  });

  it("creates the photo getter using the PHOTO_KV binding", async () => {
    await createAppResolve(createInput());

    expect(mockedCreatePhotoGetter).toHaveBeenCalledTimes(1);
    expect(mockedCreatePhotoGetter).toHaveBeenCalledWith(env.PHOTO_KV);
  });

  it("defaults to page one for selected routes without pagination", async () => {
    await createAppResolve(
      createInput({
        routing: createRouting("selected"),
      }),
    );

    expect(mockedContent).toHaveBeenCalledWith(
      expect.objectContaining({
        requestedPage: 1,
      }),
    );
  });

  it("uses the requested pagination page for selected routes", async () => {
    await createAppResolve(
      createInput({
        routing: createRouting("selected", { page: 4 }),
      }),
    );

    expect(mockedContent).toHaveBeenCalledWith(
      expect.objectContaining({
        requestedPage: 4,
      }),
    );
  });

  it("uses page one for not-found routes", async () => {
    await createAppResolve(
      createInput({
        routing: createRouting("not-found"),
      }),
    );

    expect(mockedContent).toHaveBeenCalledWith(
      expect.objectContaining({
        requestedPage: 1,
      }),
    );
  });

  it("forwards every dependency to content resolution", async () => {
    await createAppResolve(createInput());

    expect(mockedContent).toHaveBeenCalledTimes(1);
    expect(mockedContent).toHaveBeenCalledWith({
      content: selectedContent,
      contentRegistry,
      getPhoto,
      person: appInit.person,
      site: appInit.site,
      journalLedger: ledger,
      requestedPage: 1,
    });
  });

  it("resolves scripts and SVG registries from AppInit", async () => {
    await createAppResolve(createInput());

    expect(mockedScripts).toHaveBeenCalledWith({ appInit });
    expect(mockedSvg).toHaveBeenCalledWith({ appInit });
  });

  it("uses resolved content and site for structured data", async () => {
    await createAppResolve(createInput());

    expect(mockedStructuredData).toHaveBeenCalledTimes(1);
    expect(mockedStructuredData).toHaveBeenCalledWith({
      person: appInit.person,
      site: appInit.site,
      resolvedSite: site,
      content: resolvedContent,
    });
  });

  it("resolves the shell using the content page presentation", async () => {
    await createAppResolve(createInput());

    expect(mockedShell).toHaveBeenCalledTimes(1);
    expect(mockedShell).toHaveBeenCalledWith({
      appInit,
      contentRegistry,
      pagePresentation: resolvedContent.pagePresentation,
    });
  });

  it("composes all resolved values into the AppResolve context", async () => {
    const result = await createAppResolve(createInput());

    expect(result.toInspectionSnapshot).toEqual({
      site,
      registries: {
        content: contentRegistry,
        scripts,
        svg,
        structuredData,
      },
      shell,
      content: resolvedContent,
    });
  });

  it("preserves exact resolver return references", async () => {
    const result = await createAppResolve(createInput());
    const snapshot = result.toInspectionSnapshot;

    expect(snapshot.site).toBe(site);
    expect(snapshot.content).toBe(resolvedContent);
    expect(snapshot.shell).toBe(shell);
    expect(snapshot.registries.content).toBe(contentRegistry);
    expect(snapshot.registries.scripts).toBe(scripts);
    expect(snapshot.registries.svg).toBe(svg);
    expect(snapshot.registries.structuredData).toBe(structuredData);
  });

  it("exposes the expected values through AppResolve getters", async () => {
    const result = await createAppResolve(createInput());

    expect(result.site).toBe(site);
    expect(result.content).toBe(resolvedContent);
    expect(result.status).toBe(200);
    expect(result.shell).toBe(shell);
    expect(result.scripts).toBe(scripts);
    expect(result.svgs).toBe(svg);
    expect(result.structuredData).toBe(structuredData);
  });

  it("does not continue when content retrieval fails", async () => {
    const error = new Error("Content unavailable");

    mockedGetContent.mockRejectedValue(error);

    await expect(createAppResolve(createInput())).rejects.toThrow(error);

    expect(mockedCreatePhotoGetter).not.toHaveBeenCalled();
    expect(mockedContent).not.toHaveBeenCalled();
    expect(mockedStructuredData).not.toHaveBeenCalled();
    expect(mockedShell).not.toHaveBeenCalled();
  });

  it("does not build registries and shell when content resolution fails", async () => {
    const error = new Error("Content resolution failed");

    mockedContent.mockRejectedValue(error);

    await expect(createAppResolve(createInput())).rejects.toThrow(error);

    expect(mockedScripts).not.toHaveBeenCalled();
    expect(mockedSvg).not.toHaveBeenCalled();
    expect(mockedStructuredData).not.toHaveBeenCalled();
    expect(mockedShell).not.toHaveBeenCalled();
  });

  it("propagates site resolution failures", async () => {
    const error = new Error("Invalid site configuration");

    mockedSite.mockImplementation(() => {
      throw error;
    });

    await expect(createAppResolve(createInput())).rejects.toThrow(error);

    expect(mockedContentRegistry).not.toHaveBeenCalled();
  });

  it("propagates registry construction failures", async () => {
    const error = new Error("Duplicate content slug");

    mockedContentRegistry.mockImplementation(() => {
      throw error;
    });

    await expect(createAppResolve(createInput())).rejects.toThrow(error);

    expect(mockedGetContent).not.toHaveBeenCalled();
  });

  it("propagates structured-data resolution failures", async () => {
    const error = new Error("Conflicting structured data types");

    mockedStructuredData.mockImplementation(() => {
      throw error;
    });

    await expect(createAppResolve(createInput())).rejects.toThrow(error);

    expect(mockedShell).not.toHaveBeenCalled();
  });

  it("propagates shell resolution failures", async () => {
    const error = new Error("Shell resolution failed");

    mockedShell.mockImplementation(() => {
      throw error;
    });

    await expect(createAppResolve(createInput())).rejects.toThrow(error);

    expect(mockedStructuredData).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the provided AppInit or routing references", async () => {
    const input = createInput();

    await createAppResolve(input);

    expect(input.appInit).toBe(appInit);
    expect(input.routing.ledger).toBe(ledger);
    expect(input.env).toBe(env);
  });
});
