// tests/src/app/policies/response/robots/apply.robots.response.policies.test.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type {
  ResponseFormat,
  ResponseKind,
} from "@app/appContext/appContext.types";

import { AppContext } from "@app/appContext/appContext";
import { applyRobotsResponsePolicies } from "@app/policies/response/robots/apply.robots.response.policies";
import { getRuntimeBehaviour } from "@utils/runtimeEnv.util";

jest.mock("@utils/runtimeEnv.util", () => ({
  getRuntimeBehaviour: jest.fn(),
}));

describe("applyRobotsResponsePolicies", () => {
  const mockedGetRuntimeBehaviour = jest.mocked(getRuntimeBehaviour);

  const createEnv = (): Env =>
    ({
      APP_ENV: "dev",
    }) as Env;

  const createAppContext = ({
    responseKind = "document",
    responseFormat = "html",
    env = createEnv(),
    document,
  }: {
    responseKind?: ResponseKind;
    responseFormat?: ResponseFormat;
    env?: Env;
    document?: {
      nonce?: string;
      robots?: string;
    };
  } = {}): AppContext =>
    new AppContext({
      responseKind,
      responseFormat,
      env,
      ...(document ? { document } : {}),
    });

  const createContext = ({
    response = new Response("hello", {
      status: 201,
      statusText: "Created",
      headers: {
        "x-custom-header": "value",
      },
    }),
    appContext = createAppContext(),
  }: {
    response?: Response;
    appContext?: AppContext;
  } = {}): ResponsePolicyContext => ({
    response,
    appContext,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("non-document responses", () => {
    it.each(["direct", "asset", "resource"] as const)(
      "returns the original response for %s responses",
      (responseKind) => {
        const response = new Response("hello", { status: 200 });
        const context = createContext({
          response,
          appContext: createAppContext({
            responseKind,
          }),
        });

        const result = applyRobotsResponsePolicies(context);

        expect(result).toBe(response);
        expect(mockedGetRuntimeBehaviour).not.toHaveBeenCalled();
      },
    );
  });

  describe("non-indexable runtime behaviour", () => {
    it("reads runtime behaviour from the app context env", () => {
      const env = createEnv();

      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: false,
        public: false,
        indexing: false,
      });

      const context = createContext({
        appContext: createAppContext({ env }),
      });

      applyRobotsResponsePolicies(context);

      expect(mockedGetRuntimeBehaviour).toHaveBeenCalledTimes(1);
      expect(mockedGetRuntimeBehaviour).toHaveBeenCalledWith(env);
    });

    it("sets strict non-indexable directives for document responses when runtime indexing is disabled", () => {
      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: false,
        public: false,
        indexing: false,
      });

      const context = createContext({
        appContext: createAppContext({
          document: {
            robots: "index, follow",
          },
        }),
      });

      const result = applyRobotsResponsePolicies(context);

      expect(result.headers.get("x-robots-tag")).toBe(
        "noindex, nofollow, noarchive, nosnippet, noimageindex",
      );
    });

    it("overrides document-level robots directives when runtime indexing is disabled", () => {
      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: false,
        public: false,
        indexing: false,
      });

      const context = createContext({
        appContext: createAppContext({
          document: {
            robots: "index, follow",
          },
        }),
      });

      const result = applyRobotsResponsePolicies(context);

      expect(result.headers.get("x-robots-tag")).toBe(
        "noindex, nofollow, noarchive, nosnippet, noimageindex",
      );
      expect(result.headers.get("x-robots-tag")).not.toBe("index, follow");
    });
  });

  describe("indexable runtime behaviour", () => {
    it("sets x-robots-tag from the document robots directives when runtime indexing is enabled", () => {
      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: true,
        public: true,
        indexing: true,
      });

      const context = createContext({
        appContext: createAppContext({
          document: {
            robots: "index, follow, max-image-preview:large",
          },
        }),
      });

      const result = applyRobotsResponsePolicies(context);

      expect(result.headers.get("x-robots-tag")).toBe(
        "index, follow, max-image-preview:large",
      );
    });

    it("returns the original response when runtime indexing is enabled and no document robots directives exist", () => {
      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: true,
        public: true,
        indexing: true,
      });

      const response = new Response("hello", { status: 200 });

      const context = createContext({
        response,
        appContext: createAppContext(),
      });

      const result = applyRobotsResponsePolicies(context);

      expect(result).toBe(response);
    });

    it("returns the original response when runtime indexing is enabled and document robots directives are undefined", () => {
      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: true,
        public: true,
        indexing: true,
      });

      const response = new Response("hello", { status: 200 });

      const context = createContext({
        response,
        appContext: createAppContext({
          document: {},
        }),
      });

      const result = applyRobotsResponsePolicies(context);

      expect(result).toBe(response);
    });
  });

  describe("response rebuilding behaviour", () => {
    it("preserves unrelated headers when adding x-robots-tag", () => {
      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: true,
        public: true,
        indexing: true,
      });

      const context = createContext({
        appContext: createAppContext({
          document: {
            robots: "index, follow",
          },
        }),
      });

      const result = applyRobotsResponsePolicies(context);

      expect(result.headers.get("x-custom-header")).toBe("value");
    });

    it("preserves status and statusText when rebuilding the response", () => {
      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: true,
        public: true,
        indexing: true,
      });

      const context = createContext({
        appContext: createAppContext({
          document: {
            robots: "index, follow",
          },
        }),
      });

      const result = applyRobotsResponsePolicies(context);

      expect(result.status).toBe(201);
      expect(result.statusText).toBe("Created");
    });

    it("preserves the response body when rebuilding the response", async () => {
      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: true,
        public: true,
        indexing: true,
      });

      const context = createContext({
        appContext: createAppContext({
          document: {
            robots: "index, follow",
          },
        }),
      });

      const result = applyRobotsResponsePolicies(context);

      await expect(result.text()).resolves.toBe("hello");
    });

    it("returns a new response instance when x-robots-tag is added", () => {
      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: true,
        public: true,
        indexing: true,
      });

      const response = new Response("hello", { status: 200 });

      const context = createContext({
        response,
        appContext: createAppContext({
          document: {
            robots: "index, follow",
          },
        }),
      });

      const result = applyRobotsResponsePolicies(context);

      expect(result).not.toBe(response);
    });

    it("overwrites an existing x-robots-tag header when applying directives", () => {
      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: true,
        public: true,
        indexing: true,
      });

      const response = new Response("hello", {
        status: 200,
        headers: {
          "x-robots-tag": "noindex",
        },
      });

      const context = createContext({
        response,
        appContext: createAppContext({
          document: {
            robots: "index, follow",
          },
        }),
      });

      const result = applyRobotsResponsePolicies(context);

      expect(result.headers.get("x-robots-tag")).toBe("index, follow");
    });

    it("exposes x-robots-tag in a case-insensitive way", () => {
      mockedGetRuntimeBehaviour.mockReturnValue({
        canonical: true,
        public: true,
        indexing: true,
      });

      const context = createContext({
        appContext: createAppContext({
          document: {
            robots: "index, follow",
          },
        }),
      });

      const result = applyRobotsResponsePolicies(context);

      expect(result.headers.get("X-Robots-Tag")).toBe("index, follow");
    });
  });
});
