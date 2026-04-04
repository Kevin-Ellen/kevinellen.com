// tests/src/app/rendering/document/shell/docEnd.render.shell.test.ts;

import { createAppContext } from "@app/appContext/create.appContext";
import { createAppState } from "@app/appState/create.appState";
import { buildDocumentRenderContext } from "@app/rendering/document/build.context.document.render";
import { renderDocClose } from "@app/rendering/document/shell/docClose.render.shell";

import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

describe("renderDocumentEnd", () => {
  const appState = createAppState();

  const env = {
    APP_ENV: "prod",
    APP_HOST: "kevinellen.com",
  } as Env;

  const createDocumentRenderContext = (): DocumentRenderContext => {
    const req = new Request("https://example.com/");
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const appContext = createAppContext(req, env, appState, target);

    return buildDocumentRenderContext(appContext);
  };

  it("renders structured data scripts", () => {
    const documentRenderContext = createDocumentRenderContext();

    const html = renderDocClose(documentRenderContext);

    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('"@type":"WebSite"');
  });

  it("renders footer scripts when present", () => {
    const documentRenderContext = createDocumentRenderContext();

    const documentRenderContextWithFooterScript: DocumentRenderContext = {
      ...documentRenderContext,
      assets: {
        ...documentRenderContext.assets,
        footer: {
          ...documentRenderContext.assets.footer,
          scripts: [
            {
              id: "header-condense",
              kind: "inline",
              content: 'console.log("footer");',
              location: "footer",
            },
          ],
        },
      },
    };

    const html = renderDocClose(documentRenderContextWithFooterScript);

    expect(html).toContain(
      `<script nonce="${documentRenderContext.security.nonce}">console.log("footer");</script>`,
    );
  });

  it("renders the svg sprite container", () => {
    const documentRenderContext = createDocumentRenderContext();

    const html = renderDocClose(documentRenderContext);

    expect(html).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(html).toContain('<symbol id="icon-home"');
    expect(html).toContain('<symbol id="logo-rspb"');
  });

  it("closes the document", () => {
    const documentRenderContext = createDocumentRenderContext();

    const html = renderDocClose(documentRenderContext);

    expect(html).toContain("</body>");
    expect(html).toContain("</html>");
  });
});
