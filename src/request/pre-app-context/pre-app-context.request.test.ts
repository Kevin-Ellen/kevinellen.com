// src/request/pre-app-context/pre-app-context.request.test.ts

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

const createRequest = (): Request => new Request("https://example.com/");
const createEnv = (): Env => ({ APP_ENV: "prod" }) as Env;
const createAppState = () => ({}) as never;

const createResult = (label: string) =>
  ({
    kind: "direct-response",
    response: new Response(label),
  }) as const;

describe("preAppContextOrchestrator", () => {
  const mockedPreAppContextResolveGone = jest.mocked(preAppContextResolveGone);
  const mockedPreAppContextResolveRedirects = jest.mocked(
    preAppContextResolveRedirects,
  );
  const mockedPreAppContextSystemOrchestrator = jest.mocked(
    preAppContextSystemOrchestrator,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns gone result first", async () => {
    const req = createRequest();
    const env = createEnv();
    const appState = createAppState();
    const result = { kind: "error", status: 410 } as const;

    mockedPreAppContextResolveGone.mockReturnValue(result);

    await expect(preAppContextOrchestrator(req, env, appState)).resolves.toBe(
      result,
    );

    expect(mockedPreAppContextResolveGone).toHaveBeenCalledWith(req, appState);
    expect(mockedPreAppContextResolveRedirects).not.toHaveBeenCalled();
    expect(mockedPreAppContextSystemOrchestrator).not.toHaveBeenCalled();
  });

  it("returns redirect result when gone does not match", async () => {
    const req = createRequest();
    const env = createEnv();
    const appState = createAppState();
    const result = createResult("redirect");

    mockedPreAppContextResolveGone.mockReturnValue(null);
    mockedPreAppContextResolveRedirects.mockReturnValue(result);

    await expect(preAppContextOrchestrator(req, env, appState)).resolves.toBe(
      result,
    );

    expect(mockedPreAppContextResolveRedirects).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(mockedPreAppContextSystemOrchestrator).not.toHaveBeenCalled();
  });

  it("returns system result when gone and redirects do not match", async () => {
    const req = createRequest();
    const env = createEnv();
    const appState = createAppState();
    const result = createResult("system");

    mockedPreAppContextResolveGone.mockReturnValue(null);
    mockedPreAppContextResolveRedirects.mockReturnValue(null);
    mockedPreAppContextSystemOrchestrator.mockReturnValue(result);

    await expect(preAppContextOrchestrator(req, env, appState)).resolves.toBe(
      result,
    );
  });

  it("continues when no pre-app-context handler matches", async () => {
    mockedPreAppContextResolveGone.mockReturnValue(null);
    mockedPreAppContextResolveRedirects.mockReturnValue(null);
    mockedPreAppContextSystemOrchestrator.mockReturnValue(null);

    await expect(
      preAppContextOrchestrator(createRequest(), createEnv(), createAppState()),
    ).resolves.toEqual({ kind: "continue" });
  });
});
