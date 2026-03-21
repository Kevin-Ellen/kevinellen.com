// tests/src/app/rendering/renderer/document.renderer.test.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { renderDocument } from "@app/rendering/renderer/document.renderer";

import { renderDocHead } from "@app/rendering/renderer/parts/docHead/render.docHead";
import { renderPageHead } from "@app/rendering/renderer/parts/pageHead/render.pageHead";
import { renderBody } from "@app/rendering/renderer/parts/body/render.body";
import { renderPageFooter } from "@app/rendering/renderer/parts/pageFooter/render.pageFooter";
import { renderDocFooter } from "@app/rendering/renderer/parts/docFooter/render.docFooter";

jest.mock("@app/rendering/renderer/parts/docHead/render.docHead", () => ({
  renderDocHead: jest.fn(),
}));

jest.mock("@app/rendering/renderer/parts/pageHead/render.pageHead", () => ({
  renderPageHead: jest.fn(),
}));

jest.mock("@app/rendering/renderer/parts/body/render.body", () => ({
  renderBody: jest.fn(),
}));

jest.mock("@app/rendering/renderer/parts/pageFooter/render.pageFooter", () => ({
  renderPageFooter: jest.fn(),
}));

jest.mock("@app/rendering/renderer/parts/docFooter/render.docFooter", () => ({
  renderDocFooter: jest.fn(),
}));

describe("renderDocument", () => {
  const createDocumentRender = (): DocumentRenderContext => {
    return {
      security: {
        nonce: "test-nonce",
      },
      site: {
        language: "en-GB",
        siteName: "Kevin Ellen",
        siteUrl: "https://kevinellen.com",
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
      page: {
        id: "home",
        kind: "static",
        slug: "/",
        renderMode: "bundled",
      },
      seo: {
        pageTitle: "Home",
        metaDescription: "Homepage description",
        canonicalUrl: "https://kevinellen.com/",
      },
      pageHead: {
        navigation: {
          primary: [],
          social: [],
        },
        breadcrumbs: [],
      },
      pageFooter: {
        navigation: {
          sections: [],
        },
      },
      content: {
        head: {
          eyebrow: "Eyebrow",
          title: "Title",
          intro: "Intro",
        },
        body: [],
        footer: [],
      },
      assets: {
        scripts: [],
        svgs: [],
      },
      structuredData: [],
      robots: {
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (renderDocHead as jest.Mock).mockReturnValue("DOC_HEAD");
    (renderPageHead as jest.Mock).mockReturnValue("PAGE_HEAD");
    (renderBody as jest.Mock).mockReturnValue("BODY");
    (renderPageFooter as jest.Mock).mockReturnValue("PAGE_FOOTER");
    (renderDocFooter as jest.Mock).mockReturnValue("DOC_FOOTER");
  });

  it("renders all document parts in deterministic order", () => {
    const documentRender = createDocumentRender();

    const result = renderDocument(documentRender);

    expect(result).toBe("DOC_HEADPAGE_HEADBODYPAGE_FOOTERDOC_FOOTER");
  });

  it("passes the same document render context to every part", () => {
    const documentRender = createDocumentRender();

    renderDocument(documentRender);

    expect(renderDocHead).toHaveBeenCalledWith(documentRender);
    expect(renderPageHead).toHaveBeenCalledWith(documentRender);
    expect(renderBody).toHaveBeenCalledWith(documentRender);
    expect(renderPageFooter).toHaveBeenCalledWith(documentRender);
    expect(renderDocFooter).toHaveBeenCalledWith(documentRender);
  });

  it("calls each part exactly once", () => {
    const documentRender = createDocumentRender();

    renderDocument(documentRender);

    expect(renderDocHead).toHaveBeenCalledTimes(1);
    expect(renderPageHead).toHaveBeenCalledTimes(1);
    expect(renderBody).toHaveBeenCalledTimes(1);
    expect(renderPageFooter).toHaveBeenCalledTimes(1);
    expect(renderDocFooter).toHaveBeenCalledTimes(1);
  });
});
