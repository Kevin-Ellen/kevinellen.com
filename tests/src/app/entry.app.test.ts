import handleApp from "@app/entry.app";

import resolveAppRoute from "@app/router/app.router";
import documentRenderer from "@app/renderers/document.renderer";

import siteConfig from "@config/site.config";

import type { AppPage } from "@types-src/appPage.types";

jest.mock("@app/router/app.router", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@app/renderers/document.renderer", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockResolveAppRoute = resolveAppRoute as jest.MockedFunction<
  typeof resolveAppRoute
>;
const mockDocumentRenderer = documentRenderer as jest.MockedFunction<
  typeof documentRenderer
>;

const mockPage = {
  status: 200,
  config: {
    robots: {
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    },
  },
} as AppPage;

const mockNotFoundPage = {
  status: 404,
  config: {
    robots: {
      allowIndex: false,
      allowFollow: false,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    },
  },
} as AppPage;

describe("handleApp", () => {
  const ctx = {} as ExecutionContext;

  beforeEach(() => {
    jest.resetAllMocks();

    mockResolveAppRoute.mockReturnValue(mockPage);
    mockDocumentRenderer.mockReturnValue({
      html: "<html><body>About</body></html>",
      inlineAssets: [],
    });
  });

  describe("canonical redirect", () => {
    it("returns a 308 redirect in prod for www host", async () => {
      const env = { APP_ENV: "prod" } as Env;
      const req = new Request("https://www.kevinellen.com/about");

      const res = await handleApp(req, env, ctx);

      expect(res.status).toBe(308);
      expect(res.headers.get("location")).toBe("https://kevinellen.com/about");
      expect(mockResolveAppRoute).not.toHaveBeenCalled();
      expect(mockDocumentRenderer).not.toHaveBeenCalled();
    });

    it("preserves query params in prod canonical redirect", async () => {
      const env = { APP_ENV: "prod" } as Env;
      const req = new Request("https://www.kevinellen.com/about?ref=test");

      const res = await handleApp(req, env, ctx);

      expect(res.status).toBe(308);
      expect(res.headers.get("location")).toBe(
        "https://kevinellen.com/about?ref=test",
      );
      expect(mockResolveAppRoute).not.toHaveBeenCalled();
      expect(mockDocumentRenderer).not.toHaveBeenCalled();
    });

    it("does not redirect in dev", async () => {
      const env = { APP_ENV: "dev" } as Env;
      const req = new Request("https://kevinellen.com/about");

      const res = await handleApp(req, env, ctx);

      expect(res.status).toBe(200);
      expect(mockResolveAppRoute).toHaveBeenCalledWith("/about");
      expect(mockDocumentRenderer).toHaveBeenCalledWith(siteConfig, mockPage);
    });
  });

  describe("html response", () => {
    it("renders the resolved page and sets content type", async () => {
      const env = { APP_ENV: "prod" } as Env;
      const req = new Request("https://kevinellen.com/about");

      const res = await handleApp(req, env, ctx);

      expect(mockResolveAppRoute).toHaveBeenCalledWith("/about");
      expect(mockDocumentRenderer).toHaveBeenCalledWith(siteConfig, mockPage);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
      expect(await res.text()).toBe("<html><body>About</body></html>");
    });

    it("sets x-robots-tag from page config in prod", async () => {
      const env = { APP_ENV: "prod" } as Env;
      const req = new Request("https://kevinellen.com/about");

      const res = await handleApp(req, env, ctx);

      expect(res.headers.get("x-robots-tag")).toBe("index, follow");
    });

    it("forces noindex, nofollow outside prod", async () => {
      const env = { APP_ENV: "dev" } as Env;
      const req = new Request("https://kevinellen.com/about");

      const res = await handleApp(req, env, ctx);

      expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    });

    it("sets a content security policy header", async () => {
      const env = { APP_ENV: "prod" } as Env;
      const req = new Request("https://kevinellen.com/about");

      const res = await handleApp(req, env, ctx);

      expect(res.headers.get("content-security-policy")).toContain(
        "default-src 'self'",
      );
    });
  });

  describe("404 handling", () => {
    it("returns 404 for an unknown route", async () => {
      const env = { APP_ENV: "prod" } as Env;
      const req = new Request("https://kevinellen.com/this-is-not-real");

      mockResolveAppRoute.mockReturnValueOnce(mockNotFoundPage);

      const res = await handleApp(req, env, ctx);

      expect(mockResolveAppRoute).toHaveBeenCalledWith("/this-is-not-real");
      expect(mockDocumentRenderer).toHaveBeenCalledWith(
        siteConfig,
        mockNotFoundPage,
      );
      expect(res.status).toBe(404);
      expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    });
  });

  describe("env hardening", () => {
    it("throws when APP_ENV is not defined", async () => {
      const env = {} as Env;
      const req = new Request("https://kevinellen.com/about");

      await expect(handleApp(req, env, ctx)).rejects.toThrow(
        "APP_ENV not defined",
      );
    });
  });
});
