// tests/src/app-context/resolve/structured-data/website.structured-data.global.resolve.app-context.test.ts

import { resolveWebsiteStructuredDataGlobalAppContext } from "@app-context/resolve/structured-data/website.structured-data.global.resolve.app-context";
import { appStateCreate } from "@app-state/create.app-state";

const makeEnv = (): Env =>
  ({
    APP_ENV: "dev",
    APP_HOST: "dev.kevinellen.com",
  }) as Env;

describe("resolveWebsiteStructuredDataGlobalAppContext", () => {
  it("resolves website structured data references to absolute urls", () => {
    const appState = appStateCreate(makeEnv());
    const origin = appState.siteConfig.origin;

    const result = resolveWebsiteStructuredDataGlobalAppContext(
      appState.structuredData.website,
      appState,
    );

    expect(result).toEqual({
      id: "website",
      json: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: `${origin}/`,
        name: appState.structuredData.website.name,
        description: appState.structuredData.website.description,
        inLanguage: appState.structuredData.website.inLanguage,
        publisher: {
          "@id": `${origin}/about#person`,
        },
      },
    });
  });

  it("throws when the id page reference cannot be resolved", () => {
    const appState = appStateCreate(makeEnv());

    expect(() =>
      resolveWebsiteStructuredDataGlobalAppContext(
        {
          ...appState.structuredData.website,
          id: {
            pageId: "missing-page" as never,
            hash: "#website",
          },
        },
        appState,
      ),
    ).toThrow(
      "Missing public page for structured data reference 'missing-page'.",
    );
  });

  it("throws when the url page reference cannot be resolved", () => {
    const appState = appStateCreate(makeEnv());

    expect(() =>
      resolveWebsiteStructuredDataGlobalAppContext(
        {
          ...appState.structuredData.website,
          url: {
            pageId: "missing-page" as never,
          },
        },
        appState,
      ),
    ).toThrow(
      "Missing public page for structured data reference 'missing-page'.",
    );
  });

  it("throws when the publisher page reference cannot be resolved", () => {
    const appState = appStateCreate(makeEnv());

    expect(() =>
      resolveWebsiteStructuredDataGlobalAppContext(
        {
          ...appState.structuredData.website,
          publisherId: {
            pageId: "missing-page" as never,
            hash: "#person",
          },
        },
        appState,
      ),
    ).toThrow(
      "Missing public page for structured data reference 'missing-page'.",
    );
  });
});
