// tests/src/app/request/handler.request.test.ts

import { handleRequest } from "@app/request/handler.request";
import { runRequestPolicies } from "@app/policies/request/run.request.policies";
import { resolveErrorRenderIntent } from "@app/request/resolve.error.render.intent";
import { routeDocumentRequest } from "@app/request/route.document.request";
import { renderDocumentRequest } from "@app/request/render.document.request";

import { createAppState } from "@app/appState/create.appState";

jest.mock("@app/policies/request/run.request.policies");
jest.mock("@app/request/resolve.error.render.intent");
jest.mock("@app/request/route.document.request");
jest.mock("@app/request/render.document.request");

const mockRunRequestPolicies = runRequestPolicies as jest.MockedFunction<
  typeof runRequestPolicies
>;

const mockResolveErrorRenderIntent =
  resolveErrorRenderIntent as jest.MockedFunction<
    typeof resolveErrorRenderIntent
  >;

const mockRouteDocumentRequest = routeDocumentRequest as jest.MockedFunction<
  typeof routeDocumentRequest
>;

const mockRenderDocumentRequest = renderDocumentRequest as jest.MockedFunction<
  typeof renderDocumentRequest
>;

describe("handleRequest", () => {
  const req = new Request("https://example.com/");
  const env = {
    APP_ENV: "prod",
    APP_HOST: "kevinellen.com",
  } as Env;
  const ctx = {} as ExecutionContext;
  const appState = createAppState();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns direct-response immediately when request policies return direct-response", async () => {
    const response = new Response("robots", { status: 200 });

    mockRunRequestPolicies.mockReturnValue({
      kind: "direct-response",
      response,
    });

    const result = await handleRequest(req, env, ctx, appState);

    expect(result).toBe(response);
    expect(mockResolveErrorRenderIntent).not.toHaveBeenCalled();
    expect(mockRouteDocumentRequest).not.toHaveBeenCalled();
    expect(mockRenderDocumentRequest).not.toHaveBeenCalled();
  });

  it("resolves and renders an error target when request policies return render-error", async () => {
    const target = {
      kind: "error-page" as const,
      status: 410 as const,
      page: appState.getErrorPageByStatus(410)!,
    };

    const response = new Response("gone", { status: 410 });

    mockRunRequestPolicies.mockReturnValue({
      kind: "render-error",
      intent: "gone",
    });

    mockResolveErrorRenderIntent.mockReturnValue(target);
    mockRenderDocumentRequest.mockResolvedValue(response);

    const result = await handleRequest(req, env, ctx, appState);

    expect(result).toBe(response);
    expect(mockResolveErrorRenderIntent).toHaveBeenCalledWith("gone", appState);
    expect(mockRouteDocumentRequest).not.toHaveBeenCalled();
    expect(mockRenderDocumentRequest).toHaveBeenCalledWith(
      req,
      env,
      ctx,
      appState,
      target,
    );
  });

  it("routes and renders a normal document when request policies continue", async () => {
    const target = {
      kind: "page" as const,
      status: 200 as const,
      page: appState.getPublicPageById("home")!,
    };

    const response = new Response("ok", { status: 200 });

    mockRunRequestPolicies.mockReturnValue({ kind: "continue" });
    mockRouteDocumentRequest.mockReturnValue(target);
    mockRenderDocumentRequest.mockResolvedValue(response);

    const result = await handleRequest(req, env, ctx, appState);

    expect(result).toBe(response);
    expect(mockRouteDocumentRequest).toHaveBeenCalledWith(req, appState);
    expect(mockRenderDocumentRequest).toHaveBeenCalledWith(
      req,
      env,
      ctx,
      appState,
      target,
    );
    expect(mockResolveErrorRenderIntent).not.toHaveBeenCalled();
  });
});
