// tests/src/app/rendering/document/canonical/build.canonical.document.rendering.test.ts

import { buildCanonicalUrl } from "@app/rendering/document/canonical/build.canonical.document.rendering";
import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";

const createAppState = (siteUrl: string): AppState =>
  ({
    siteConfig: {
      language: "en-GB",
      siteName: "Kevin Ellen",
      siteUrl,
      socialMedia: {
        gitHub: {
          id: "gitHub",
          label: "GitHub",
          href: "https://github.com/Kevin-Ellen",
          iconId: "icon-github",
        },
        instagram: {
          id: "instagram",
          label: "Instagram",
          href: "https://www.instagram.com/photography.mallard",
          iconId: "icon-instagram",
        },
        linkedIn: {
          id: "linkedIn",
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/kevinellen/",
          iconId: "icon-linkedin",
        },
      },
    },
  }) as unknown as AppState;

const createPage = (slug: string): PageDefinition =>
  ({
    core: {
      id: "test-page",
      kind: "static",
      label: "Test Page",
      slug,
      renderMode: "bundled",
    },
  }) as PageDefinition;

describe("buildCanonicalUrl", () => {
  it("returns the canonical root URL for the home page", () => {
    const appState = createAppState("https://kevinellen.com");
    const page = createPage("/");

    const result = buildCanonicalUrl(appState, page);

    expect(result).toBe("https://kevinellen.com/");
  });

  it("returns an absolute canonical URL for a nested page", () => {
    const appState = createAppState("https://kevinellen.com");
    const page = createPage("/about");

    const result = buildCanonicalUrl(appState, page);

    expect(result).toBe("https://kevinellen.com/about");
  });

  it("returns an absolute canonical URL for a deeper nested page", () => {
    const appState = createAppState("https://kevinellen.com");
    const page = createPage("/journal/first-entry");

    const result = buildCanonicalUrl(appState, page);

    expect(result).toBe("https://kevinellen.com/journal/first-entry");
  });

  it("handles a site URL with a trailing slash", () => {
    const appState = createAppState("https://kevinellen.com/");
    const page = createPage("/about");

    const result = buildCanonicalUrl(appState, page);

    expect(result).toBe("https://kevinellen.com/about");
  });

  it("uses the page slug as the canonical path source", () => {
    const appState = createAppState("https://kevinellen.com/base/");
    const page = createPage("/contact");

    const result = buildCanonicalUrl(appState, page);

    expect(result).toBe("https://kevinellen.com/contact");
  });
});
