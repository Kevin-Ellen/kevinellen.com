// tests/src/app/rendering/renderer/parts/docFooter/render.docFooter.test.ts

import { renderDocFooter } from "@app/rendering/renderer/parts/docFooter/render.docFooter";
import { createDocumentRenderContext } from "@tests/src/app/rendering/renderer/render.test.fixtures";

describe("renderDocFooter", () => {
  it("renders svg symbols from asset definitions", () => {
    const ctx = createDocumentRenderContext({
      assets: {
        scripts: [],
        svgs: [
          {
            id: "icon-home",
            viewBox: "0 0 24 24",
            content: "<path d='M1 1' />",
          },
          {
            id: "icon-github",
            viewBox: "0 0 48 48",
            content: "<path d='M2 2' />",
          },
        ],
      },
    });

    const html = renderDocFooter(ctx);

    expect(html).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(html).toContain(
      '<symbol id="icon-home" viewBox="0 0 24 24" fill="currentColor">',
    );
    expect(html).toContain(
      '<symbol id="icon-github" viewBox="0 0 48 48" fill="currentColor">',
    );
    expect(html).toContain("<path d='M1 1' />");
    expect(html).toContain("<path d='M2 2' />");
  });

  it("renders only footer scripts", () => {
    const ctx = createDocumentRenderContext({
      security: {
        nonce: "footer-nonce",
      },
      assets: {
        scripts: [
          {
            id: "head-script",
            kind: "external",
            src: "/static/head.js",
            location: "head",
          },
          {
            id: "footer-script",
            kind: "inline",
            content: "console.log('footer');",
            location: "footer",
          },
        ],
        svgs: [],
      },
    });

    const html = renderDocFooter(ctx);

    expect(html).toContain("console.log('footer');");
    expect(html).toContain('nonce="footer-nonce"');
    expect(html).not.toContain("/static/head.js");
  });

  it("preserves deterministic svg order", () => {
    const ctx = createDocumentRenderContext({
      assets: {
        scripts: [],
        svgs: [
          {
            id: "first",
            viewBox: "0 0 24 24",
            content: "<path d='1' />",
          },
          {
            id: "second",
            viewBox: "0 0 24 24",
            content: "<path d='2' />",
          },
        ],
      },
    });

    const html = renderDocFooter(ctx);

    expect(html.indexOf('id="first"')).toBeLessThan(
      html.indexOf('id="second"'),
    );
  });

  it("closes body and html", () => {
    const ctx = createDocumentRenderContext();

    const html = renderDocFooter(ctx);

    expect(html).toContain("</body>");
    expect(html).toContain("</html>");
  });
});
