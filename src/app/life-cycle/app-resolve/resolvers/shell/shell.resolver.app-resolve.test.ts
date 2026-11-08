// src/app/life-cycle/app-resolve/resolvers/shell/shell.resolver.app-resolve.test.ts

import { resolveShellAppResolve } from "./shell.resolver.app-resolve";

import { resolveNavigationShellAppResolve } from "./navigation/navigation.shell.resolver.app-resolve";
import { resolveFooterShellAppResolve } from "./footer/footer.shell.resolver.app-resolve";

jest.mock("./navigation/navigation.shell.resolver.app-resolve", () => ({
  resolveNavigationShellAppResolve: jest.fn(),
}));

jest.mock("./footer/footer.shell.resolver.app-resolve", () => ({
  resolveFooterShellAppResolve: jest.fn(),
}));

const mockedNavigation = jest.mocked(resolveNavigationShellAppResolve);
const mockedFooter = jest.mocked(resolveFooterShellAppResolve);

type Input = Parameters<typeof resolveShellAppResolve>[0];
type ResolvedNavigation = ReturnType<typeof resolveNavigationShellAppResolve>;
type ResolvedFooter = ReturnType<typeof resolveFooterShellAppResolve>;

describe("Shell AppResolve resolver", () => {
  const navigation = {
    branding: { kind: "internal", pageId: "home" },
    primary: [],
    social: [],
  } as unknown as Input["appInit"]["navigation"];

  const footer = {
    conservation: {
      conservations: [],
    },
    colophon: {
      rights: "All rights reserved",
    },
  } as unknown as Input["appInit"]["footer"];

  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["contentRegistry"];

  const pagePresentation = {
    layout: "contained",
  } as Input["pagePresentation"];

  const resolvedNavigation = {
    branding: { href: "/" },
    primary: [],
    social: [],
  } as unknown as ResolvedNavigation;

  const resolvedFooter = {
    conservation: { conservations: [] },
    colophon: { rights: "All rights reserved" },
  } as unknown as ResolvedFooter;

  const createInput = (): Input => ({
    appInit: {
      navigation,
      footer,
    } as unknown as Input["appInit"],
    contentRegistry,
    pagePresentation,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedNavigation.mockReturnValue(resolvedNavigation);
    mockedFooter.mockReturnValue(resolvedFooter);
  });

  it("passes AppInit navigation and the content registry to its resolver", () => {
    const input = createInput();

    resolveShellAppResolve(input);

    expect(mockedNavigation).toHaveBeenCalledTimes(1);
    expect(mockedNavigation).toHaveBeenCalledWith({
      navigation: input.appInit.navigation,
      registry: contentRegistry,
    });
  });

  it("passes AppInit footer and the content registry to its resolver", () => {
    const input = createInput();

    resolveShellAppResolve(input);

    expect(mockedFooter).toHaveBeenCalledTimes(1);
    expect(mockedFooter).toHaveBeenCalledWith({
      footer: input.appInit.footer,
      registry: contentRegistry,
    });
  });

  it("combines the resolved navigation, footer and page presentation", () => {
    const result = resolveShellAppResolve(createInput());

    expect(result).toEqual({
      navigation: resolvedNavigation,
      footer: resolvedFooter,
      pagePresentation,
    });
  });

  it("preserves resolved object references", () => {
    const result = resolveShellAppResolve(createInput());

    expect(result.navigation).toBe(resolvedNavigation);
    expect(result.footer).toBe(resolvedFooter);
    expect(result.pagePresentation).toBe(pagePresentation);
  });

  it("supports a different page presentation", () => {
    const presentation = {
      ...pagePresentation,
      layout: "full-bleed",
    } as Input["pagePresentation"];

    const result = resolveShellAppResolve({
      ...createInput(),
      pagePresentation: presentation,
    });

    expect(result.pagePresentation).toBe(presentation);
  });

  it("resolves navigation before the footer", () => {
    resolveShellAppResolve(createInput());

    expect(
      mockedNavigation.mock.invocationCallOrder[0] ?? Infinity,
    ).toBeLessThan(mockedFooter.mock.invocationCallOrder[0] ?? Infinity);
  });

  it("propagates navigation resolution failures", () => {
    const error = new Error("Navigation resolution failed");

    mockedNavigation.mockImplementation(() => {
      throw error;
    });

    expect(() => resolveShellAppResolve(createInput())).toThrow(error);

    expect(mockedFooter).not.toHaveBeenCalled();
  });

  it("propagates footer resolution failures", () => {
    const error = new Error("Footer resolution failed");

    mockedFooter.mockImplementation(() => {
      throw error;
    });

    expect(() => resolveShellAppResolve(createInput())).toThrow(error);

    expect(mockedNavigation).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the AppInit configuration", () => {
    const input = createInput();

    resolveShellAppResolve(input);

    expect(input.appInit.navigation).toBe(navigation);
    expect(input.appInit.footer).toBe(footer);
    expect(input.pagePresentation).toBe(pagePresentation);
  });
});
