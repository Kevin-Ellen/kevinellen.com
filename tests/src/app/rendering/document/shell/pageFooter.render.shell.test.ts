// tests/src/app/rendering/document/shell/pageFooter.render.shell.test.ts;

import { createAppContext } from "@app/appContext/create.appContext";
import { createAppState } from "@app/appState/create.appState";
import { buildDocumentRenderContext } from "@app/rendering/document/build.context.document.render";
import { renderPageFooter } from "@app/rendering/document/shell/pageFooter.render.shell";

import type { DocumentRenderTarget } from "@app/request/request.document.types";

describe("renderPageFooter", () => {
  const appState = createAppState();

  const env = {
    APP_ENV: "prod",
    APP_HOST: "kevinellen.com",
  } as Env;

  const createHtml = (): string => {
    const req = new Request("https://example.com/");
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const appContext = createAppContext(req, env, appState, target);
    const documentRenderContext = buildDocumentRenderContext(appContext);

    return renderPageFooter(documentRenderContext);
  };

  it("renders the sr-only page footer heading", () => {
    const html = createHtml();

    expect(html).toContain('class="u-sr-only"');
    expect(html).toContain(">Page footer<");
  });

  it("renders footer navigation sections", () => {
    const html = createHtml();

    expect(html).toContain('class="l-footer__grid"');
    expect(html).toContain(">Site<");
    expect(html).toContain(">Practice<");
    expect(html).toContain(">Elsewhere<");
    expect(html).toContain('href="/journal"');
  });

  it("renders the conservation block", () => {
    const html = createHtml();

    expect(html).toContain('class="l-footer__conservation"');
    expect(html).toContain(">Conservation<");
    expect(html).toContain(
      "Supporting organisations that protect habitats, species, and access to nature.",
    );
  });

  it("renders conservation logos with intrinsic dimensions", () => {
    const html = createHtml();

    expect(html).toContain('<use href="#logo-rspb"></use>');
    expect(html).toContain('<use href="#logo-national-trust"></use>');
    expect(html).toContain(
      '<use href="#logo-vogelbescherming-nederland"></use>',
    );

    expect(html).toContain('width="81" height="81"');
    expect(html).toContain('width="48" height="48"');
    expect(html).toContain('width="829" height="392"');
  });

  it("renders footer meta", () => {
    const html = createHtml();

    expect(html).toContain('class="l-footer__meta"');
    expect(html).toContain("© 2026 Kevin Ellen");
  });
});
