// tests/src/entry.test.ts

import entry from "@src/entry";

import handleApp from "@app/entry.app";
import handleRobots from "@system/robots.handler";
import handleXmlSitemap from "@system/xmlSitemap.handler";
import handleWebmanifest from "@system/webmanifest.handler";
import handlePhotoResource from "@resources/photoResource.handler";

jest.mock("@app/entry.app", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@system/robots.handler", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@system/xmlSitemap.handler", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@system/webmanifest.handler", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@resources/photoResource.handler", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockHandleApp = handleApp as jest.MockedFunction<typeof handleApp>;
const mockHandleRobots = handleRobots as jest.MockedFunction<
  typeof handleRobots
>;
const mockHandleXmlSitemap = handleXmlSitemap as jest.MockedFunction<
  typeof handleXmlSitemap
>;
const mockHandleWebmanifest = handleWebmanifest as jest.MockedFunction<
  typeof handleWebmanifest
>;
const mockHandlePhotoResource = handlePhotoResource as jest.MockedFunction<
  typeof handlePhotoResource
>;

describe("entry.fetch", () => {
  const env = { APP_ENV: "prod" } as Env;
  const ctx = {} as ExecutionContext;

  beforeEach(() => {
    jest.resetAllMocks();

    mockHandleApp.mockResolvedValue(new Response("app"));
    mockHandleRobots.mockResolvedValue(new Response("robots"));
    mockHandleXmlSitemap.mockResolvedValue(new Response("sitemap"));
    mockHandleWebmanifest.mockResolvedValue(new Response("manifest"));
    mockHandlePhotoResource.mockResolvedValue(new Response("photo-resource"));
  });

  describe("request method policy", () => {
    it("returns 405 for POST requests", async () => {
      const req = new Request("https://kevinellen.com/about", {
        method: "POST",
      });

      const res = await entry.fetch(req, env, ctx);

      expect(res.status).toBe(405);
      expect(res.headers.get("allow")).toBe("GET, HEAD");
      expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
      expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(await res.text()).toBe("Method Not Allowed");
    });

    it("allows HEAD requests through to app handling", async () => {
      const req = new Request("https://kevinellen.com/about", {
        method: "HEAD",
      });

      const res = await entry.fetch(req, env, ctx);

      expect(mockHandleApp).toHaveBeenCalledWith(req, env, ctx);
      expect(res.status).toBe(200);
    });
  });

  describe("system route dispatch", () => {
    it("routes /robots.txt to handleRobots", async () => {
      const req = new Request("https://kevinellen.com/robots.txt");

      const res = await entry.fetch(req, env, ctx);

      expect(mockHandleRobots).toHaveBeenCalledWith(req, env, ctx);
      expect(mockHandleApp).not.toHaveBeenCalled();
      expect(await res.text()).toBe("robots");
    });

    it("routes /sitemap.xml to handleXmlSitemap", async () => {
      const req = new Request("https://kevinellen.com/sitemap.xml");

      const res = await entry.fetch(req, env, ctx);

      expect(mockHandleXmlSitemap).toHaveBeenCalledWith(req, env, ctx);
      expect(mockHandleApp).not.toHaveBeenCalled();
      expect(await res.text()).toBe("sitemap");
    });

    it("routes /manifest.webmanifest to handleWebmanifest", async () => {
      const req = new Request("https://kevinellen.com/manifest.webmanifest");

      const res = await entry.fetch(req, env, ctx);

      expect(mockHandleWebmanifest).toHaveBeenCalledWith(req, env, ctx);
      expect(mockHandleApp).not.toHaveBeenCalled();
      expect(await res.text()).toBe("manifest");
    });
  });

  describe("resource route dispatch", () => {
    it("routes /photo/:id to handlePhotoResource", async () => {
      const req = new Request("https://kevinellen.com/photo/abc123");

      const res = await entry.fetch(req, env, ctx);

      expect(mockHandlePhotoResource).toHaveBeenCalledWith(req, env, ctx);
      expect(mockHandleApp).not.toHaveBeenCalled();
      expect(await res.text()).toBe("photo-resource");
    });

    it("does not route /photos to handlePhotoResource", async () => {
      const req = new Request("https://kevinellen.com/photos");

      const res = await entry.fetch(req, env, ctx);

      expect(mockHandlePhotoResource).not.toHaveBeenCalled();
      expect(mockHandleApp).toHaveBeenCalledWith(req, env, ctx);
      expect(await res.text()).toBe("app");
    });

    it("does not route /photo to handlePhotoResource", async () => {
      const req = new Request("https://kevinellen.com/photo");

      const res = await entry.fetch(req, env, ctx);

      expect(mockHandlePhotoResource).not.toHaveBeenCalled();
      expect(mockHandleApp).toHaveBeenCalledWith(req, env, ctx);
      expect(await res.text()).toBe("app");
    });
  });

  describe("app route dispatch", () => {
    it("routes non-system, non-resource paths to handleApp", async () => {
      const req = new Request("https://kevinellen.com/about");

      const res = await entry.fetch(req, env, ctx);

      expect(mockHandleApp).toHaveBeenCalledWith(req, env, ctx);
      expect(mockHandleRobots).not.toHaveBeenCalled();
      expect(mockHandleXmlSitemap).not.toHaveBeenCalled();
      expect(mockHandleWebmanifest).not.toHaveBeenCalled();
      expect(mockHandlePhotoResource).not.toHaveBeenCalled();
      expect(await res.text()).toBe("app");
    });

    it("does not return 500 for an unknown route", async () => {
      const req = new Request("https://kevinellen.com/unknown-page");

      const res = await entry.fetch(req, env, ctx);

      expect(res.status).not.toBe(500);
    });
  });

  describe("error handling", () => {
    it("returns 500 when a handler throws", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockHandleApp.mockRejectedValueOnce(new Error("boom"));

      const req = new Request("https://kevinellen.com/about");

      const res = await entry.fetch(req, env, ctx);

      expect(res.status).toBe(500);
      expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
      expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(res.headers.get("content-security-policy")).toContain(
        "default-src 'self'",
      );
      expect(await res.text()).toContain("Something went wrong");

      consoleErrorSpy.mockRestore();
    });

    it("returns 500 when __500 is present outside prod", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const testEnv = { APP_ENV: "dev" } as Env;
      const req = new Request("https://kevinellen.com/about?__500=1");

      const res = await entry.fetch(req, testEnv, ctx);

      expect(mockHandleApp).not.toHaveBeenCalled();
      expect(res.status).toBe(500);
      expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
      expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(res.headers.get("content-security-policy")).toContain(
        "default-src 'self'",
      );
      expect(await res.text()).toContain("Something went wrong");

      consoleErrorSpy.mockRestore();
    });

    it("does not force 500 when __500 is present in prod", async () => {
      const prodEnv = { APP_ENV: "prod" } as Env;
      const req = new Request("https://kevinellen.com/about?__500=1");

      const res = await entry.fetch(req, prodEnv, ctx);

      expect(mockHandleApp).toHaveBeenCalledWith(req, prodEnv, ctx);
      expect(res.status).toBe(200);
      expect(await res.text()).toBe("app");
    });
  });
});
