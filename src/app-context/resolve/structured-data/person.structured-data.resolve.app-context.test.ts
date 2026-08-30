// src/app-context/resolve/structured-data/person.structured-data.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStatePersonStructuredData } from "@shared-types/config/structured-data/app-state.person.structured-data.types";

import { appContextResolvePersonStructuredData } from "@app-context/resolve/structured-data/person.structured-data.resolve.app-context";

import { resolveStructuredDataPageReferenceHref } from "@app-context/resolve/structured-data/page-reference.structured-data.resolve.app-context";

jest.mock(
  "@app-context/resolve/structured-data/page-reference.structured-data.resolve.app-context",
  () => ({
    resolveStructuredDataPageReferenceHref: jest.fn(),
  }),
);

describe("appContextResolvePersonStructuredData", () => {
  const mockedResolveStructuredDataPageReferenceHref = jest.mocked(
    resolveStructuredDataPageReferenceHref,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves person structured data", () => {
    const appState = {} as AppState;

    const structuredData: AppStatePersonStructuredData = {
      id: {
        pageId: "about",
        hash: "#person",
      },
      url: {
        pageId: "about",
      },
      name: "Kevin Ellen",
      description:
        "Wildlife photographer and technical SEO specialist based in south-east England.",
      jobTitle: "Technical SEO Specialist",
      knowsAbout: ["Wildlife photography", "Technical SEO", "Structured data"],
      knowsLanguage: ["en-GB", "nl-NL"],
      sameAs: [
        "https://github.com/Kevin-Ellen",
        "https://www.linkedin.com/in/kevinellen/",
      ],
    };

    mockedResolveStructuredDataPageReferenceHref
      .mockReturnValueOnce("https://example.com/about#person")
      .mockReturnValueOnce("https://example.com/about");

    expect(
      appContextResolvePersonStructuredData(structuredData, appState),
    ).toEqual({
      id: "person",
      json: {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://example.com/about#person",
        url: "https://example.com/about",
        name: "Kevin Ellen",
        description:
          "Wildlife photographer and technical SEO specialist based in south-east England.",
        jobTitle: "Technical SEO Specialist",
        knowsAbout: [
          "Wildlife photography",
          "Technical SEO",
          "Structured data",
        ],
        knowsLanguage: ["en-GB", "nl-NL"],
        sameAs: [
          "https://github.com/Kevin-Ellen",
          "https://www.linkedin.com/in/kevinellen/",
        ],
        mainEntityOfPage: {
          "@id": "https://example.com/about#webpage",
        },
      },
    });

    expect(mockedResolveStructuredDataPageReferenceHref).toHaveBeenCalledTimes(
      2,
    );

    expect(
      mockedResolveStructuredDataPageReferenceHref,
    ).toHaveBeenNthCalledWith(1, appState, structuredData.id);

    expect(
      mockedResolveStructuredDataPageReferenceHref,
    ).toHaveBeenNthCalledWith(2, appState, structuredData.url);
  });
});
