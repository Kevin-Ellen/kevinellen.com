// tests/src/app/appContext/resolvers/structured-data.resolve.appContext.test.ts

import { resolveStructuredDataAppContext } from "@app/appContext/resolvers/structured-data.resolve.appContext";
import { createAppState } from "@app/appState/create.appState";

import type { DocumentRenderTarget } from "@app/request/request.document.types";

describe("resolveStructuredDataAppContext", () => {
  const appState = createAppState();

  it("resolves person structured data from app state config", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const result = resolveStructuredDataAppContext(appState, target);

    expect(result.person).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://kevinellen.com/about#person",
      url: "https://kevinellen.com/about",
      name: "Kevin Ellen",
      jobTitle: "Technical SEO Manager",
      description: "Hello world",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Essex",
        addressCountry: "GB",
      },
      knowsAbout: [
        "Wildlife photography",
        "Nature photography",
        "Bird photography",
        "Technical SEO",
        "Web performance",
        "Web architecture",
        "Cloudflare Workers",
        "Search engine optimisation",
        "Digital publishing",
      ],
    });
  });

  it("resolves website structured data from app state config", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const result = resolveStructuredDataAppContext(appState, target);

    expect(result.website).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://kevinellen.com/#website",
      url: "https://kevinellen.com/",
      name: "Kevin Ellen",
      description:
        "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
      inLanguage: "en-GB",
      publisher: {
        "@id": "https://kevinellen.com/about#person",
      },
    });
  });

  it("returns page structured data for a public page", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const result = resolveStructuredDataAppContext(appState, target);

    expect(result.page).toEqual([]);
  });

  it("returns null page structured data for an error page", () => {
    const target: DocumentRenderTarget = {
      kind: "error-page",
      page: appState.getErrorPageByStatus(404)!,
      status: 404,
    };

    const result = resolveStructuredDataAppContext(appState, target);

    expect(result.page).toBeNull();
  });
});
