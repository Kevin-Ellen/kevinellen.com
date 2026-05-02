// tests/src/request/pre-app-context/pre-app-context.request.test.ts

import { preAppContextOrchestrator } from "@request/pre-app-context/pre-app-context.request";

import { preAppContextResolveGone } from "@request/pre-app-context/gone/gone.resolve.pre-app-context.request";
import { preAppContextResolveRedirects } from "@request/pre-app-context/redirects/redirects.resolve.pre-app-context.request";
import { preAppContextSystemOrchestrator } from "@request/pre-app-context/system/system.pre-app-context.request";

jest.mock(
  "@request/pre-app-context/gone/gone.resolve.pre-app-context.request",
  () => ({
    preAppContextResolveGone: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-app-context/redirects/redirects.resolve.pre-app-context.request",
  () => ({
    preAppContextResolveRedirects: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-app-context/system/system.pre-app-context.request",
  () => ({
    preAppContextSystemOrchestrator: jest.fn(),
  }),
);

describe("preAppContextOrchestrator", () => {
  const mockedGone = jest.mocked(preAppContextResolveGone);
  const mockedRedirects = jest.mocked(preAppContextResolveRedirects);
  const mockedSystem = jest.mocked(preAppContextSystemOrchestrator);

  const req = new Request("https://kevinellen.com/test");
  const env = {} as Env;
  const appState = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns gone result when gone resolver matches (short-circuit)", async () => {
    const goneResult = {
      kind: "error",
      status: 410,
    } as const;

    mockedGone.mockReturnValue(goneResult);
    mockedRedirects.mockReturnValue(null);
    mockedSystem.mockReturnValue(null);

    const result = await preAppContextOrchestrator(req, env, appState);

    expect(result).toBe(goneResult);

    expect(mockedGone).toHaveBeenCalledWith(req, appState);
    expect(mockedRedirects).not.toHaveBeenCalled();
    expect(mockedSystem).not.toHaveBeenCalled();
  });

  it("returns redirect result when redirect resolver matches", async () => {
    const redirectResult = {
      kind: "direct-response",
      response: Response.redirect("https://kevinellen.com/new", 301),
    } as const;

    mockedGone.mockReturnValue(null);
    mockedRedirects.mockReturnValue(redirectResult);
    mockedSystem.mockReturnValue(null);

    const result = await preAppContextOrchestrator(req, env, appState);

    expect(result).toBe(redirectResult);

    expect(mockedGone).toHaveBeenCalledWith(req, appState);
    expect(mockedRedirects).toHaveBeenCalledWith(req, env, appState);
    expect(mockedSystem).not.toHaveBeenCalled();
  });

  it("returns system result when system resolver matches", async () => {
    const systemResult = {
      kind: "direct-response",
      response: new Response("robots"),
    } as const;

    mockedGone.mockReturnValue(null);
    mockedRedirects.mockReturnValue(null);
    mockedSystem.mockReturnValue(systemResult);

    const result = await preAppContextOrchestrator(req, env, appState);

    expect(result).toBe(systemResult);

    expect(mockedGone).toHaveBeenCalledWith(req, appState);
    expect(mockedRedirects).toHaveBeenCalledWith(req, env, appState);
    expect(mockedSystem).toHaveBeenCalledWith(req, env, appState);
  });

  it("returns continue when no resolver matches", async () => {
    mockedGone.mockReturnValue(null);
    mockedRedirects.mockReturnValue(null);
    mockedSystem.mockReturnValue(null);

    const result = await preAppContextOrchestrator(req, env, appState);

    expect(result).toEqual({ kind: "continue" });

    expect(mockedGone).toHaveBeenCalledWith(req, appState);
    expect(mockedRedirects).toHaveBeenCalledWith(req, env, appState);
    expect(mockedSystem).toHaveBeenCalledWith(req, env, appState);
  });
});
