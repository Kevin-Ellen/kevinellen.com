// tests/src/app/rendering/document/shell/documentStart.render.shell.test.ts;

import { createAppContext } from "@app/appContext/create.appContext";
import { createAppState } from "@app/appState/create.appState";
import { buildDocumentRenderContext } from "@app/rendering/document/build.context.document.render";
import { renderDocOpen } from "@app/rendering/document/shell/docOpen.render.shell";

import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

describe("renderDocumentStart", () => {
  const appState = createAppState();

  const env = {
    APP_ENV: "prod",
    APP_HOST: "kevinellen.com",
  } as Env;

  const createDocumentRenderContext = (
    target: DocumentRenderTarget,
  ): DocumentRenderContext => {
    const req = new Request("https://example.com/");
    const appContext = createAppContext(req, env, appState, target);

    return buildDocumentRenderContext(appContext);
  };

  it("renders the opening document shell with metadata and body start", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const html = renderDocOpen(documentRenderContext);

    expect(html).toContain("<!doctype html>");
    expect(html).toContain('<html lang="en-GB">');
    expect(html).toContain("<head>");
    expect(html).toContain("<body");
    expect(html).toContain('class="l-page"');

    expect(html).toContain("<title>Kevin Ellen</title>");
    expect(html).toContain(
      'meta name="description" content="Nature photography, field notes, journal writing, and technical architecture."',
    );
    expect(html).toContain(
      '<link rel="canonical" href="https://kevinellen.com/">',
    );
  });

  it("adds the nonce to the inline style element", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const html = renderDocOpen(documentRenderContext);

    expect(html).toContain(
      `<style nonce="${documentRenderContext.security.nonce}">`,
    );
  });

  it("renders header scripts when present", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const documentRenderContextWithHeaderScript: DocumentRenderContext = {
      ...documentRenderContext,
      assets: {
        ...documentRenderContext.assets,
        header: {
          scripts: [
            {
              id: "header-condense",
              kind: "inline",
              content: 'console.log("header");',
              location: "header",
            },
          ],
        },
      },
    };

    const html = renderDocOpen(documentRenderContextWithHeaderScript);

    expect(html).toContain(
      `<script nonce="${documentRenderContext.security.nonce}">console.log("header");</script>`,
    );
  });

  it("omits canonical link when canonical url is null", () => {
    const target: DocumentRenderTarget = {
      kind: "error-page",
      page: appState.getErrorPageByStatus(404)!,
      status: 404,
    };

    const req = new Request("https://example.com/missing");
    const appContext = createAppContext(req, env, appState, target);
    const documentRenderContext = buildDocumentRenderContext(appContext);

    const html = renderDocOpen(documentRenderContext);

    expect(html).not.toContain('<link rel="canonical"');
  });
});
