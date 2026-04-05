// tests/src/app/rendering/document/build.content.document.render.test.ts

import { createAppContext } from "@app/appContext/create.appContext";
import { createAppState } from "@app/appState/create.appState";
import { buildDocumentRenderContext } from "@app/rendering/document/build.context.document.render";

import type { DocumentRenderTarget } from "@app/request/request.document.types";

describe("buildDocumentRenderContext", () => {
  const appState = createAppState();

  const env = {
    APP_ENV: "prod",
    APP_HOST: "kevinellen.com",
  } as Env;

  const req = new Request("https://example.com/");

  const target: DocumentRenderTarget = {
    kind: "page",
    page: appState.getPublicPageById("home")!,
    status: 200,
  };

  const appContext = createAppContext(req, env, appState, target);

  const result = buildDocumentRenderContext(appContext);

  it("maps security nonce", () => {
    expect(result.security.nonce).toEqual(expect.any(String));
    expect(result.security.nonce.length).toBeGreaterThan(0);
  });

  it("maps site config correctly", () => {
    expect(result.site).toEqual({
      language: "en-GB",
      siteName: "Kevin Ellen",
      siteUrl: "https://kevinellen.com",
    });
  });

  it("maps metadata fields correctly", () => {
    expect(result.metadata.pageTitle).toBe("Kevin Ellen");
    expect(result.metadata.metaDescription).toContain("Nature photography");
    expect(result.metadata.canonicalUrl).toBe("https://kevinellen.com/");
  });

  it("maps page header branding", () => {
    expect(result.pageHeader.branding).toEqual({
      href: "/",
      ariaLabel: "Kevin Ellen home",
      logo: {
        id: "logo-monogram-ke",
        width: expect.any(Number),
        height: expect.any(Number),
        className: "l-header__brand-logo",
      },
    });
  });

  it("maps page header breadcrumbs correctly", () => {
    expect(result.pageHeader.breadcrumbs).toEqual([
      {
        id: "home",
        label: "Home",
        href: "/",
      },
    ]);
  });

  it("passes resolved content through", () => {
    expect(result.content.head.title).toContain("Nature photography");
    expect(result.content.body.length).toBeGreaterThan(0);

    const firstParagraph = result.content.body[0];

    expect(firstParagraph).toBeDefined();
    expect(firstParagraph?.kind).toBe("paragraph");
    expect(firstParagraph?.inlines.length).toBeGreaterThan(0);

    const firstInline = firstParagraph?.inlines[0];

    expect(firstInline).toBeDefined();
    expect(firstInline?.kind).toBe("text");
  });

  it("maps page footer navigation", () => {
    expect(result.pageFooter.navigation.sections).toEqual([
      {
        id: "site",
        label: "Site",
        items: [
          {
            label: "Journal",
            href: "/journal",
          },
        ],
      },
      {
        id: "practice",
        label: "Practice",
        items: [],
      },
      {
        id: "elsewhere",
        label: "Elsewhere",
        items: [
          {
            label: "GitHub",
            href: "https://github.com/Kevin-Ellen",
          },
          {
            label: "Instagram",
            href: "https://www.instagram.com/photography.mallard",
          },
          {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/kevinellen/",
          },
        ],
      },
      {
        id: "legal",
        label: "Legal",
        items: [],
      },
    ]);
  });

  it("maps page footer conservation block", () => {
    expect(result.pageFooter.conservation.heading).toBe("Conservation");
    expect(result.pageFooter.conservation.intro).toContain(
      "Supporting organisations",
    );
    expect(result.pageFooter.conservation.organisations).toEqual([
      expect.objectContaining({
        id: "rspb",
        label: "RSPB",
        href: "https://www.rspb.org.uk/",
        svgId: "logo-rspb",
        width: expect.any(Number),
        height: expect.any(Number),
      }),
      expect.objectContaining({
        id: "national-trust",
        label: "National Trust",
        href: "https://www.nationaltrust.org.uk/",
        svgId: "logo-national-trust",
        width: expect.any(Number),
        height: expect.any(Number),
      }),
      expect.objectContaining({
        id: "vogelbescherming-nederland",
        label: "Vogelbescherming Nederland",
        href: "https://www.vogelbescherming.nl/",
        svgId: "logo-vogelbescherming-nederland",
        width: expect.any(Number),
        height: expect.any(Number),
      }),
    ]);
  });

  it("maps page footer meta", () => {
    expect(result.pageFooter.meta).toEqual({
      screenReaderHeading: "Page footer",
      copyright: "© 2026 Kevin Ellen",
    });
  });

  it("maps structured data", () => {
    expect(result.structuredData).toEqual(appContext.getStructuredData());
  });

  it("buckets assets into header and footer groups", () => {
    expect(
      result.assets.header.scripts.every(
        (script) => script.location === "header",
      ),
    ).toBe(true);
    expect(
      result.assets.footer.scripts.every(
        (script) => script.location === "footer",
      ),
    ).toBe(true);
    expect(result.assets.footer.svgs).toEqual(expect.any(Array));
  });
});
