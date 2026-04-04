// tests/src/app/policies/response/robots/apply.robots.response.policy.test.ts

import { applyRobotsResponsePolicy } from "@app/policies/response/robots/apply.robots.response.policy";
import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type {
  ErrorPageDefinition,
  PageRobotsConfig,
} from "@shared-types/pages/page.definition";

import { createPageContentFixture } from "@tests/helpers/page.content.fixture";

const createRobotsConfig = (
  overrides: Partial<PageRobotsConfig> = {},
): PageRobotsConfig => ({
  allowIndex: true,
  allowFollow: true,
  noarchive: false,
  nosnippet: false,
  noimageindex: false,
  ...overrides,
});

const createTarget = (robots: PageRobotsConfig): DocumentRenderTarget => {
  const page: ErrorPageDefinition = {
    core: {
      id: "error-500",
      label: "Internal Error",
      kind: "error",
      status: 500,
    },
    config: {
      robots,
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

const createContext = (
  appEnv: Env["APP_ENV"],
  robots: PageRobotsConfig,
): ResponsePolicyContext => ({
  req: new Request("https://example.com/test"),
  env: {
    APP_ENV: appEnv,
  } as Env,
  appState: {} as never,
  target: createTarget(robots),
  security: {
    nonce: "testnonce123",
  },
});

describe("applyRobotsResponsePolicy", () => {
  it("sets strict non-indexable directives outside prod", async () => {
    const context = createContext(
      "dev",
      createRobotsConfig({
        allowIndex: true,
        allowFollow: true,
      }),
    );

    const response = new Response("<html>Hello</html>", {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });

    const result = applyRobotsResponsePolicy(context, response);

    expect(result.headers.get("x-robots-tag")).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
  });

  it("uses authored robots directives in prod", () => {
    const context = createContext(
      "prod",
      createRobotsConfig({
        allowIndex: true,
        allowFollow: true,
      }),
    );

    const response = new Response("<html>Hello</html>");

    const result = applyRobotsResponsePolicy(context, response);

    expect(result.headers.get("x-robots-tag")).toBe("index, follow");
  });

  it("includes optional authored robots directives in prod when enabled", () => {
    const context = createContext(
      "prod",
      createRobotsConfig({
        allowIndex: false,
        allowFollow: false,
        noarchive: true,
        nosnippet: true,
        noimageindex: true,
      }),
    );

    const response = new Response("<html>Hello</html>");

    const result = applyRobotsResponsePolicy(context, response);

    expect(result.headers.get("x-robots-tag")).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
  });

  it("preserves unrelated headers when adding x-robots-tag", () => {
    const context = createContext("prod", createRobotsConfig());

    const response = new Response("<html>Hello</html>", {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-render-mode": "document",
      },
    });

    const result = applyRobotsResponsePolicy(context, response);

    expect(result.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(result.headers.get("x-render-mode")).toBe("document");
    expect(result.headers.get("x-robots-tag")).toBe("index, follow");
  });

  it("preserves status and statusText when rebuilding the response", () => {
    const context = createContext("prod", createRobotsConfig());

    const response = new Response("<html>Hello</html>", {
      status: 410,
      statusText: "Gone",
    });

    const result = applyRobotsResponsePolicy(context, response);

    expect(result.status).toBe(410);
    expect(result.statusText).toBe("Gone");
  });

  it("preserves the response body when rebuilding the response", async () => {
    const context = createContext("prod", createRobotsConfig());

    const response = new Response("<html>Hello</html>");

    const result = applyRobotsResponsePolicy(context, response);

    await expect(result.text()).resolves.toBe("<html>Hello</html>");
  });

  it("returns a new response instance when x-robots-tag is added", () => {
    const context = createContext("prod", createRobotsConfig());

    const response = new Response("<html>Hello</html>");

    const result = applyRobotsResponsePolicy(context, response);

    expect(result).not.toBe(response);
  });
});
