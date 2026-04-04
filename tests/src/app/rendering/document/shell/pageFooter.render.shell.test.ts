// tests/src/app/rendering/document/shell/pageFooter.render.shell.test.ts

import { createAppContext } from "@app/appContext/create.appContext";
import { createAppState } from "@app/appState/create.appState";
import { buildDocumentRenderContext } from "@app/rendering/document/build.context.document.render";
import { renderPageFooter } from "@app/rendering/document/shell/pageFooter.render.shell";

import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

describe("renderPageFooter", () => {
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

  const createHtml = (override?: DocumentRenderContext): string => {
    const documentRenderContext = override ?? createDocumentRenderContext();

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

  it("renders footer navigation sections in deterministic order", () => {
    const html = createHtml();

    expect(html.indexOf(">Site<")).toBeLessThan(html.indexOf(">Practice<"));
    expect(html.indexOf(">Practice<")).toBeLessThan(
      html.indexOf(">Elsewhere<"),
    );
    expect(html.indexOf(">Elsewhere<")).toBeLessThan(html.indexOf(">Legal<"));
  });

  it("renders footer navigation items in deterministic order", () => {
    const html = createHtml();

    expect(html.indexOf(">GitHub<")).toBeLessThan(html.indexOf(">Instagram<"));
    expect(html.indexOf(">Instagram<")).toBeLessThan(
      html.indexOf(">LinkedIn<"),
    );
  });

  it("escapes footer navigation labels and hrefs", () => {
    const documentRenderContext = createDocumentRenderContext();

    const escapedContext: DocumentRenderContext = {
      ...documentRenderContext,
      pageFooter: {
        ...documentRenderContext.pageFooter,
        navigation: {
          ...documentRenderContext.pageFooter.navigation,
          sections: [
            {
              id: 'test"section',
              label: 'Test & <unsafe> "label"',
              items: [
                {
                  href: '/test?x="quoted"&y=<tag>',
                  label: 'Link & <unsafe> "label"',
                },
              ],
            },
          ],
        },
      },
    };

    const html = createHtml(escapedContext);

    expect(html).toContain(
      'class="l-footer__group l-footer__group--test&quot;section"',
    );
    expect(html).toContain(">Test &amp; &lt;unsafe&gt; &quot;label&quot;<");
    expect(html).toContain(
      'href="/test?x=&quot;quoted&quot;&amp;y=&lt;tag&gt;"',
    );
    expect(html).toContain(">Link &amp; &lt;unsafe&gt; &quot;label&quot;<");
  });

  it("renders an empty footer section list when a section has no items", () => {
    const html = createHtml();

    expect(html).toContain(
      `<section class="l-footer__group l-footer__group--practice">`,
    );
    expect(html).toContain('<ul class="l-footer__list">');
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

  it("escapes conservation organisation labels and hrefs", () => {
    const documentRenderContext = createDocumentRenderContext();

    const escapedContext: DocumentRenderContext = {
      ...documentRenderContext,
      pageFooter: {
        ...documentRenderContext.pageFooter,
        conservation: {
          ...documentRenderContext.pageFooter.conservation,
          organisations: [
            {
              id: "rspb",
              href: 'https://example.com/?x="quoted"&y=<tag>',
              label: 'Org & <unsafe> "label"',
              svgId: "logo-rspb",
              iconClassName: 'icon"unsafe',
              width: 81,
              height: 81,
            },
          ],
        },
      },
    };

    const html = createHtml(escapedContext);

    expect(html).toContain(
      'href="https://example.com/?x=&quot;quoted&quot;&amp;y=&lt;tag&gt;"',
    );
    expect(html).toContain(
      'aria-label="Org &amp; &lt;unsafe&gt; &quot;label&quot;"',
    );
    expect(html).toContain('class="icon&quot;unsafe"');
  });

  it("renders an empty conservation logos list when no organisations exist", () => {
    const documentRenderContext = createDocumentRenderContext();

    const contextWithoutOrganisations: DocumentRenderContext = {
      ...documentRenderContext,
      pageFooter: {
        ...documentRenderContext.pageFooter,
        conservation: {
          ...documentRenderContext.pageFooter.conservation,
          organisations: [],
        },
      },
    };

    const html = createHtml(contextWithoutOrganisations);

    expect(html).toContain(
      '<ul class="l-footer__logos" aria-label="Supported organisations">',
    );
    expect(html).not.toContain('<use href="#logo-rspb"></use>');
  });

  it("renders footer meta", () => {
    const html = createHtml();

    expect(html).toContain('class="l-footer__meta"');
    expect(html).toContain("© 2026 Kevin Ellen");
  });

  it("escapes footer meta content", () => {
    const documentRenderContext = createDocumentRenderContext();

    const escapedContext: DocumentRenderContext = {
      ...documentRenderContext,
      pageFooter: {
        ...documentRenderContext.pageFooter,
        meta: {
          ...documentRenderContext.pageFooter.meta,
          screenReaderHeading: 'Footer & <unsafe> "heading"',
          copyright: '© 2026 Kevin & <unsafe> "Ellen"',
        },
      },
    };

    const html = createHtml(escapedContext);

    expect(html).toContain(">Footer &amp; &lt;unsafe&gt; &quot;heading&quot;<");
    expect(html).toContain(
      "© 2026 Kevin &amp; &lt;unsafe&gt; &quot;Ellen&quot;",
    );
  });
});
