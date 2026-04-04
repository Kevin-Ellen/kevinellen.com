// tests/src/app/rendering/document/shell/pageHeader.render.shell.test.ts

import { createAppContext } from "@app/appContext/create.appContext";
import { createAppState } from "@app/appState/create.appState";
import { buildDocumentRenderContext } from "@app/rendering/document/build.context.document.render";
import { renderPageHeader } from "@app/rendering/document/shell/pageHeader.render.shell";

import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

describe("renderPageHeader", () => {
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

  const createHtml = (
    target: DocumentRenderTarget,
    override?: DocumentRenderContext,
  ): string => {
    const documentRenderContext =
      override ?? createDocumentRenderContext(target);

    return renderPageHeader(documentRenderContext);
  };

  it("renders the primary navigation", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const html = createHtml(target);

    expect(html).toContain('class="l-header__primary"');
    expect(html).toContain('href="/"');
    expect(html).toMatch(/>\s*Journal\s*</);
  });

  it("renders primary navigation items in deterministic order", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const html = createHtml(target);

    expect(html.indexOf('href="/"')).toBeLessThan(
      html.indexOf('href="/journal"'),
    );
  });

  it("renders the home icon via svg use", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const html = createHtml(target);

    expect(html).toContain('<use href="#icon-home"></use>');
  });

  it("renders the home link with an aria-label when using the icon", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const html = createHtml(target);

    expect(html).toContain('href="/" aria-current="page" aria-label="Home"');
  });

  it("renders the social navigation icons", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const html = createHtml(target);

    expect(html).toContain('<use href="#icon-github"></use>');
    expect(html).toContain('<use href="#icon-instagram"></use>');
  });

  it("renders social navigation items in deterministic order", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const html = createHtml(target);

    expect(html.indexOf('href="https://github.com/Kevin-Ellen"')).toBeLessThan(
      html.indexOf('href="https://www.instagram.com/photography.mallard"'),
    );
  });

  it("omits the social navigation block when there are no social items", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const contextWithoutSocialNav: DocumentRenderContext = {
      ...documentRenderContext,
      navigation: {
        ...documentRenderContext.navigation,
        header: {
          ...documentRenderContext.navigation.header,
          social: [],
        },
      },
    };

    const html = createHtml(target, contextWithoutSocialNav);

    expect(html).not.toContain('class="l-header__social"');
    expect(html).not.toContain("l-header__list--social");
  });

  it("renders breadcrumbs in the header", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const html = createHtml(target);

    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toMatch(/>\s*Home\s*</);
  });

  it("omits breadcrumbs when no breadcrumb items exist", () => {
    const target: DocumentRenderTarget = {
      kind: "error-page",
      page: appState.getErrorPageByStatus(404)!,
      status: 404,
    };

    const html = createHtml(target);

    expect(html).not.toContain('aria-label="Breadcrumb"');
    expect(html).not.toContain('class="l-header__breadcrumb"');
  });

  it("marks only the last breadcrumb item as the current page", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const contextWithBreadcrumbs: DocumentRenderContext = {
      ...documentRenderContext,
      breadcrumbs: [
        {
          id: "home",
          label: "Home",
          href: "/",
        },
        {
          id: "journal",
          label: "Journal",
          href: "/journal",
        },
      ],
    };

    const html = createHtml(target, contextWithBreadcrumbs);

    expect(html).toContain(
      '<a class="l-header__breadcrumb-link" href="/">Home</a>',
    );
    expect(html).toContain(
      '<li class="l-header__breadcrumb-item" aria-current="page">',
    );
    expect(html).toMatch(/aria-current="page"[\s\S]*Journal/);
  });

  it("marks the current page in primary navigation", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const html = createHtml(target);

    expect(html).toContain('aria-current="page"');
  });

  it("escapes primary navigation labels and hrefs", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const escapedContext: DocumentRenderContext = {
      ...documentRenderContext,
      navigation: {
        ...documentRenderContext.navigation,
        header: {
          ...documentRenderContext.navigation.header,
          primary: [
            {
              kind: "external",
              label: 'Primary & <unsafe> "label"',
              href: '/test?x="quoted"&y=<tag>',
              isCurrent: false,
            },
          ],
        },
      },
    };

    const html = createHtml(target, escapedContext);

    expect(html).toContain(
      'href="/test?x=&quot;quoted&quot;&amp;y=&lt;tag&gt;"',
    );
    expect(html).toMatch(
      />\s*Primary &amp; &lt;unsafe&gt; &quot;label&quot;\s*</,
    );
  });

  it("escapes social navigation labels and hrefs", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const escapedContext: DocumentRenderContext = {
      ...documentRenderContext,
      navigation: {
        ...documentRenderContext.navigation,
        header: {
          ...documentRenderContext.navigation.header,
          social: [
            {
              kind: "external",
              label: 'Social & <unsafe> "label"',
              href: 'https://example.com/?x="quoted"&y=<tag>',
              isCurrent: false,
            },
          ],
        },
      },
    };

    const html = createHtml(target, escapedContext);

    expect(html).toContain(
      'href="https://example.com/?x=&quot;quoted&quot;&amp;y=&lt;tag&gt;"',
    );
    expect(html).toContain(
      'aria-label="Social &amp; &lt;unsafe&gt; &quot;label&quot;"',
    );
    expect(html).toContain(
      '<span class="l-header__label">Social &amp; &lt;unsafe&gt; &quot;label&quot;</span>',
    );
  });

  it("escapes breadcrumb labels and hrefs", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const escapedContext: DocumentRenderContext = {
      ...documentRenderContext,
      breadcrumbs: [
        {
          id: "crumb",
          label: 'Crumb & <unsafe> "label"',
          href: '/crumb?x="quoted"&y=<tag>',
        },
        {
          id: "crumb",
          label: 'Current & <unsafe> "label"',
          href: "/current",
        },
      ],
    };

    const html = createHtml(target, escapedContext);

    expect(html).toContain(
      'href="/crumb?x=&quot;quoted&quot;&amp;y=&lt;tag&gt;"',
    );
    expect(html).toContain(">Crumb &amp; &lt;unsafe&gt; &quot;label&quot;<");
    expect(html).toContain("Current &amp; &lt;unsafe&gt; &quot;label&quot;");
  });

  it("renders social icon svgs as aria-hidden when no explicit label is passed to the svg", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const html = createHtml(target);

    expect(html).toContain('<svg class="l-header__icon" aria-hidden="true"');
  });

  it("renders the header sentinel", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const html = createHtml(target);

    expect(html).toContain('class="l-header-sentinel"');
    expect(html).toContain('aria-hidden="true"');
  });
});
