// src/app/life-cycle/routing/system/system.routing.test.ts

import type { AppInit } from "../../app-init/class.app-init";

import { checkSystemRouting } from "./system.routing";

describe("System routing", () => {
  type TestLedger = Readonly<{
    version: number;
  }>;

  const ledger: TestLedger = {
    version: 1,
  };

  const resolve = (
    pathname: string,
    publishedLedger: TestLedger | null = null,
    manifest = "/manifest.webmanifest",
  ) =>
    checkSystemRouting<TestLedger>({
      pathname,
      appInit: {
        site: { manifest },
      } as AppInit,
      ledger: publishedLedger,
    });

  it("routes robots.txt without requiring a ledger", () => {
    expect(resolve("/robots.txt")).toEqual({
      kind: "system",
      resolver: "robots-txt",
      ledger: null,
    });
  });

  it("routes the configured webmanifest path", () => {
    expect(resolve("/manifest.webmanifest")).toEqual({
      kind: "system",
      resolver: "webmanifest",
      ledger: null,
    });
  });

  it("supports custom webmanifest paths", () => {
    expect(resolve("/app.webmanifest", null, "/app.webmanifest")).toEqual({
      kind: "system",
      resolver: "webmanifest",
      ledger: null,
    });
  });

  it("routes sitemap.xml when a ledger exists", () => {
    const result = resolve("/sitemap.xml", ledger);

    expect(result).toEqual({
      kind: "system",
      resolver: "sitemap",
      ledger,
    });

    expect(result?.ledger).toBe(ledger);
  });

  it("does not route sitemap.xml without a ledger", () => {
    expect(resolve("/sitemap.xml")).toBeNull();
  });

  it("does not route unknown paths", () => {
    expect(resolve("/unknown", ledger)).toBeNull();
  });

  it("uses exact, case-sensitive route matching", () => {
    expect(resolve("/ROBOTS.TXT")).toBeNull();
    expect(resolve("/robots.txt/")).toBeNull();
    expect(resolve("/manifest.webmanifest/")).toBeNull();
    expect(resolve("/sitemap.xml/ ", ledger)).toBeNull();
  });

  it("does not return a ledger for robots.txt", () => {
    expect(resolve("/robots.txt", ledger)).toEqual({
      kind: "system",
      resolver: "robots-txt",
      ledger: null,
    });
  });

  it("does not return a ledger for webmanifest", () => {
    expect(resolve("/manifest.webmanifest", ledger)).toEqual({
      kind: "system",
      resolver: "webmanifest",
      ledger: null,
    });
  });

  it("returns null for an unrelated route with a ledger", () => {
    expect(resolve("/journals/example", ledger)).toBeNull();
  });
});
