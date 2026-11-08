// src/app/life-cycle/system/media/media.system.test.ts

import { handleMediaSystem } from "./media.system";
describe("Media system", () => {
  const origin = "https://kevinellen.com";
  const imagesAccountHash = "test-account-hash";
  const photoId = "epping-forest-fox";
  const photoPath = `/media/photo/${photoId}`;
  const cacheMatch = jest.fn(
    async (_request: Request): Promise<Response | undefined> => undefined,
  );
  const cachePut = jest.fn(
    async (_request: Request, _response: Response): Promise<void> => undefined,
  );
  const waitUntil = jest.fn((_promise: Promise<unknown>): void => {});
  const ctx = { waitUntil } as unknown as ExecutionContext;
  const createRequest = (
    path: string,
    method = "GET",
    accept?: string,
  ): Request =>
    new Request(`${origin}${path}`, {
      method,
      ...(accept === undefined ? {} : { headers: { Accept: accept } }),
    });
  const handle = (request: Request): Promise<Response | null> =>
    handleMediaSystem({ request, imagesAccountHash, ctx });
  let fetchSpy: jest.SpyInstance;
  let originalCaches: PropertyDescriptor | undefined;
  beforeAll(() => {
    originalCaches = Object.getOwnPropertyDescriptor(globalThis, "caches");
    Object.defineProperty(globalThis, "caches", {
      configurable: true,
      value: {
        default: {
          match: cacheMatch,
          put: cachePut,
        },
      },
    });
    fetchSpy = jest.spyOn(globalThis, "fetch");
  });
  beforeEach(() => {
    jest.clearAllMocks();
    cacheMatch.mockResolvedValue(undefined);
    cachePut.mockResolvedValue(undefined);
    fetchSpy.mockResolvedValue(
      new Response("image-data", {
        status: 200,
        headers: { "Content-Type": "image/webp" },
      }),
    );
  });
  afterAll(() => {
    fetchSpy.mockRestore();
    if (originalCaches) {
      Object.defineProperty(globalThis, "caches", originalCaches);
    } else {
      Reflect.deleteProperty(globalThis, "caches");
    }
  });
  describe("Routing", () => {
    it("ignores non-media routes", async () => {
      const response = await handle(createRequest("/journals/example"));
      expect(response).toBeNull();
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(cacheMatch).not.toHaveBeenCalled();
    });
    it.each(["POST", "PUT", "PATCH", "DELETE"])(
      "rejects %s requests",
      async (method) => {
        const response = await handle(createRequest(photoPath, method));
        expect(response?.status).toBe(405);
        expect(response?.headers.get("Allow")).toBe("GET, HEAD");
        expect(fetchSpy).not.toHaveBeenCalled();
      },
    );
    it.each([
      "/media/",
      "/media/unknown",
      "/media/photo/",
      "/media/photo/INVALID",
      "/media/photo/100/fox",
      "/media/photo/100/100/INVALID",
    ])("returns 404 for invalid route %s", async (path) => {
      const response = await handle(createRequest(path));
      expect(response?.status).toBe(404);
      expect(fetchSpy).not.toHaveBeenCalled();
    });
    it("accepts canonical photo routes", async () => {
      const response = await handle(createRequest(photoPath));
      expect(response?.status).toBe(200);
      const upstream = fetchSpy.mock.calls[0]?.[0] as Request;
      expect(upstream.url).toBe(
        `https://imagedelivery.net/${imagesAccountHash}/${photoId}/public`,
      );
    });
    it("accepts sized photo routes", async () => {
      const response = await handle(
        createRequest(`/media/photo/1200/800/${photoId}`),
      );
      expect(response?.status).toBe(200);
      const upstream = fetchSpy.mock.calls[0]?.[0] as Request;
      expect(upstream.url).toBe(
        `https://imagedelivery.net/${imagesAccountHash}/${photoId}/w=1200,h=800,fit=scale-down`,
      );
    });
    it.each([`${photoPath}/`, `/media/photo/1200/800/${photoId}/`])(
      "accepts trailing slash on %s",
      async (path) => {
        const response = await handle(createRequest(path));
        expect(response?.status).toBe(200);
      },
    );
    it.each([
      [0, 800],
      [800, 0],
      [4097, 800],
      [800, 4097],
    ])("rejects invalid dimensions %i x %i", async (width, height) => {
      const response = await handle(
        createRequest(`/media/photo/${width}/${height}/${photoId}`),
      );
      expect(response?.status).toBe(400);
      expect(fetchSpy).not.toHaveBeenCalled();
    });
    it("rejects dimensions outside safe integer range", async () => {
      const response = await handle(
        createRequest(`/media/photo/9007199254740992/800/${photoId}`),
      );
      expect(response?.status).toBe(400);
      expect(fetchSpy).not.toHaveBeenCalled();
    });
    it("accepts maximum dimensions", async () => {
      const response = await handle(
        createRequest(`/media/photo/4096/4096/${photoId}`),
      );
      expect(response?.status).toBe(200);
    });
  });
  describe("Format negotiation", () => {
    it.each([
      ["image/avif", "avif"],
      ["image/webp", "webp"],
      ["image/jpeg", "jpeg"],
      ["", "jpeg"],
      ["image/png", "jpeg"],
      ["IMAGE/WEBP", "webp"],
    ])("negotiates %s as %s", async (accept, format) => {
      await handle(createRequest(photoPath, "GET", accept));
      const upstream = fetchSpy.mock.calls[0]?.[0] as Request;
      expect(upstream.headers.get("Accept")).toBe(`image/${format}`);
    });
    it("defaults to JPEG when Accept is absent", async () => {
      const request = createRequest(photoPath);
      expect(request.headers.has("Accept")).toBe(false);
      const response = await handle(request);
      expect(response?.status).toBe(200);
      const upstream = fetchSpy.mock.calls[0]?.[0] as Request;
      expect(upstream.headers.get("Accept")).toBe("image/jpeg");
    });
    it("prioritises AVIF over WebP", async () => {
      await handle(createRequest(photoPath, "GET", "image/webp,image/avif"));
      const upstream = fetchSpy.mock.calls[0]?.[0] as Request;
      expect(upstream.headers.get("Accept")).toBe("image/avif");
    });
    it("excludes formats with zero quality", async () => {
      await handle(
        createRequest(photoPath, "GET", "image/avif;q=0,image/webp;q=0.8"),
      );
      const upstream = fetchSpy.mock.calls[0]?.[0] as Request;
      expect(upstream.headers.get("Accept")).toBe("image/webp");
    });
  });
  describe("Caching", () => {
    it("returns cached responses without fetching upstream", async () => {
      cacheMatch.mockResolvedValue(
        new Response("cached-image", {
          status: 200,
          headers: { "Content-Type": "image/webp" },
        }),
      );
      const response = await handle(
        createRequest(photoPath, "GET", "image/webp"),
      );
      expect(response?.status).toBe(200);
      expect(await response?.text()).toBe("cached-image");
      expect(response?.headers.get("X-Media-Cache")).toBe("HIT");
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(cachePut).not.toHaveBeenCalled();
    });
    it("fetches and caches on a cache miss", async () => {
      const response = await handle(
        createRequest(photoPath, "GET", "image/webp"),
      );
      expect(response?.status).toBe(200);
      expect(response?.headers.get("X-Media-Cache")).toBe("MISS");
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(cachePut).toHaveBeenCalledTimes(1);
      expect(waitUntil).toHaveBeenCalledTimes(1);
    });
    it("normalises cache keys regardless of query parameters", async () => {
      await handle(
        createRequest(
          `${photoPath}?utm_source=test&foo=bar`,
          "GET",
          "image/webp",
        ),
      );
      const cacheKey = cacheMatch.mock.calls[0]?.[0];
      expect(cacheKey?.url).toBe(`${origin}${photoPath}?format=webp`);
      expect(cacheKey?.method).toBe("GET");
    });
    it("normalises sized cache keys and trailing slashes", async () => {
      await handle(
        createRequest(
          `/media/photo/1200/800/${photoId}/?x=1`,
          "GET",
          "image/webp",
        ),
      );
      const cacheKey = cacheMatch.mock.calls[0]?.[0];
      expect(cacheKey?.url).toBe(
        `${origin}/media/photo/1200/800/${photoId}?format=webp`,
      );
    });
    it("separates cache entries by image format", async () => {
      await handle(createRequest(photoPath, "GET", "image/avif"));
      const cacheKey = cacheMatch.mock.calls[0]?.[0];
      expect(cacheKey?.url).toBe(`${origin}${photoPath}?format=avif`);
    });
    it("stores responses without the cache diagnostic header", async () => {
      await handle(createRequest(photoPath));
      const cachedResponse = cachePut.mock.calls[0]?.[1];
      expect(cachedResponse?.headers.has("X-Media-Cache")).toBe(false);
      expect(await cachedResponse?.text()).toBe("image-data");
    });
    it("removes upstream cookies and Vary headers", async () => {
      fetchSpy.mockResolvedValue(
        new Response("image-data", {
          status: 200,
          headers: { "Set-Cookie": "session=123", Vary: "Accept" },
        }),
      );
      const response = await handle(createRequest(photoPath));
      expect(response?.headers.has("Set-Cookie")).toBe(false);
      expect(response?.headers.has("Vary")).toBe(false);
      expect(response?.headers.get("Cache-Control")).toBe(
        "public, max-age=86400, s-maxage=2592000",
      );
    });
    it("continues when cache lookup fails", async () => {
      const warning = jest.spyOn(console, "warn").mockImplementation(() => {});
      try {
        cacheMatch.mockRejectedValue(new Error("Cache unavailable"));
        const response = await handle(createRequest(photoPath));
        expect(response?.status).toBe(200);
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(warning).toHaveBeenCalledWith(
          "Media cache lookup failed",
          expect.any(Error),
        );
      } finally {
        warning.mockRestore();
      }
    });
    it("handles cache write failures without rejecting the response", async () => {
      const warning = jest.spyOn(console, "warn").mockImplementation(() => {});
      try {
        cachePut.mockRejectedValue(new Error("Cache write failed"));
        const response = await handle(createRequest(photoPath));
        expect(response?.status).toBe(200);
        const backgroundWork = waitUntil.mock.calls[0]?.[0];
        await backgroundWork;
        expect(warning).toHaveBeenCalledWith(
          "Media cache write failed",
          expect.any(Error),
        );
      } finally {
        warning.mockRestore();
      }
    });
  });
  describe("Upstream responses", () => {
    it("returns a sanitised 404 when the image is missing upstream", async () => {
      fetchSpy.mockResolvedValue(
        new Response("Private upstream not-found details", { status: 404 }),
      );
      const response = await handle(createRequest(photoPath));
      expect(response?.status).toBe(404);
      expect(await response?.text()).toBe("Image not found");
      expect(response?.headers.get("Cache-Control")).toBe("no-store");
      expect(cachePut).not.toHaveBeenCalled();
      expect(waitUntil).not.toHaveBeenCalled();
    });
    it.each([403, 429, 500, 503])(
      "maps upstream %i to a sanitised 502",
      async (status) => {
        const warning = jest
          .spyOn(console, "warn")
          .mockImplementation(() => undefined);
        try {
          fetchSpy.mockResolvedValue(
            new Response("Private upstream failure details", { status }),
          );
          const response = await handle(createRequest(photoPath));
          expect(response?.status).toBe(502);
          expect(await response?.text()).toBe("Image unavailable");
          expect(response?.headers.get("Cache-Control")).toBe("no-store");
          expect(cachePut).not.toHaveBeenCalled();
          expect(waitUntil).not.toHaveBeenCalled();
          expect(warning).toHaveBeenCalledWith(
            "Media upstream delivery failed",
            { status, photoId },
          );
        } finally {
          warning.mockRestore();
        }
      },
    );
    it("does not cache non-200 successful responses", async () => {
      fetchSpy.mockResolvedValue(new Response(null, { status: 206 }));
      const response = await handle(createRequest(photoPath));
      expect(response?.status).toBe(206);
      expect(cachePut).not.toHaveBeenCalled();
    });
  });
  describe("HEAD requests", () => {
    it("fetches headers without returning an image body", async () => {
      const response = await handle(createRequest(photoPath, "HEAD"));
      expect(response?.status).toBe(200);
      expect(response?.body).toBeNull();
      const upstream = fetchSpy.mock.calls[0]?.[0] as Request;
      expect(upstream.method).toBe("HEAD");
      expect(cacheMatch).not.toHaveBeenCalled();
      expect(cachePut).not.toHaveBeenCalled();
      expect(waitUntil).not.toHaveBeenCalled();
    });
  });
});
