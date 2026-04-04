// tests/src/app/policies/response/security/apply.csp.response.policy.test.ts

// tests/src/app/policies/response/security/apply.csp.response.policy.test.ts

import { applyCspResponsePolicy } from "@app/policies/response/security/apply.csp.response.policy";
import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { ErrorPageDefinition } from "@shared-types/pages/page.definition";

import { createPageContentFixture } from "@tests/helpers/page.content.fixture";

const createTarget = (): DocumentRenderTarget => {
  const page: ErrorPageDefinition = {
    core: {
      id: "error-500",
      label: "Internal Error",
      kind: "error",
      status: 500,
    },
    config: {
      robots: {
        allowIndex: false,
        allowFollow: false,
        noarchive: true,
        nosnippet: true,
        noimageindex: true,
      },
    },
    meta: {
      pageTitle: "Internal Error",
      metaDescription: "Something went wrong.",
    },
    navigation: {
      breadcrumbs: [],
    },
    content: createPageContentFixture(),
    assets: {
      scripts: [],
      svgs: [],
    },
  };

  return {
    kind: "error-page",
    page,
    status: 500,
  };
};

const createContext = (nonce: string): ResponsePolicyContext => ({
  req: new Request("https://example.com/test"),
  env: {
    APP_ENV: "dev",
  } as Env,
  appState: {} as never,
  target: createTarget(),
  security: {
    nonce,
  },
});

describe("applyCspResponsePolicy", () => {
  it("sets a content-security-policy header", () => {
    const context = createContext("abc123nonce");
    const response = new Response("<html>Hello</html>");

    const result = applyCspResponsePolicy(context, response);

    expect(result.headers.get("content-security-policy")).toBe(
      "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'nonce-abc123nonce'; style-src 'self' 'nonce-abc123nonce'; img-src 'self' data: https:; font-src 'self' https: data:; connect-src 'self'; form-action 'self'; manifest-src 'self'",
    );
  });

  it("injects the render nonce into both script-src and style-src", () => {
    const context = createContext("469798f9a7974e3f9e2ced4ba35f78a6");
    const response = new Response("<html>Hello</html>");

    const result = applyCspResponsePolicy(context, response);
    const csp = result.headers.get("content-security-policy");

    expect(csp).toContain(
      "script-src 'self' 'nonce-469798f9a7974e3f9e2ced4ba35f78a6'",
    );
    expect(csp).toContain(
      "style-src 'self' 'nonce-469798f9a7974e3f9e2ced4ba35f78a6'",
    );
  });

  it("preserves unrelated headers when adding content-security-policy", () => {
    const context = createContext("abc123nonce");

    const response = new Response("<html>Hello</html>", {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-render-mode": "document",
      },
    });

    const result = applyCspResponsePolicy(context, response);

    expect(result.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(result.headers.get("x-render-mode")).toBe("document");
    expect(result.headers.get("content-security-policy")).toContain(
      "default-src 'self'",
    );
  });

  it("preserves status and statusText when rebuilding the response", () => {
    const context = createContext("abc123nonce");

    const response = new Response("<html>Hello</html>", {
      status: 404,
      statusText: "Not Found",
    });

    const result = applyCspResponsePolicy(context, response);

    expect(result.status).toBe(404);
    expect(result.statusText).toBe("Not Found");
  });

  it("preserves the response body when rebuilding the response", async () => {
    const context = createContext("abc123nonce");

    const response = new Response("<html>Hello</html>");

    const result = applyCspResponsePolicy(context, response);

    await expect(result.text()).resolves.toBe("<html>Hello</html>");
  });

  it("returns a new response instance when content-security-policy is added", () => {
    const context = createContext("abc123nonce");

    const response = new Response("<html>Hello</html>");

    const result = applyCspResponsePolicy(context, response);

    expect(result).not.toBe(response);
  });
});
