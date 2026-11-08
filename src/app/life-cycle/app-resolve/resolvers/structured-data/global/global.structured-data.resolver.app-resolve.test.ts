// src/app/life-cycle/app-resolve/resolvers/structured-data/global/global.structured-data.resolver.app-resolve.test.ts

import { personConfigAuthored } from "../../../../../../shared/config/person.config.shared.authored";
import { siteConfigAuthored } from "../../../../../../shared/config/site.config.shared.authored";

import { resolveGlobalStructuredDataAppResolve } from "./global.structured-data.resolver.app-resolve";

import { resolvePersonAppResolve } from "./person/person.global.structured-data.resolver.app-resolve";
import { resolveWebsiteAppResolve } from "./website/website.global.structured-data.resolver.app-resolve";

jest.mock(
  "./person/person.global.structured-data.resolver.app-resolve",
  () => ({
    resolvePersonAppResolve: jest.fn(),
  }),
);

jest.mock(
  "./website/website.global.structured-data.resolver.app-resolve",
  () => ({
    resolveWebsiteAppResolve: jest.fn(),
  }),
);

const mockedPerson = jest.mocked(resolvePersonAppResolve);
const mockedWebsite = jest.mocked(resolveWebsiteAppResolve);

type Input = Parameters<typeof resolveGlobalStructuredDataAppResolve>[0];
type PersonEntity = ReturnType<typeof resolvePersonAppResolve>;
type WebsiteEntity = ReturnType<typeof resolveWebsiteAppResolve>;

describe("Global structured data AppResolve resolver", () => {
  const person: Input["person"] = {
    ...personConfigAuthored,
    website: "https://kevinellen.com",
  };

  const site: Input["site"] = {
    ...siteConfigAuthored,
    canonicalDomain: "https://kevinellen.com",
  };

  const personEntity = {
    "@type": "Person",
    "@id": "https://kevinellen.com/#person",
  } as PersonEntity;

  const websiteEntity = {
    "@type": "WebSite",
    "@id": "https://kevinellen.com/#website",
  } as WebsiteEntity;

  const resolve = () =>
    resolveGlobalStructuredDataAppResolve({
      person,
      site,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedPerson.mockReturnValue(personEntity);
    mockedWebsite.mockReturnValue(websiteEntity);
  });

  it("resolves the global Person entity once", () => {
    resolve();

    expect(mockedPerson).toHaveBeenCalledTimes(1);
    expect(mockedPerson).toHaveBeenCalledWith({
      person,
    });
  });

  it("resolves the global WebSite entity once", () => {
    resolve();

    expect(mockedWebsite).toHaveBeenCalledTimes(1);
    expect(mockedWebsite).toHaveBeenCalledWith({
      name: site.name,
      description: site.description,
      canonicalDomain: site.canonicalDomain,
      language: site.language,
    });
  });

  it("returns Person followed by WebSite", () => {
    const result = resolve();

    expect(result).toEqual([personEntity, websiteEntity]);
  });

  it("preserves both resolved entity references", () => {
    const result = resolve();

    expect(result[0]).toBe(personEntity);
    expect(result[1]).toBe(websiteEntity);
  });

  it("returns a new graph array on each invocation", () => {
    const first = resolve();
    const second = resolve();

    expect(first).not.toBe(second);
    expect(first).toEqual(second);
  });

  it("uses the current site configuration for website resolution", () => {
    const stagingSite: Input["site"] = {
      ...site,
      canonicalDomain: "https://staging.kevinellen.com",
      language: "nl-NL",
    };

    resolveGlobalStructuredDataAppResolve({
      person,
      site: stagingSite,
    });

    expect(mockedWebsite).toHaveBeenCalledWith({
      name: stagingSite.name,
      description: stagingSite.description,
      canonicalDomain: stagingSite.canonicalDomain,
      language: "nl-NL",
    });
  });

  it("propagates Person resolution failures", () => {
    const error = new Error("Person resolution failed");

    mockedPerson.mockImplementation(() => {
      throw error;
    });

    expect(resolve).toThrow(error);

    expect(mockedWebsite).not.toHaveBeenCalled();
  });

  it("propagates WebSite resolution failures", () => {
    const error = new Error("Website resolution failed");

    mockedWebsite.mockImplementation(() => {
      throw error;
    });

    expect(resolve).toThrow(error);

    expect(mockedPerson).toHaveBeenCalledTimes(1);
  });

  it("resolves Person before WebSite", () => {
    resolve();

    const personOrder = mockedPerson.mock.invocationCallOrder[0];

    const websiteOrder = mockedWebsite.mock.invocationCallOrder[0];

    expect(personOrder).toBeDefined();
    expect(websiteOrder).toBeDefined();

    expect(personOrder).toBeLessThan(websiteOrder);
  });
});
