// tests/src/request/pre-context/system/robots-txt/robots-txt.system.pre-app-context.request.test.ts

import { robotsTxtSystemOrchestrator } from "@request/pre-app-context/system/robots-txt/robots-txt.system.pre-app-context.request";
import { resolveRobotsTxtSystem } from "@request/pre-app-context/system/robots-txt/robots-txt.resolver.system.pre-app-context.request";
import { renderRobotsTxtSystem } from "@request/pre-app-context/system/robots-txt/robots-txt.render.system.pre-app-context.request";

import type { AppState } from "@app-state/class.app-state";

jest.mock(
  "@request/pre-app-context/system/robots-txt/robots-txt.resolver.system.pre-app-context.request",
  () => ({
    resolveRobotsTxtSystem: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-app-context/system/robots-txt/robots-txt.render.system.pre-app-context.request",
  () => ({
    renderRobotsTxtSystem: jest.fn(),
  }),
);

describe("robotsTxtSystemOrchestrator", () => {
  const mockedResolveRobotsTxtSystem = jest.mocked(resolveRobotsTxtSystem);
  const mockedRenderRobotsTxtSystem = jest.mocked(renderRobotsTxtSystem);

  const env = {} as Env;
  const appState = {} as AppState;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when the resolver does not match the request", () => {
    const req = new Request("https://dev.kevinellen.com/not-robots.txt");

    mockedResolveRobotsTxtSystem.mockReturnValue(null);

    const result = robotsTxtSystemOrchestrator(req, env, appState);

    expect(result).toBeNull();
    expect(mockedResolveRobotsTxtSystem).toHaveBeenCalledWith(req, appState);
    expect(mockedRenderRobotsTxtSystem).not.toHaveBeenCalled();
  });

  it("renders and returns the robots.txt response when the resolver matches", () => {
    const req = new Request("https://dev.kevinellen.com/robots.txt");

    const resolved = {
      sitemapUrl: "https://dev.kevinellen.com/sitemap.xml",
      rules: ["User-agent: *", "Allow: /"],
    } as const;

    const renderedResult = {
      kind: "direct-response",
      response: new Response("robots", {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      }),
    } as const;

    mockedResolveRobotsTxtSystem.mockReturnValue(resolved);
    mockedRenderRobotsTxtSystem.mockReturnValue(renderedResult);

    const result = robotsTxtSystemOrchestrator(req, env, appState);

    expect(mockedResolveRobotsTxtSystem).toHaveBeenCalledWith(req, appState);
    expect(mockedRenderRobotsTxtSystem).toHaveBeenCalledWith(resolved);
    expect(result).toBe(renderedResult);
  });
});
