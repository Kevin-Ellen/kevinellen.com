// tests/src/app/policies/request/run.request.system.stage.test.ts

import type { AppState } from "@app/appState/class.appState";

import { runRequestSystemStage } from "@app/policies/request/run.request.system.stage";

import { evaluateRobotsTxtRequestSystem } from "@app/policies/request/system/evaluate.robots-txt.request.system";
import { evaluateSitemapXmlRequestSystem } from "@app/policies/request/system/evaluate.sitemap-xml.request.system";
import { evaluateWebManifestRequestSystem } from "@app/policies/request/system/evaluate.webmanifest.request.system";

jest.mock(
  "@app/policies/request/system/evaluate.robots-txt.request.system",
  () => ({
    evaluateRobotsTxtRequestSystem: jest.fn(),
  }),
);

jest.mock(
  "@app/policies/request/system/evaluate.sitemap-xml.request.system",
  () => ({
    evaluateSitemapXmlRequestSystem: jest.fn(),
  }),
);

jest.mock(
  "@app/policies/request/system/evaluate.webmanifest.request.system",
  () => ({
    evaluateWebManifestRequestSystem: jest.fn(),
  }),
);

describe("runRequestSystemStage", () => {
  const req = new Request("https://example.com/test");
  const env = {} as Env;
  const appState = {} as AppState;

  const mockedEvaluateRobotsTxtRequestSystem =
    evaluateRobotsTxtRequestSystem as jest.MockedFunction<
      typeof evaluateRobotsTxtRequestSystem
    >;

  const mockedEvaluateSitemapXmlRequestSystem =
    evaluateSitemapXmlRequestSystem as jest.MockedFunction<
      typeof evaluateSitemapXmlRequestSystem
    >;

  const mockedEvaluateWebManifestRequestSystem =
    evaluateWebManifestRequestSystem as jest.MockedFunction<
      typeof evaluateWebManifestRequestSystem
    >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns direct-response when robots evaluator matches", () => {
    const response = new Response("robots", { status: 200 });

    mockedEvaluateRobotsTxtRequestSystem.mockReturnValue({
      kind: "direct-response",
      response,
    });

    const result = runRequestSystemStage(req, env, appState);

    expect(result).toEqual({
      kind: "direct-response",
      response,
    });

    expect(mockedEvaluateRobotsTxtRequestSystem).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(mockedEvaluateSitemapXmlRequestSystem).not.toHaveBeenCalled();
    expect(mockedEvaluateWebManifestRequestSystem).not.toHaveBeenCalled();
  });

  it("returns direct-response when sitemap evaluator matches after robots continues", () => {
    const response = new Response("sitemap", { status: 200 });

    mockedEvaluateRobotsTxtRequestSystem.mockReturnValue({
      kind: "continue",
    });

    mockedEvaluateSitemapXmlRequestSystem.mockReturnValue({
      kind: "direct-response",
      response,
    });

    const result = runRequestSystemStage(req, env, appState);

    expect(result).toEqual({
      kind: "direct-response",
      response,
    });

    expect(mockedEvaluateRobotsTxtRequestSystem).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(mockedEvaluateSitemapXmlRequestSystem).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(mockedEvaluateWebManifestRequestSystem).not.toHaveBeenCalled();
  });

  it("returns direct-response when manifest evaluator matches after earlier evaluators continue", () => {
    const response = new Response("manifest", { status: 200 });

    mockedEvaluateRobotsTxtRequestSystem.mockReturnValue({
      kind: "continue",
    });

    mockedEvaluateSitemapXmlRequestSystem.mockReturnValue({
      kind: "continue",
    });

    mockedEvaluateWebManifestRequestSystem.mockReturnValue({
      kind: "direct-response",
      response,
    });

    const result = runRequestSystemStage(req, env, appState);

    expect(result).toEqual({
      kind: "direct-response",
      response,
    });

    expect(mockedEvaluateRobotsTxtRequestSystem).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(mockedEvaluateSitemapXmlRequestSystem).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(mockedEvaluateWebManifestRequestSystem).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
  });

  it("returns continue when all evaluators continue", () => {
    mockedEvaluateRobotsTxtRequestSystem.mockReturnValue({
      kind: "continue",
    });

    mockedEvaluateSitemapXmlRequestSystem.mockReturnValue({
      kind: "continue",
    });

    mockedEvaluateWebManifestRequestSystem.mockReturnValue({
      kind: "continue",
    });

    const result = runRequestSystemStage(req, env, appState);

    expect(result).toEqual({
      kind: "continue",
    });

    expect(mockedEvaluateRobotsTxtRequestSystem).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(mockedEvaluateSitemapXmlRequestSystem).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(mockedEvaluateWebManifestRequestSystem).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
  });
});
