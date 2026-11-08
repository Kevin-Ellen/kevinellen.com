// src/app/life-cycle/routing/routing.test.ts

import type { ValidatedEnv } from "../../entry.type";
import type { AppInit } from "../app-init/class.app-init";
import type { PublishedRegistry } from "../../../shared/types/content/kv-ledger.content.shared.type";

import { handleRouting } from "./routing";
import { checkSystemRouting } from "./system/system.routing";
import { resolveJournalLedgerRouting } from "./ledger/ledger.routing";
import { matchRouting } from "./matching/matching.routing";

jest.mock("./system/system.routing", () => ({
  checkSystemRouting: jest.fn(),
}));

jest.mock("./ledger/ledger.routing", () => ({
  resolveJournalLedgerRouting: jest.fn(),
}));

jest.mock("./matching/matching.routing", () => ({
  matchRouting: jest.fn(),
}));

const mockedCheckSystemRouting = jest.mocked(checkSystemRouting);
const mockedResolveLedger = jest.mocked(resolveJournalLedgerRouting);
const mockedMatchRouting = jest.mocked(matchRouting);

describe("Routing lifecycle", () => {
  const env = {} as ValidatedEnv;
  const appInit = {} as AppInit;

  const ledger: PublishedRegistry = {
    bySlug: {},
    newestFirst: [],
  };

  const createRequest = (pathname: string): Request =>
    new Request(`https://kevinellen.com${pathname}`);

  const route = (pathname: string) =>
    handleRouting({
      request: createRequest(pathname),
      env,
      appInit,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedResolveLedger.mockResolvedValue(ledger);
    mockedCheckSystemRouting.mockReturnValue(null);
  });

  it("returns early system routes without loading the ledger", async () => {
    const expected = {
      kind: "system",
      resolver: "robots-txt",
      ledger: null,
    } as const;

    mockedCheckSystemRouting.mockReturnValueOnce(expected);

    const result = await route("/robots.txt");

    expect(result).toEqual(expected);

    expect(mockedCheckSystemRouting).toHaveBeenCalledTimes(1);
    expect(mockedCheckSystemRouting).toHaveBeenCalledWith({
      pathname: "/robots.txt",
      appInit,
      ledger: null,
    });

    expect(mockedResolveLedger).not.toHaveBeenCalled();
    expect(mockedMatchRouting).not.toHaveBeenCalled();
  });

  it("loads the ledger when no early system route matches", async () => {
    mockedMatchRouting.mockReturnValue({
      kind: "not-found",
      status: 404,
      pathname: "/unknown",
      ledger,
    });

    await route("/unknown");

    expect(mockedResolveLedger).toHaveBeenCalledWith({
      env,
    });

    expect(mockedResolveLedger).toHaveBeenCalledTimes(1);
  });

  it("returns late system routes after loading the ledger", async () => {
    const expected = {
      kind: "system",
      resolver: "sitemap",
      ledger,
    } as const;

    mockedCheckSystemRouting
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(expected);

    const result = await route("/sitemap.xml");

    expect(result).toEqual(expected);

    expect(mockedCheckSystemRouting).toHaveBeenNthCalledWith(1, {
      pathname: "/sitemap.xml",
      appInit,
      ledger: null,
    });

    expect(mockedCheckSystemRouting).toHaveBeenNthCalledWith(2, {
      pathname: "/sitemap.xml",
      appInit,
      ledger,
    });

    expect(mockedResolveLedger).toHaveBeenCalledTimes(1);
    expect(mockedMatchRouting).not.toHaveBeenCalled();
  });

  it("delegates ordinary requests to content matching", async () => {
    const pathname = "/journal/epping-forest";

    const expected = {
      kind: "selected",
      pathname,
      contentPathname: pathname,
      source: "published",
      ledger,
    } as const;

    mockedMatchRouting.mockReturnValue(expected);

    const result = await route(pathname);

    expect(result).toEqual(expected);

    expect(mockedCheckSystemRouting).toHaveBeenCalledTimes(2);

    expect(mockedMatchRouting).toHaveBeenCalledWith({
      pathname,
      appInit,
      ledger,
    });

    expect(mockedMatchRouting).toHaveBeenCalledTimes(1);
  });

  it("returns not-found results from content matching", async () => {
    const pathname = "/missing";

    const expected = {
      kind: "not-found",
      status: 404,
      pathname,
      ledger,
    } as const;

    mockedMatchRouting.mockReturnValue(expected);

    const result = await route(pathname);

    expect(result).toBe(expected);
  });

  it("propagates ledger retrieval failures", async () => {
    const error = new Error("KV unavailable");

    mockedResolveLedger.mockRejectedValue(error);

    await expect(route("/journal/example")).rejects.toBe(error);

    expect(mockedCheckSystemRouting).toHaveBeenCalledTimes(1);
    expect(mockedMatchRouting).not.toHaveBeenCalled();
  });

  it("does not load the ledger for early webmanifest routes", async () => {
    const expected = {
      kind: "system",
      resolver: "webmanifest",
      ledger: null,
    } as const;

    mockedCheckSystemRouting.mockReturnValueOnce(expected);

    const result = await route("/manifest.webmanifest");

    expect(result).toBe(expected);

    expect(mockedResolveLedger).not.toHaveBeenCalled();
    expect(mockedMatchRouting).not.toHaveBeenCalled();
  });

  it("extracts the pathname without query parameters", async () => {
    mockedMatchRouting.mockReturnValue({
      kind: "not-found",
      status: 404,
      pathname: "/journal/example",
      ledger,
    });

    await route("/journal/example?utm_source=test&page=2");

    expect(mockedCheckSystemRouting).toHaveBeenCalledWith({
      pathname: "/journal/example",
      appInit,
      ledger: null,
    });

    expect(mockedMatchRouting).toHaveBeenCalledWith({
      pathname: "/journal/example",
      appInit,
      ledger,
    });
  });

  it("preserves the ledger instance across routing stages", async () => {
    mockedMatchRouting.mockReturnValue({
      kind: "not-found",
      status: 404,
      pathname: "/example",
      ledger,
    });

    await route("/example");

    const lateSystemCall = mockedCheckSystemRouting.mock.calls[1]?.[0];

    const matchingCall = mockedMatchRouting.mock.calls[0]?.[0];

    expect(lateSystemCall?.ledger).toBe(ledger);
    expect(matchingCall?.ledger).toBe(ledger);
  });
});
