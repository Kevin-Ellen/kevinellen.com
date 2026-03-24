// tests/src/app/policies/request/canonical/apply.canonical.test.ts

import { applyCanonicalPolicy } from "@app/policies/request/canonical/apply.canonical";
import { getRuntimeBehaviour } from "@utils/runtimeEnv.util";

jest.mock("@utils/runtimeEnv.util", () => ({
  getRuntimeBehaviour: jest.fn(),
}));

describe("applyCanonicalPolicy", () => {
  const mockedGetRuntimeBehaviour = jest.mocked(getRuntimeBehaviour);

  const createEnv = (): Env =>
    ({
      APP_ENV: "dev",
    }) as Env;

  const createRequest = (url: string): Request => new Request(url);

  const createCanonicalDisabledRuntimeBehaviour = () =>
    ({
      canonical: false,
      indexing: false,
      public: false,
    }) as const;

  const createCanonicalEnabledRuntimeBehaviour = () =>
    ({
      canonical: true,
      indexing: false,
      public: true,
    }) as const;

  const createProdRuntimeBehaviour = () =>
    ({
      canonical: true,
      indexing: true,
      public: true,
    }) as const;

  const expectDirectResponse = (
    result: ReturnType<typeof applyCanonicalPolicy>,
  ): Response => {
    if (result.type !== "direct-response") {
      throw new Error("Expected direct-response outcome");
    }

    return result.response;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("runtime behaviour dependency", () => {
    it("reads runtime behaviour from the provided env", () => {
      const req = createRequest("https://www.kevinellen.com/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      applyCanonicalPolicy(req, env);

      expect(mockedGetRuntimeBehaviour).toHaveBeenCalledTimes(1);
      expect(mockedGetRuntimeBehaviour).toHaveBeenCalledWith(env);
    });
  });

  describe("continue behaviour", () => {
    it("returns continue when the request URL is already canonical", () => {
      const req = createRequest("https://kevinellen.com/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);

      expect(result).toEqual({ type: "continue" });
    });

    it("returns continue when canonical host normalisation is disabled and the URL is otherwise unchanged", () => {
      const req = createRequest("https://www.kevinellen.com/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalDisabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);

      expect(result).toEqual({ type: "continue" });
    });

    it("returns continue for the root URL when it is already canonical", () => {
      const req = createRequest("https://kevinellen.com/");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);

      expect(result).toEqual({ type: "continue" });
    });
  });

  describe("host canonicalisation", () => {
    it("redirects www hostnames to the non-www canonical hostname when canonical behaviour is enabled", () => {
      const req = createRequest("https://www.kevinellen.com/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(
        "https://kevinellen.com/example",
      );
      expect(response.headers.get("x-runtime-policy")).toBe("canonical");
    });

    it("preserves non-www hostnames when canonical behaviour is enabled", () => {
      const req = createRequest("https://kevinellen.com/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);

      expect(result).toEqual({ type: "continue" });
    });

    it("preserves the port when canonicalising the hostname", () => {
      const req = createRequest("https://www.kevinellen.com:8443/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.headers.get("location")).toBe(
        "https://kevinellen.com:8443/example",
      );
    });
  });

  describe("path canonicalisation", () => {
    it("lowercases non-root pathnames", () => {
      const req = createRequest("https://kevinellen.com/Example/Page");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.headers.get("location")).toBe(
        "https://kevinellen.com/example/page",
      );
    });

    it("removes trailing slashes from non-root pathnames", () => {
      const req = createRequest("https://kevinellen.com/example/");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.headers.get("location")).toBe(
        "https://kevinellen.com/example",
      );
    });

    it("applies lowercasing and trailing slash removal together", () => {
      const req = createRequest("https://kevinellen.com/Example/Page/");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.headers.get("location")).toBe(
        "https://kevinellen.com/example/page",
      );
    });

    it("keeps the root pathname as slash", () => {
      const req = createRequest("https://kevinellen.com/");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);

      expect(result).toEqual({ type: "continue" });
    });
  });

  describe("query string handling", () => {
    it("preserves the query string when redirecting to the canonical URL", () => {
      const req = createRequest("https://www.kevinellen.com/Example/?a=1&b=2");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.headers.get("location")).toBe(
        "https://kevinellen.com/example?a=1&b=2",
      );
    });

    it("preserves the query string when only pathname canonicalisation changes", () => {
      const req = createRequest("https://kevinellen.com/Example/?page=2");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.headers.get("location")).toBe(
        "https://kevinellen.com/example?page=2",
      );
    });

    it("preserves the query string for the root URL when canonicalising the hostname", () => {
      const req = createRequest("https://www.kevinellen.com/?a=1&b=2");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.headers.get("location")).toBe(
        "https://kevinellen.com/?a=1&b=2",
      );
    });
  });

  describe("response contract", () => {
    it("returns a 308 redirect for canonical differences", () => {
      const req = createRequest("https://www.kevinellen.com/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.status).toBe(308);
    });

    it("sets only the expected canonical redirect headers", () => {
      const req = createRequest("https://www.kevinellen.com/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(Object.fromEntries(response.headers.entries())).toEqual({
        location: "https://kevinellen.com/example",
        "x-runtime-policy": "canonical",
      });
    });

    it("returns an empty response body for canonical redirects", async () => {
      const req = createRequest("https://www.kevinellen.com/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      await expect(response.text()).resolves.toBe("");
    });

    it("does not set a content-type header", () => {
      const req = createRequest("https://www.kevinellen.com/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.headers.get("content-type")).toBeNull();
    });

    it("exposes canonical redirect headers in a case-insensitive way", () => {
      const req = createRequest("https://www.kevinellen.com/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(
        createCanonicalEnabledRuntimeBehaviour(),
      );

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.headers.get("Location")).toBe(
        "https://kevinellen.com/example",
      );
      expect(response.headers.get("X-Runtime-Policy")).toBe("canonical");
    });
  });

  describe("runtime mode coverage", () => {
    it("also redirects in prod when canonical differences exist", () => {
      const req = createRequest("https://www.kevinellen.com/example");
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue(createProdRuntimeBehaviour());

      const result = applyCanonicalPolicy(req, env);
      const response = expectDirectResponse(result);

      expect(response.headers.get("location")).toBe(
        "https://kevinellen.com/example",
      );
    });
  });
});
