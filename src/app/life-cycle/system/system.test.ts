// src/app/life-cycle/system/system.test.ts

import type { AppInit } from "../app-init/class.app-init";
import type { PublishedRegistry } from "../../../shared/types/content/kv-ledger.content.shared.type";
import type { SystemResolverId } from "../../types/system/system.shared.type";

import { handleSystem } from "./system";
import { resolveRobotsTxtSystem } from "./robots-txt/robots-txt.system";
import { resolveWebmanifestSystem } from "./webmanifest/webmanifest.system";
import { resolveSitemapSystem } from "./sitemap-xml/sitemap-xml.system";

jest.mock("./robots-txt/robots-txt.system", () => ({
  resolveRobotsTxtSystem: jest.fn(),
}));

jest.mock("./webmanifest/webmanifest.system", () => ({
  resolveWebmanifestSystem: jest.fn(),
}));

jest.mock("./sitemap-xml/sitemap-xml.system", () => ({
  resolveSitemapSystem: jest.fn(),
}));

const mockedRobots = jest.mocked(resolveRobotsTxtSystem);
const mockedWebmanifest = jest.mocked(resolveWebmanifestSystem);
const mockedSitemap = jest.mocked(resolveSitemapSystem);

describe("System dispatcher", () => {
  const appInit = {} as AppInit;
  const ledger = {} as PublishedRegistry;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("dispatches robots-txt requests", () => {
    const expected = {
      kind: "txt",
      status: 200,
      body: "User-agent: *\n",
    } as const;

    mockedRobots.mockReturnValue(expected);

    const response = handleSystem({
      resolver: "robots-txt",
      appInit,
      ledger: null,
    });

    expect(mockedRobots).toHaveBeenCalledWith({ appInit });
    expect(mockedRobots).toHaveBeenCalledTimes(1);
    expect(mockedWebmanifest).not.toHaveBeenCalled();
    expect(mockedSitemap).not.toHaveBeenCalled();
    expect(response).toBe(expected);
  });

  it("dispatches webmanifest requests", () => {
    const expected = {
      kind: "json",
      status: 200,
      body: "{}",
    } as const;

    mockedWebmanifest.mockReturnValue(expected);

    const response = handleSystem({
      resolver: "webmanifest",
      appInit,
      ledger: null,
    });

    expect(mockedWebmanifest).toHaveBeenCalledWith({ appInit });
    expect(mockedWebmanifest).toHaveBeenCalledTimes(1);
    expect(mockedRobots).not.toHaveBeenCalled();
    expect(mockedSitemap).not.toHaveBeenCalled();
    expect(response).toBe(expected);
  });

  it("dispatches sitemap requests with the published ledger", () => {
    const expected = {
      kind: "xml",
      status: 200,
      body: "<urlset></urlset>",
    } as const;

    mockedSitemap.mockReturnValue(expected);

    const response = handleSystem({
      resolver: "sitemap",
      appInit,
      ledger,
    });

    expect(mockedSitemap).toHaveBeenCalledWith({
      appInit,
      ledger,
    });
    expect(mockedSitemap).toHaveBeenCalledTimes(1);
    expect(mockedRobots).not.toHaveBeenCalled();
    expect(mockedWebmanifest).not.toHaveBeenCalled();
    expect(response).toBe(expected);
  });

  it("rejects sitemap requests without a published ledger", () => {
    expect(() =>
      handleSystem({
        resolver: "sitemap",
        appInit,
        ledger: null,
      }),
    ).toThrow("Sitemap requires a published ledger");

    expect(mockedSitemap).not.toHaveBeenCalled();
    expect(mockedRobots).not.toHaveBeenCalled();
    expect(mockedWebmanifest).not.toHaveBeenCalled();
  });

  it("rejects unsupported system resolvers", () => {
    const unsupported = "unsupported-system" as SystemResolverId;

    expect(() =>
      handleSystem({
        resolver: unsupported,
        appInit,
        ledger,
      }),
    ).toThrow("Unsupported system resolver: unsupported-system");

    expect(mockedRobots).not.toHaveBeenCalled();
    expect(mockedWebmanifest).not.toHaveBeenCalled();
    expect(mockedSitemap).not.toHaveBeenCalled();
  });
});
