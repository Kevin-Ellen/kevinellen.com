// src/app/life-cycle/app-render/document/end/end.document.app-render.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import { DocumentEnd } from "./end.document.app-render";

type Props = Parameters<typeof DocumentEnd>[0];
type End = Props["end"];
type Metadata = Props["metadata"];

type Script = End["scripts"][number];
type InlineScript = Extract<Script, { kind: "inline" }>;
type StandaloneScript = Extract<Script, { kind: "standalone" }>;
type SvgSymbol = End["svg"][number];

describe("DocumentEnd", () => {
  const createMetadata = (): Metadata =>
    ({
      nonce: "test-nonce",
    }) as Metadata;

  // Script location is resolved before AppRender.
  // DocumentEnd does not inspect this property.
  const inlineLocation = "body" as InlineScript["location"];
  const standaloneLocation = "body" as StandaloneScript["location"];

  const createInlineScript = (
    content = "window.initialised = true;",
  ): InlineScript => ({
    kind: "inline",
    id: "header-headroom",
    content,
    location: inlineLocation,
    loading: null,
    scriptType: "module",
  });

  const createStandaloneScript = (
    loading: "async" | "defer",
  ): StandaloneScript => ({
    kind: "standalone",
    id: "header-headroom",
    src: "/assets/application.js",
    location: standaloneLocation,
    scriptType: "module",
    loading,
  });

  const createSymbol = (id = "icon-camera"): SvgSymbol =>
    ({
      id,
      viewBox: "0 0 24 24",
      content: '<path d="M2 2h20v20H2z"/>',
    }) as SvgSymbol;

  const createEnd = (overrides: Partial<End> = {}): End => ({
    scripts: [],
    svg: [],
    ...overrides,
  });

  const renderEnd = (
    end: End = createEnd(),
    metadata: Metadata = createMetadata(),
  ): string =>
    renderToStaticMarkup(<DocumentEnd end={end} metadata={metadata} />);

  describe("Scripts", () => {
    it("renders no scripts when the collection is empty", () => {
      const html = renderEnd();

      expect(html).not.toContain("<script");
    });

    it("renders inline JavaScript with the CSP nonce", () => {
      const html = renderEnd(
        createEnd({
          scripts: [createInlineScript()],
        }),
      );

      expect(html).toContain("<script");
      expect(html).toContain('nonce="test-nonce"');
      expect(html).toContain("window.initialised = true;");
    });

    it("preserves the inline script type", () => {
      const html = renderEnd(
        createEnd({
          scripts: [createInlineScript()],
        }),
      );

      expect(html).toContain('type="module"');
    });

    it("does not render a src attribute for inline scripts", () => {
      const html = renderEnd(
        createEnd({
          scripts: [createInlineScript()],
        }),
      );

      expect(html).not.toContain('src="/assets/application.js"');
    });

    it("escapes closing script tags regardless of case", () => {
      const html = renderEnd(
        createEnd({
          scripts: [
            createInlineScript(
              'const text = "</script><SCRIPT>alert(1)</SCRIPT>";',
            ),
          ],
        }),
      );

      expect(html).not.toContain("</script><SCRIPT>alert(1)</SCRIPT>");

      expect(html).toContain("<\\/script>");
      expect(html).not.toContain("</SCRIPT>");
    });

    it("escapes multiple closing script tags", () => {
      const html = renderEnd(
        createEnd({
          scripts: [
            createInlineScript(
              'const first = "</script>"; const second = "</script>";',
            ),
          ],
        }),
      );

      const escaped = html.match(/<\\\/script>/g);

      expect(escaped).toHaveLength(2);
    });

    it("preserves ordinary JavaScript content", () => {
      const content = 'window.config = { enabled: true, message: "Hello" };';

      const html = renderEnd(
        createEnd({
          scripts: [createInlineScript(content)],
        }),
      );

      expect(html).toContain(content);
    });

    it("renders deferred standalone scripts", () => {
      const html = renderEnd(
        createEnd({
          scripts: [createStandaloneScript("defer")],
        }),
      );

      expect(html).toContain('src="/assets/application.js"');
      expect(html).toContain('type="module"');
      expect(html).toContain('defer=""');
      expect(html).not.toContain('async=""');
    });

    it("renders asynchronous standalone scripts", () => {
      const html = renderEnd(
        createEnd({
          scripts: [createStandaloneScript("async")],
        }),
      );

      expect(html).toContain('src="/assets/application.js"');
      expect(html).toContain('async=""');
      expect(html).not.toContain('defer=""');
    });

    it("does not attach the inline nonce to standalone scripts", () => {
      const html = renderEnd(
        createEnd({
          scripts: [createStandaloneScript("defer")],
        }),
      );

      expect(html).not.toContain('nonce="test-nonce"');
    });

    it("uses the supplied request nonce", () => {
      const metadata: Metadata = {
        ...createMetadata(),
        nonce: "request-specific-nonce",
      };

      const html = renderEnd(
        createEnd({
          scripts: [createInlineScript()],
        }),
        metadata,
      );

      expect(html).toContain('nonce="request-specific-nonce"');

      expect(html).not.toContain('nonce="test-nonce"');
    });
  });

  describe("SVG sprite", () => {
    it("renders the hidden SVG sprite", () => {
      const html = renderEnd();

      expect(html).toContain('class="u-hidden-svg-sprite"');

      expect(html).toContain('aria-hidden="true"');

      expect(html).toContain('xmlns="http://www.w3.org/2000/svg"');

      expect(html).toContain("<defs>");
    });

    it("renders SVG symbols with their IDs and viewBoxes", () => {
      const html = renderEnd(
        createEnd({
          svg: [createSymbol("icon-camera")],
        }),
      );

      expect(html).toContain('id="icon-camera"');
      expect(html).toContain('viewBox="0 0 24 24"');
      expect(html).toContain('<path d="M2 2h20v20H2z"/>');
    });

    it("preserves SVG symbol order", () => {
      const html = renderEnd(
        createEnd({
          svg: [createSymbol("icon-camera"), createSymbol("icon-calendar")],
        }),
      );

      expect(html.indexOf('id="icon-camera"')).toBeLessThan(
        html.indexOf('id="icon-calendar"'),
      );
    });

    it("renders all supplied SVG symbols", () => {
      const html = renderEnd(
        createEnd({
          svg: [
            createSymbol("icon-camera"),
            createSymbol("icon-calendar"),
            createSymbol("icon-location-dot"),
          ],
        }),
      );

      expect(html.match(/<symbol\b/g) ?? []).toHaveLength(3);
    });

    it("supports an empty SVG symbol collection", () => {
      const html = renderEnd();

      expect(html).toContain("<defs></defs>");
      expect(html).not.toContain("<symbol");
    });

    it("preserves trusted SVG symbol content", () => {
      const content = '<path d="M0 0h12v12H0z" fill="currentColor"/>';

      const symbol: SvgSymbol = {
        ...createSymbol(),
        content,
      };

      const html = renderEnd(
        createEnd({
          svg: [symbol],
        }),
      );

      expect(html).toContain(content);
    });
  });

  describe("Document composition", () => {
    it("renders scripts before the SVG sprite", () => {
      const html = renderEnd(
        createEnd({
          scripts: [createInlineScript()],
          svg: [createSymbol()],
        }),
      );

      expect(html.indexOf("window.initialised")).toBeLessThan(
        html.indexOf('class="u-hidden-svg-sprite"'),
      );
    });

    it("renders the SVG sprite even when no scripts exist", () => {
      const html = renderEnd(
        createEnd({
          scripts: [],
          svg: [createSymbol()],
        }),
      );

      expect(html).not.toContain("<script");
      expect(html).toContain('id="icon-camera"');
    });

    it("does not introduce a document wrapper", () => {
      const html = renderEnd();

      expect(html).not.toContain("<html");
      expect(html).not.toContain("<head");
      expect(html).not.toContain("<body");
    });
  });
});
