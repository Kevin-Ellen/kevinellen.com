// tests/src/app/rendering/document/shell/pageHeader.render.shell.test.ts

import { createAppContext } from "@app/appContext/create.appContext";
import { createAppState } from "@app/appState/create.appState";
import { buildDocumentRenderContext } from "@app/rendering/document/build.context.document.render";
import { renderPageHeader } from "@app/rendering/document/shell/pageHeader.render.shell";

import type { DocumentRenderTarget } from "@app/request/request.document.types";

describe("renderPageHeader", () => {
  const appState = createAppState();

  const env = {
    APP_ENV: "prod",
    APP_HOST: "kevinellen.com",
  } as Env;

  const createHtml = (target: DocumentRenderTarget): string => {
    const req = new Request("https://example.com/");
    const appContext = createAppContext(req, env, appState, target);
    const documentRenderContext = buildDocumentRenderContext(appContext);

    return renderPageHeader(documentRenderContext);
  };

  it("renders the primary navigation", () => {
    const html = createHtml({
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    });

    expect(html).toContain('class="l-header__primary"');
    expect(html).toContain('href="/"');
    expect(html).toMatch(/>\s*Journal\s*</);
  });

  it("renders the home icon via svg use", () => {
    const html = createHtml({
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    });

    expect(html).toContain('<use href="#icon-home"></use>');
  });

  it("renders the social navigation icons", () => {
    const html = createHtml({
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    });

    expect(html).toContain('<use href="#icon-github"></use>');
    expect(html).toContain('<use href="#icon-instagram"></use>');
  });

  it("renders breadcrumbs in the header", () => {
    const html = createHtml({
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    });

    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toMatch(/>\s*Home\s*</);
  });

  it("marks the current page in primary navigation", () => {
    const html = createHtml({
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    });

    expect(html).toContain('aria-current="page"');
  });

  it("renders the header sentinel", () => {
    const html = createHtml({
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    });

    expect(html).toContain('class="l-header-sentinel"');
    expect(html).toContain('aria-hidden="true"');
  });
});
