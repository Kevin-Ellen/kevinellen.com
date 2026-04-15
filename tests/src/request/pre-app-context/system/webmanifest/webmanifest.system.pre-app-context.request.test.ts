// tests/src/request/pre-app-context/system/webmanifest/webmanifest.system.pre-app-context.request.test.ts

import { webmanifestSystemOrchestrator } from "@request/pre-app-context/system/webmanifest/webmanifest.system.pre-app-context.request";
import { resolveWebmanifestSystem } from "@request/pre-app-context/system/webmanifest/webmanifest.resolver.system.pre-app-context.request";
import { renderWebmanifestSystem } from "@request/pre-app-context/system/webmanifest/webmanifest.render.system.pre-app-context.request";

import type { AppState } from "@app-state/class.app-state";

jest.mock(
  "@request/pre-app-context/system/webmanifest/webmanifest.resolver.system.pre-app-context.request",
  () => ({
    resolveWebmanifestSystem: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-app-context/system/webmanifest/webmanifest.render.system.pre-app-context.request",
  () => ({
    renderWebmanifestSystem: jest.fn(),
  }),
);

describe("webmanifestSystemOrchestrator", () => {
  const mockedResolve = jest.mocked(resolveWebmanifestSystem);
  const mockedRender = jest.mocked(renderWebmanifestSystem);

  const env = {} as Env;
  const appState = {} as AppState;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when resolver returns null", () => {
    const req = new Request("https://dev.kevinellen.com/other");

    mockedResolve.mockReturnValue(null);

    const result = webmanifestSystemOrchestrator(req, env, appState);

    expect(result).toBeNull();
    expect(mockedResolve).toHaveBeenCalledWith(req, appState);
    expect(mockedRender).not.toHaveBeenCalled();
  });

  it("renders and returns manifest when resolver succeeds", () => {
    const req = new Request("https://dev.kevinellen.com/manifest.webmanifest");

    const resolved = { name: "KE" } as const;

    const rendered = {
      kind: "direct-response",
      response: new Response("manifest"),
    } as const;

    mockedResolve.mockReturnValue(resolved as any);
    mockedRender.mockReturnValue(rendered as any);

    const result = webmanifestSystemOrchestrator(req, env, appState);

    expect(mockedResolve).toHaveBeenCalledWith(req, appState);
    expect(mockedRender).toHaveBeenCalledWith(resolved);
    expect(result).toBe(rendered);
  });
});
