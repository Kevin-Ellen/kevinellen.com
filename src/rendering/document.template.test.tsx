// src/rendering/document.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

import { DocumentTemplate } from "@rendering/document.template";

describe("DocumentTemplate", () => {
  it("renders the full document structure", () => {
    const appRenderContext = {
      docOpen: {
        language: "en-GB",
        nonce: "abc123",
        canonicalUrl: null,
        themeColour: "#1f2621",

        metadata: {
          pageTitle: "Kevin Ellen",
          metaDescription: "Personal portfolio.",
        },

        preload: [],
        links: [],
        linkScripts: [],
        inlineScripts: [],
      },

      bodyHeader: {
        branding: {
          href: "/",
          ariaLabel: "Kevin Ellen home",
          logo: {
            id: "logo-monogram-ke",
            width: 48,
            height: 48,
          },
        },

        navigation: {
          primary: [],
          social: [],
        },

        breadcrumbs: {
          items: [],
          current: "Home",
        },
      },

      bodyContent: {
        header: {
          title: "Wildlife Journal",
          eyebrow: "Field Notes",
          intro: "Observations from the marsh.",
          showInBody: true,
        },

        content: [],

        footer: [],
      },

      bodyFooter: {
        nav: {
          sections: [],
        },

        affiliations: {
          items: [],
        },

        colophon: {
          items: [],
        },
      },

      docClose: {
        structuredData: [],
        inlineScripts: [],
        linkScripts: [],
        svg: [],
      },
    } as unknown as AppRenderContext;

    const html = renderToStaticMarkup(
      <DocumentTemplate appRenderContext={appRenderContext} />,
    );

    expect(html).toContain('<html lang="en-GB">');
    expect(html).toContain("<head>");
    expect(html).toContain("<body>");
    expect(html).toContain('class="l-header"');
    expect(html).toContain('class="l-main"');
    expect(html).toContain('class="l-footer"');
    expect(html).toContain("</html>");
  });
});
