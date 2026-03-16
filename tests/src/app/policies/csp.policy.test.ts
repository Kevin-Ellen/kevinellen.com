// tests/src/app/policies/csp.policy.test.ts

import buildCspHeader from "@app/policies/csp.policy";

describe("buildCspHeader", () => {
  it("returns the baseline policy when there are no inline assets", async () => {
    const cspHeader = await buildCspHeader([]);

    expect(cspHeader).toContain("default-src 'self'");
    expect(cspHeader).toContain("script-src 'self'");
    expect(cspHeader).toContain("style-src 'self'");
    expect(cspHeader).toContain("img-src 'self' https: data:");
    expect(cspHeader).toContain("font-src 'self' https: data:");
    expect(cspHeader).toContain("object-src 'none'");
    expect(cspHeader).toContain("base-uri 'self'");
    expect(cspHeader).toContain("frame-ancestors 'none'");
  });

  it("adds a script hash for inline script assets", async () => {
    const cspHeader = await buildCspHeader([
      {
        kind: "script",
        content: "console.log('hello world');",
      },
    ]);

    expect(cspHeader).toContain("script-src 'self' ");
    expect(cspHeader).toMatch(/script-src 'self' 'sha256-[^']+'/);
    expect(cspHeader).toContain("style-src 'self'");
  });

  it("adds a style hash for inline style assets", async () => {
    const cspHeader = await buildCspHeader([
      {
        kind: "style",
        content: "body{background:red;}",
      },
    ]);

    expect(cspHeader).toContain("style-src 'self' ");
    expect(cspHeader).toMatch(/style-src 'self' 'sha256-[^']+'/);
    expect(cspHeader).toContain("script-src 'self'");
  });

  it("adds both script and style hashes when both asset kinds are present", async () => {
    const cspHeader = await buildCspHeader([
      {
        kind: "script",
        content: "console.log('hello world');",
      },
      {
        kind: "style",
        content: "body{background:red;}",
      },
    ]);

    expect(cspHeader).toMatch(/script-src 'self' 'sha256-[^']+'/);
    expect(cspHeader).toMatch(/style-src 'self' 'sha256-[^']+'/);
  });

  it("does not duplicate hashes for identical inline assets", async () => {
    const cspHeader = await buildCspHeader([
      {
        kind: "script",
        content: "console.log('same');",
      },
      {
        kind: "script",
        content: "console.log('same');",
      },
    ]);

    const scriptDirective = cspHeader
      .split("; ")
      .find((directive) => directive.startsWith("script-src"));

    expect(scriptDirective).toBeDefined();

    const hashMatches = scriptDirective?.match(/'sha256-[^']+'/g) ?? [];

    expect(hashMatches).toHaveLength(1);
  });

  it("keeps script and style hashes separate", async () => {
    const cspHeader = await buildCspHeader([
      {
        kind: "script",
        content: "console.log('script');",
      },
      {
        kind: "style",
        content: ".test{display:none;}",
      },
    ]);

    const scriptDirective = cspHeader
      .split("; ")
      .find((directive) => directive.startsWith("script-src"));

    const styleDirective = cspHeader
      .split("; ")
      .find((directive) => directive.startsWith("style-src"));

    expect(scriptDirective).toBeDefined();
    expect(styleDirective).toBeDefined();

    expect(scriptDirective).toMatch(/'sha256-[^']+'/);
    expect(styleDirective).toMatch(/'sha256-[^']+'/);
    expect(scriptDirective).not.toBe(styleDirective);
  });
});
