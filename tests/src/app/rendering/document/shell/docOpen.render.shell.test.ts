// tests/src/app/rendering/document/shell/docOpen.render.shell.test.ts

import { createAppContext } from "@app/appContext/create.appContext";
import { createAppState } from "@app/appState/create.appState";
import { buildDocumentRenderContext } from "@app/rendering/document/build.context.document.render";
import { renderDocOpen } from "@app/rendering/document/shell/docOpen.render.shell";

import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

describe("renderDocOpen", () => {
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
          ...documentRenderContext.assets.header,
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

  it("omits header scripts when no header scripts exist", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const contextWithoutHeaderScripts: DocumentRenderContext = {
      ...documentRenderContext,
      assets: {
        ...documentRenderContext.assets,
        header: {
          ...documentRenderContext.assets.header,
          scripts: [],
        },
      },
    };

    const html = renderDocOpen(contextWithoutHeaderScripts);

    expect(html).not.toContain(
      `<script nonce="${documentRenderContext.security.nonce}">`,
    );
  });

  it("renders header scripts in deterministic order", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const contextWithHeaderScripts: DocumentRenderContext = {
      ...documentRenderContext,
      assets: {
        ...documentRenderContext.assets,
        header: {
          ...documentRenderContext.assets.header,
          scripts: [
            {
              id: "header-condense",
              kind: "inline",
              content: 'console.log("first");',
              location: "header",
            },
            {
              id: "header-condense",
              kind: "inline",
              content: 'console.log("second");',
              location: "header",
            },
          ],
        },
      },
    };

    const html = renderDocOpen(contextWithHeaderScripts);

    expect(html.indexOf('console.log("first");')).toBeLessThan(
      html.indexOf('console.log("second");'),
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

  it("escapes the page title", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const escapedContext: DocumentRenderContext = {
      ...documentRenderContext,
      metadata: {
        ...documentRenderContext.metadata,
        pageTitle: '<Dangerous & "quoted" title>',
      },
    };

    const html = renderDocOpen(escapedContext);

    expect(html).toContain(
      "<title>&lt;Dangerous &amp; &quot;quoted&quot; title&gt;</title>",
    );
  });

  it("escapes the meta description attribute", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const escapedContext: DocumentRenderContext = {
      ...documentRenderContext,
      metadata: {
        ...documentRenderContext.metadata,
        metaDescription: 'Description with "quotes" & <tags>',
      },
    };

    const html = renderDocOpen(escapedContext);

    expect(html).toContain(
      'meta name="description" content="Description with &quot;quotes&quot; &amp; &lt;tags&gt;"',
    );
  });

  it("escapes the canonical url attribute", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const escapedContext: DocumentRenderContext = {
      ...documentRenderContext,
      metadata: {
        ...documentRenderContext.metadata,
        canonicalUrl: 'https://kevinellen.com/?x="quoted"&y=<tag>',
      },
    };

    const html = renderDocOpen(escapedContext);

    expect(html).toContain(
      '<link rel="canonical" href="https://kevinellen.com/?x=&quot;quoted&quot;&amp;y=&lt;tag&gt;">',
    );
  });

  it("escapes the html lang attribute", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const escapedContext: DocumentRenderContext = {
      ...documentRenderContext,
      site: {
        ...documentRenderContext.site,
        language: 'en-GB" unsafe="true',
      },
    };

    const html = renderDocOpen(escapedContext);

    expect(html).toContain('<html lang="en-GB&quot; unsafe=&quot;true">');
  });

  it("escapes the nonce attribute on the inline style element", () => {
    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const documentRenderContext = createDocumentRenderContext(target);

    const escapedContext: DocumentRenderContext = {
      ...documentRenderContext,
      security: {
        ...documentRenderContext.security,
        nonce: 'unsafe"nonce',
      },
    };

    const html = renderDocOpen(escapedContext);

    expect(html).toContain('<style nonce="unsafe&quot;nonce">');
  });
});
