// src/request/pre-app-context/system/system.pre-app-context.request.test.ts

import { preAppContextSystemOrchestrator } from "@request/pre-app-context/system/system.pre-app-context.request";
import { robotsTxtSystemOrchestrator } from "@request/pre-app-context/system/robots-txt/robots-txt.system.pre-app-context.request";
import { xmlSitemapSystemOrchestrator } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.system.pre-app-context.request";
import { webmanifestSystemOrchestrator } from "@request/pre-app-context/system/webmanifest/webmanifest.system.pre-app-context.request";

jest.mock(
  "@request/pre-app-context/system/robots-txt/robots-txt.system.pre-app-context.request",
  () => ({
    robotsTxtSystemOrchestrator: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-app-context/system/sitemap-xml/xml-sitemap.system.pre-app-context.request",
  () => ({
    xmlSitemapSystemOrchestrator: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-app-context/system/webmanifest/webmanifest.system.pre-app-context.request",
  () => ({
    webmanifestSystemOrchestrator: jest.fn(),
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

describe("preAppContextSystemOrchestrator", () => {
  const mockedRobotsTxtSystemOrchestrator = jest.mocked(
    robotsTxtSystemOrchestrator,
  );
  const mockedXmlSitemapSystemOrchestrator = jest.mocked(
    xmlSitemapSystemOrchestrator,
  );
  const mockedWebmanifestSystemOrchestrator = jest.mocked(
    webmanifestSystemOrchestrator,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns robots.txt result first", () => {
    const req = createRequest();
    const env = createEnv();
    const appState = createAppState();
    const result = createResult("robots");

    mockedRobotsTxtSystemOrchestrator.mockReturnValue(result);

    const actual = preAppContextSystemOrchestrator(req, env, appState);

    expect(actual).toBe(result);
    expect(mockedRobotsTxtSystemOrchestrator).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(mockedXmlSitemapSystemOrchestrator).not.toHaveBeenCalled();
    expect(mockedWebmanifestSystemOrchestrator).not.toHaveBeenCalled();
  });

  it("returns sitemap result when robots.txt does not match", () => {
    const req = createRequest();
    const env = createEnv();
    const appState = createAppState();
    const result = createResult("sitemap");

    mockedRobotsTxtSystemOrchestrator.mockReturnValue(null);
    mockedXmlSitemapSystemOrchestrator.mockReturnValue(result);

    const actual = preAppContextSystemOrchestrator(req, env, appState);

    expect(actual).toBe(result);
    expect(mockedWebmanifestSystemOrchestrator).not.toHaveBeenCalled();
  });

  it("returns webmanifest result when earlier system routes do not match", () => {
    const req = createRequest();
    const env = createEnv();
    const appState = createAppState();
    const result = createResult("manifest");

    mockedRobotsTxtSystemOrchestrator.mockReturnValue(null);
    mockedXmlSitemapSystemOrchestrator.mockReturnValue(null);
    mockedWebmanifestSystemOrchestrator.mockReturnValue(result);

    const actual = preAppContextSystemOrchestrator(req, env, appState);

    expect(actual).toBe(result);
  });

  it("returns null when no system route matches", () => {
    mockedRobotsTxtSystemOrchestrator.mockReturnValue(null);
    mockedXmlSitemapSystemOrchestrator.mockReturnValue(null);
    mockedWebmanifestSystemOrchestrator.mockReturnValue(null);

    const actual = preAppContextSystemOrchestrator(
      createRequest(),
      createEnv(),
      createAppState(),
    );

    expect(actual).toBeNull();
  });
});
