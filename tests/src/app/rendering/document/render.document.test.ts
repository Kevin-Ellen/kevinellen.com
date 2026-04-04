// tests/src/app/rendering/document/render.document.test.ts

import { createAppContext } from "@app/appContext/create.appContext";
import { createAppState } from "@app/appState/create.appState";
import { buildDocumentRenderContext } from "@app/rendering/document/build.context.document.render";
import { renderDocument } from "@app/rendering/document/render.document";

import type { DocumentRenderTarget } from "@app/request/request.document.types";

describe("renderDocument", () => {
  const appState = createAppState();

  const env = {
    APP_ENV: "prod",
    APP_HOST: "kevinellen.com",
  } as Env;

  const createHtml = (target: DocumentRenderTarget): string => {
    const req = new Request("https://example.com/");
    const appContext = createAppContext(req, env, appState, target);
    const documentRenderContext = buildDocumentRenderContext(appContext);

    return renderDocument(documentRenderContext);
  };

  it("renders a complete document for a public page", () => {
    const html = createHtml({
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    });

    expect(html).toContain("<!doctype html>");
    expect(html).toContain('<html lang="en-GB">');
    expect(html).toContain("<head>");
    expect(html).toContain("<body");
    expect(html).toContain("</body>");
    expect(html).toContain("</html>");
  });

  it("includes the document shell, page shell and page content", () => {
    const html = createHtml({
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    });

    expect(html).toContain("<title>Kevin Ellen</title>");
    expect(html).toContain('class="l-header"');
    expect(html).toContain("<main>");
    expect(html).toContain(
      "Nature photography, writing, and technical architecture",
    );
    expect(html).toContain("Homepage placeholder body content.");
    expect(html).toContain('class="l-footer"');
  });

  it("includes canonical, structured data and svg sprite output", () => {
    const html = createHtml({
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    });

    expect(html).toContain(
      '<link rel="canonical" href="https://kevinellen.com/">',
    );
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('"@type":"WebSite"');
    expect(html).toContain('<symbol id="icon-home"');
  });

  it("renders an error page document without a canonical link", () => {
    const html = createHtml({
      kind: "error-page",
      page: appState.getErrorPageByStatus(404)!,
      status: 404,
    });

    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Page not found");
    expect(html).not.toContain('<link rel="canonical"');
  });
});
