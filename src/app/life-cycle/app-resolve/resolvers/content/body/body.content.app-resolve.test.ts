// src/app/life-cycle/app-resolve/resolvers/content/body/body.content.app-resolve.test.ts

import { resolveContentBodyAppResolve } from "./body.content.app-resolve";

import { resolveContentModuleAppResolve } from "../modules/module.content.resolver.app-resolve";
import { resolveContentBodyFooterAppResolve } from "./footer/footer.body.content.app-resolve";

jest.mock("../modules/module.content.resolver.app-resolve", () => ({
  resolveContentModuleAppResolve: jest.fn(),
}));

jest.mock("./footer/footer.body.content.app-resolve", () => ({
  resolveContentBodyFooterAppResolve: jest.fn(),
}));

const mockedModule = jest.mocked(resolveContentModuleAppResolve);
const mockedFooter = jest.mocked(resolveContentBodyFooterAppResolve);

type Input = Parameters<typeof resolveContentBodyAppResolve>[0];
type Content = Input["content"];
type Module = Content["modules"][number];
type ResolvedModule = Awaited<
  ReturnType<typeof resolveContentModuleAppResolve>
>;
type ResolvedFooter = Awaited<
  ReturnType<typeof resolveContentBodyFooterAppResolve>
>;

describe("Content body AppResolve resolver", () => {
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

  const publication: Input["publication"] = {
    author: "Kevin Ellen",
    published: "2026-10-15",
    lastUpdated: "2026-10-20",
  };

  const createModule = (kind: Module["kind"]): Module =>
    ({ kind }) as unknown as Module;

  const createContent = (
    modules: readonly Module[] = [
      createModule("hero"),
      createModule("richContent"),
    ],
    footer: Content["footer"] = [
      {
        kind: "articleFooter",
      } as Content["footer"][number],
    ],
  ): Content => ({
    modules,
    footer,
  });

  const resolvedFooter = [
    {
      kind: "articleFooter",
      publication,
    },
  ] as unknown as ResolvedFooter;

  const createInput = (overrides: Partial<Input> = {}): Input => ({
    content: createContent(),
    contentRegistry,
    getPhoto,
    publication,
    journalLedger,
    requestedPage: 1,
    ...overrides,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedModule.mockImplementation(
      async ({ content }) => ({ kind: content.kind }) as ResolvedModule,
    );

    mockedFooter.mockResolvedValue(resolvedFooter);
  });

  it("resolves every body module in the original order", async () => {
    const input = createInput();

    const result = await resolveContentBodyAppResolve(input);

    expect(mockedModule).toHaveBeenCalledTimes(2);

    expect(result.modules.map((module) => module.kind)).toEqual([
      "hero",
      "richContent",
    ]);

    input.content.modules.forEach((module, index) => {
      expect(mockedModule).toHaveBeenNthCalledWith(index + 1, {
        content: module,
        contentRegistry,
        getPhoto,
        journalLedger,
        requestedPage: 1,
      });
    });
  });

  it("forwards the requested page to every module", async () => {
    const input = createInput({ requestedPage: 4 });

    await resolveContentBodyAppResolve(input);

    expect(mockedModule).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        requestedPage: 4,
      }),
    );

    expect(mockedModule).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        requestedPage: 4,
      }),
    );
  });

  it("passes the footer and publication to the footer resolver", async () => {
    const input = createInput();

    await resolveContentBodyAppResolve(input);

    expect(mockedFooter).toHaveBeenCalledTimes(1);
    expect(mockedFooter).toHaveBeenCalledWith({
      content: input.content.footer,
      publication,
    });
  });

  it("does not pass publication metadata to body modules", async () => {
    await resolveContentBodyAppResolve(createInput());

    for (const call of mockedModule.mock.calls) {
      expect(call[0]).not.toHaveProperty("publication");
    }
  });

  it("preserves the exact resolved footer reference", async () => {
    const result = await resolveContentBodyAppResolve(createInput());

    expect(result.footer).toBe(resolvedFooter);
  });

  it("preserves resolved module references and ordering", async () => {
    const first = {
      kind: "hero",
    } as ResolvedModule;

    const second = {
      kind: "quote",
    } as ResolvedModule;

    mockedModule.mockResolvedValueOnce(first).mockResolvedValueOnce(second);

    const content = createContent([
      createModule("hero"),
      createModule("quote"),
    ]);

    const result = await resolveContentBodyAppResolve(createInput({ content }));

    expect(result.modules[0]).toBe(first);
    expect(result.modules[1]).toBe(second);
  });

  it("supports an empty body and empty footer", async () => {
    const content = createContent([], []);

    mockedFooter.mockResolvedValue([]);

    const result = await resolveContentBodyAppResolve(createInput({ content }));

    expect(result).toEqual({
      modules: [],
      footer: [],
    });

    expect(mockedModule).not.toHaveBeenCalled();
    expect(mockedFooter).toHaveBeenCalledWith({
      content: [],
      publication,
    });
  });

  it("creates a new body and module collection", async () => {
    const input = createInput();

    const result = await resolveContentBodyAppResolve(input);

    expect(result).not.toBe(input.content);
    expect(result.modules).not.toBe(input.content.modules);
  });

  it("does not mutate the original body", async () => {
    const content = Object.freeze(createContent());
    const originalModules = content.modules;
    const originalFooter = content.footer;

    await resolveContentBodyAppResolve(createInput({ content }));

    expect(content.modules).toBe(originalModules);
    expect(content.footer).toBe(originalFooter);
  });

  it("propagates module resolution failures", async () => {
    const error = new Error("Module resolution failed");

    mockedModule.mockRejectedValue(error);

    await expect(resolveContentBodyAppResolve(createInput())).rejects.toThrow(
      error,
    );

    expect(mockedFooter).not.toHaveBeenCalled();
  });

  it("propagates footer resolution failures", async () => {
    const error = new Error("Footer resolution failed");

    mockedFooter.mockRejectedValue(error);

    await expect(resolveContentBodyAppResolve(createInput())).rejects.toThrow(
      error,
    );

    expect(mockedModule).toHaveBeenCalledTimes(2);
  });

  it("resolves the footer only after all body modules finish", async () => {
    const calls: string[] = [];

    mockedModule.mockImplementation(async ({ content }) => {
      calls.push(`module:${content.kind}`);
      return { kind: content.kind } as ResolvedModule;
    });

    mockedFooter.mockImplementation(async () => {
      calls.push("footer");
      return resolvedFooter;
    });

    await resolveContentBodyAppResolve(createInput());

    expect(calls).toEqual(["module:hero", "module:richContent", "footer"]);
  });

  it("waits for asynchronous modules before starting footer resolution", async () => {
    let finishModule: ((value: ResolvedModule) => void) | undefined;

    const content = createContent([createModule("hero")]);

    mockedModule.mockImplementationOnce(
      () =>
        new Promise<ResolvedModule>((resolve) => {
          finishModule = resolve;
        }),
    );

    const operation = resolveContentBodyAppResolve(createInput({ content }));

    expect(mockedModule).toHaveBeenCalledTimes(1);
    expect(mockedFooter).not.toHaveBeenCalled();

    if (!finishModule) {
      throw new Error("Module resolution did not start");
    }

    finishModule({ kind: "hero" } as ResolvedModule);

    await operation;

    expect(mockedFooter).toHaveBeenCalledTimes(1);
  });
});
