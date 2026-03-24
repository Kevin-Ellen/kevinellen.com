// tests/src/app/policies/response/apply.response.policies.test.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

import { AppContext } from "@app/appContext/appContext";

import { applyResponsePolicies } from "@app/policies/response/apply.response.policies";

import { applyBaseResponsePolicies } from "@app/policies/response/base/apply.base.response.policies";
import { applyContentTypeResponsePolicies } from "@app/policies/response/content-type/apply.content-type.response.policies";
import { applySecurityResponsePolicies } from "@app/policies/response/security/apply.security.response.policies";
import { applyRobotsResponsePolicies } from "@app/policies/response/robots/apply.robots.response.policies";
import { applyCspResponsePolicies } from "@app/policies/response/security/apply.csp.response.policies";
import { applyCachingResponsePolicies } from "@app/policies/response/caching/apply.caching.response.policies";

jest.mock("@app/policies/response/base/apply.base.response.policies", () => ({
  applyBaseResponsePolicies: jest.fn(),
}));

jest.mock(
  "@app/policies/response/content-type/apply.content-type.response.policies",
  () => ({
    applyContentTypeResponsePolicies: jest.fn(),
  }),
);

jest.mock(
  "@app/policies/response/security/apply.security.response.policies",
  () => ({
    applySecurityResponsePolicies: jest.fn(),
  }),
);

jest.mock(
  "@app/policies/response/robots/apply.robots.response.policies",
  () => ({
    applyRobotsResponsePolicies: jest.fn(),
  }),
);

jest.mock(
  "@app/policies/response/security/apply.csp.response.policies",
  () => ({
    applyCspResponsePolicies: jest.fn(),
  }),
);

jest.mock(
  "@app/policies/response/caching/apply.caching.response.policies",
  () => ({
    applyCachingResponsePolicies: jest.fn(),
  }),
);

describe("applyResponsePolicies", () => {
  const mockedApplyBase = jest.mocked(applyBaseResponsePolicies);
  const mockedApplyContentType = jest.mocked(applyContentTypeResponsePolicies);
  const mockedApplySecurity = jest.mocked(applySecurityResponsePolicies);
  const mockedApplyRobots = jest.mocked(applyRobotsResponsePolicies);
  const mockedApplyCsp = jest.mocked(applyCspResponsePolicies);
  const mockedApplyCaching = jest.mocked(applyCachingResponsePolicies);

  const createAppContext = (): AppContext =>
    new AppContext({
      responseKind: "document",
      responseFormat: "html",
      env: { APP_ENV: "dev" } as Env,
      document: {
        robots: "noindex, nofollow",
        nonce: "test-nonce",
      },
    });

  const createContext = (
    response = new Response("initial", { status: 200 }),
  ): ResponsePolicyContext => ({
    response,
    appContext: createAppContext(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies response policies in deterministic order", () => {
    const order: string[] = [];

    mockedApplyBase.mockImplementation((context) => {
      order.push("base");
      return context.response;
    });

    mockedApplyContentType.mockImplementation((context) => {
      order.push("content-type");
      return context.response;
    });

    mockedApplySecurity.mockImplementation((context) => {
      order.push("security");
      return context.response;
    });

    mockedApplyRobots.mockImplementation((context) => {
      order.push("robots");
      return context.response;
    });

    mockedApplyCsp.mockImplementation((context) => {
      order.push("csp");
      return context.response;
    });

    mockedApplyCaching.mockImplementation((context) => {
      order.push("caching");
      return context.response;
    });

    applyResponsePolicies(createContext());

    expect(order).toEqual([
      "base",
      "content-type",
      "security",
      "robots",
      "csp",
      "caching",
    ]);
  });

  it("passes the evolving response through each policy stage", () => {
    const baseResponse = new Response("base", { status: 200 });
    const contentTypeResponse = new Response("content-type", { status: 200 });
    const securityResponse = new Response("security", { status: 200 });
    const robotsResponse = new Response("robots", { status: 200 });
    const cspResponse = new Response("csp", { status: 200 });
    const cachingResponse = new Response("caching", { status: 200 });

    mockedApplyBase.mockReturnValue(baseResponse);
    mockedApplyContentType.mockReturnValue(contentTypeResponse);
    mockedApplySecurity.mockReturnValue(securityResponse);
    mockedApplyRobots.mockReturnValue(robotsResponse);
    mockedApplyCsp.mockReturnValue(cspResponse);
    mockedApplyCaching.mockReturnValue(cachingResponse);

    const initialResponse = new Response("initial", { status: 200 });
    const context = createContext(initialResponse);
    const originalAppContext = context.appContext;

    const result = applyResponsePolicies(context);

    expect(mockedApplyBase).toHaveBeenCalledWith({
      ...context,
      response: initialResponse,
    });

    expect(mockedApplyContentType).toHaveBeenCalledWith({
      ...context,
      response: baseResponse,
    });

    expect(mockedApplySecurity).toHaveBeenCalledWith({
      ...context,
      response: contentTypeResponse,
    });

    expect(mockedApplyRobots).toHaveBeenCalledWith({
      ...context,
      response: securityResponse,
    });

    expect(mockedApplyCsp).toHaveBeenCalledWith({
      ...context,
      response: robotsResponse,
    });

    expect(mockedApplyCaching).toHaveBeenCalledWith({
      ...context,
      response: cspResponse,
    });

    expect(result).toBe(cachingResponse);

    expect(mockedApplyBase.mock.calls[0]?.[0].appContext).toBe(
      originalAppContext,
    );
    expect(mockedApplyContentType.mock.calls[0]?.[0].appContext).toBe(
      originalAppContext,
    );
    expect(mockedApplySecurity.mock.calls[0]?.[0].appContext).toBe(
      originalAppContext,
    );
    expect(mockedApplyRobots.mock.calls[0]?.[0].appContext).toBe(
      originalAppContext,
    );
    expect(mockedApplyCsp.mock.calls[0]?.[0].appContext).toBe(
      originalAppContext,
    );
    expect(mockedApplyCaching.mock.calls[0]?.[0].appContext).toBe(
      originalAppContext,
    );
  });

  it("does not require a separate status field in the context", () => {
    mockedApplyBase.mockImplementation((context) => context.response);
    mockedApplyContentType.mockImplementation((context) => context.response);
    mockedApplySecurity.mockImplementation((context) => context.response);
    mockedApplyRobots.mockImplementation((context) => context.response);
    mockedApplyCsp.mockImplementation((context) => context.response);
    mockedApplyCaching.mockImplementation((context) => context.response);

    const response = new Response(null, { status: 204 });
    const context = createContext(response);

    expect(() => applyResponsePolicies(context)).not.toThrow();
  });
});
