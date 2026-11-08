// src/app/life-cycle/life-cycle.test.ts

import { handleLifeCycle } from "./life-cycle";

import type { ValidatedEnv } from "../entry.type";

import { resolveInspectStage, inspectLifeCycle } from "./inspect/inspect";

import { handleRequest } from "./request/request";
import { createAppInit } from "./app-init/app-init";
import { handleResponse } from "./response/response";
import { handleRouting } from "./routing/routing";
import { handleSystem } from "./system/system";
import { createAppResolve } from "./app-resolve/app-resolve";
import { createAppRenderContext } from "./app-render-context/app-render-context";
import { appRender } from "./app-render/app-render";

jest.mock("./inspect/inspect", () => ({
  resolveInspectStage: jest.fn(),
  inspectLifeCycle: jest.fn(),
}));

jest.mock("./request/request", () => ({
  handleRequest: jest.fn(),
}));

jest.mock("./app-init/app-init", () => ({
  createAppInit: jest.fn(),
}));

jest.mock("./response/response", () => ({
  handleResponse: jest.fn(),
}));

jest.mock("./routing/routing", () => ({
  handleRouting: jest.fn(),
}));

jest.mock("./system/system", () => ({
  handleSystem: jest.fn(),
}));

jest.mock("./app-resolve/app-resolve", () => ({
  createAppResolve: jest.fn(),
}));

jest.mock("./app-render-context/app-render-context", () => ({
  createAppRenderContext: jest.fn(),
}));

jest.mock("./app-render/app-render", () => ({
  appRender: jest.fn(),
}));

const mockedResolveInspectStage = jest.mocked(resolveInspectStage);
const mockedInspectLifeCycle = jest.mocked(inspectLifeCycle);
const mockedHandleRequest = jest.mocked(handleRequest);
const mockedCreateAppInit = jest.mocked(createAppInit);
const mockedHandleResponse = jest.mocked(handleResponse);
const mockedHandleRouting = jest.mocked(handleRouting);
const mockedHandleSystem = jest.mocked(handleSystem);
const mockedCreateAppResolve = jest.mocked(createAppResolve);
const mockedCreateAppRenderContext = jest.mocked(createAppRenderContext);
const mockedAppRender = jest.mocked(appRender);

/*
 * Lifecycle stage implementations are mocked.
 *
 * These fixtures are boundary sentinels rather than complete
 * domain objects. The individual stage test suites own schema
 * validation; this suite owns orchestration.
 */
type RequestResult = ReturnType<typeof handleRequest>;
type RoutingResult = Awaited<ReturnType<typeof handleRouting>>;
type AppInit = ReturnType<typeof createAppInit>;
type AppResolve = Awaited<ReturnType<typeof createAppResolve>>;
type RenderContext = ReturnType<typeof createAppRenderContext>;
type InspectStage = ReturnType<typeof resolveInspectStage>;
type InspectionResult = ReturnType<typeof inspectLifeCycle>;
type SystemResult = ReturnType<typeof handleSystem>;
type RenderResult = ReturnType<typeof appRender>;

describe("handleLifeCycle", () => {
  const request = new Request("https://kevinellen.com/journal/viru-bog");

  const env = {
    INSPECT_ENABLED: "false",
  } as ValidatedEnv;

  const response = new Response("Lifecycle response", {
    status: 200,
  });

  const appInit = {
    toInspectionSnapshot: {
      stage: "app-init",
    },
  } as unknown as AppInit;

  const routingResult = {
    kind: "page",
  } as unknown as RoutingResult;

  const appResolve = {
    toInspectionSnapshot: {
      stage: "app-resolve",
    },
  } as unknown as AppResolve;

  const renderContext = {
    toInspectionSnapshot: {
      stage: "app-render-context",
    },
  } as unknown as RenderContext;

  const renderResult = {
    kind: "html",
    status: 200,
    body: "<!DOCTYPE html><html></html>",
    nonce: "test-nonce",
  } as RenderResult;

  const inspectionResult = {
    kind: "json",
    status: 200,
    body: "{}",
  } as unknown as InspectionResult;

  const createRequestResult = (): RequestResult => ({
    ok: true,
    request,
  });

  const execute = async (environment: ValidatedEnv = env): Promise<Response> =>
    handleLifeCycle({
      request,
      env: environment,
    });

  beforeEach(() => {
    jest.clearAllMocks();

    mockedHandleRequest.mockReturnValue(createRequestResult());

    mockedResolveInspectStage.mockReturnValue(null as InspectStage);

    mockedCreateAppInit.mockReturnValue(appInit);

    mockedHandleRouting.mockResolvedValue(routingResult);

    mockedCreateAppResolve.mockResolvedValue(appResolve);

    mockedCreateAppRenderContext.mockReturnValue(renderContext);

    mockedAppRender.mockReturnValue(renderResult);

    mockedInspectLifeCycle.mockReturnValue(inspectionResult);

    mockedHandleResponse.mockReturnValue(response);
  });

  describe("Request handling", () => {
    it("passes the original request and environment to handleRequest", async () => {
      await execute();

      expect(mockedHandleRequest).toHaveBeenCalledTimes(1);

      expect(mockedHandleRequest).toHaveBeenCalledWith({
        request,
        env,
      });
    });

    it("returns redirect responses without initialising the application", async () => {
      mockedHandleRequest.mockReturnValue({
        ok: false,
        reason: "REDIRECT",
        status: 301,
        location: "https://kevinellen.com/journal",
      });

      const result = await execute();

      expect(result).toBe(response);

      expect(mockedHandleResponse).toHaveBeenCalledWith({
        result: {
          kind: "redirect",
          status: 301,
          location: "https://kevinellen.com/journal",
        },
      });

      expect(mockedResolveInspectStage).not.toHaveBeenCalled();
      expect(mockedCreateAppInit).not.toHaveBeenCalled();
      expect(mockedHandleRouting).not.toHaveBeenCalled();
      expect(mockedAppRender).not.toHaveBeenCalled();
    });

    it("forwards non-redirect request failures unchanged", async () => {
      const failure = {
        ok: false,
        reason: "INVALID_REQUEST",
        status: 400,
        kind: "txt",
        body: "Invalid request",
      } as unknown as RequestResult;

      mockedHandleRequest.mockReturnValue(failure);

      const result = await execute();

      expect(result).toBe(response);

      expect(mockedHandleResponse).toHaveBeenCalledWith({
        result: failure,
      });

      expect(mockedCreateAppInit).not.toHaveBeenCalled();
      expect(mockedHandleRouting).not.toHaveBeenCalled();
      expect(mockedCreateAppResolve).not.toHaveBeenCalled();
    });
  });

  describe("Inspection configuration", () => {
    it("disables inspection when the environment flag is false", async () => {
      await execute();

      expect(mockedResolveInspectStage).toHaveBeenCalledWith({
        url: new URL(request.url),
        enabled: false,
      });
    });

    it("enables inspection only when the flag is the string true", async () => {
      const enabledEnv = {
        ...env,
        INSPECT_ENABLED: "true",
      } as ValidatedEnv;

      await execute(enabledEnv);

      expect(mockedResolveInspectStage).toHaveBeenCalledWith({
        url: new URL(request.url),
        enabled: true,
      });
    });

    it("treats other flag values as disabled", async () => {
      const disabledEnv = {
        ...env,
        INSPECT_ENABLED: "TRUE",
      } as ValidatedEnv;

      await execute(disabledEnv);

      expect(mockedResolveInspectStage).toHaveBeenCalledWith({
        url: new URL(request.url),
        enabled: false,
      });
    });
  });

  describe("Application initialisation", () => {
    it("initialises the application with the environment", async () => {
      await execute();

      expect(mockedCreateAppInit).toHaveBeenCalledTimes(1);
      expect(mockedCreateAppInit).toHaveBeenCalledWith({ env });
    });

    it("returns the app-init inspection snapshot without routing", async () => {
      mockedResolveInspectStage.mockReturnValue("app-init");

      const result = await execute();

      expect(result).toBe(response);

      expect(mockedInspectLifeCycle).toHaveBeenCalledWith({
        stage: "app-init",
        data: appInit.toInspectionSnapshot,
      });

      expect(mockedHandleResponse).toHaveBeenCalledWith({
        result: inspectionResult,
      });

      expect(mockedHandleRouting).not.toHaveBeenCalled();
      expect(mockedCreateAppResolve).not.toHaveBeenCalled();
      expect(mockedCreateAppRenderContext).not.toHaveBeenCalled();
      expect(mockedAppRender).not.toHaveBeenCalled();
    });
  });

  describe("Routing", () => {
    it("passes the normalised request, environment and appInit to routing", async () => {
      const normalisedRequest = new Request("https://kevinellen.com/journal");

      mockedHandleRequest.mockReturnValue({
        ok: true,
        request: normalisedRequest,
      });

      await execute();

      expect(mockedHandleRouting).toHaveBeenCalledWith({
        request: normalisedRequest,
        env,
        appInit,
      });
    });

    it("handles system routes without resolving application content", async () => {
      const resolver = { id: "robots" };
      const ledger = { id: "request-ledger" };

      mockedHandleRouting.mockResolvedValue({
        kind: "system",
        resolver,
        ledger,
      } as unknown as RoutingResult);

      const systemResult = {
        kind: "txt",
        status: 200,
        body: "User-agent: *",
      } as SystemResult;

      mockedHandleSystem.mockReturnValue(systemResult);

      const result = await execute();

      expect(result).toBe(response);

      expect(mockedHandleSystem).toHaveBeenCalledWith({
        resolver,
        appInit,
        ledger,
      });

      expect(mockedHandleResponse).toHaveBeenCalledWith({
        result: systemResult,
      });

      expect(mockedCreateAppResolve).not.toHaveBeenCalled();
      expect(mockedCreateAppRenderContext).not.toHaveBeenCalled();
      expect(mockedAppRender).not.toHaveBeenCalled();
    });

    it("translates routing failures into text responses", async () => {
      mockedHandleRouting.mockResolvedValue({
        kind: "failure",
        status: 404,
        message: "Route not found",
      });

      const result = await execute();

      expect(result).toBe(response);

      expect(mockedHandleResponse).toHaveBeenCalledWith({
        result: {
          kind: "txt",
          status: 404,
          body: "Route not found",
        },
      });

      expect(mockedHandleSystem).not.toHaveBeenCalled();
      expect(mockedCreateAppResolve).not.toHaveBeenCalled();
      expect(mockedAppRender).not.toHaveBeenCalled();
    });
  });

  describe("Application resolution", () => {
    it("passes the resolved routing result to createAppResolve", async () => {
      await execute();

      expect(mockedCreateAppResolve).toHaveBeenCalledTimes(1);

      expect(mockedCreateAppResolve).toHaveBeenCalledWith({
        appInit,
        routing: routingResult,
        env,
      });
    });

    it("returns the app-resolve inspection snapshot before rendering", async () => {
      mockedResolveInspectStage.mockReturnValue("app-resolve");

      const result = await execute();

      expect(result).toBe(response);

      expect(mockedInspectLifeCycle).toHaveBeenCalledWith({
        stage: "app-resolve",
        data: appResolve.toInspectionSnapshot,
      });

      expect(mockedHandleResponse).toHaveBeenCalledWith({
        result: inspectionResult,
      });

      expect(mockedCreateAppRenderContext).not.toHaveBeenCalled();
      expect(mockedAppRender).not.toHaveBeenCalled();
    });
  });

  describe("AppRender context", () => {
    it("creates the rendering context from appResolve", async () => {
      await execute();

      expect(mockedCreateAppRenderContext).toHaveBeenCalledTimes(1);

      expect(mockedCreateAppRenderContext).toHaveBeenCalledWith({
        appResolve,
      });
    });

    it("returns the render-context inspection snapshot before HTML rendering", async () => {
      mockedResolveInspectStage.mockReturnValue("app-render-context");

      const result = await execute();

      expect(result).toBe(response);

      expect(mockedInspectLifeCycle).toHaveBeenCalledWith({
        stage: "app-render-context",
        data: renderContext.toInspectionSnapshot,
      });

      expect(mockedHandleResponse).toHaveBeenCalledWith({
        result: inspectionResult,
      });

      expect(mockedAppRender).not.toHaveBeenCalled();
    });
  });

  describe("HTML rendering", () => {
    it("renders the resolved application context", async () => {
      await execute();

      expect(mockedAppRender).toHaveBeenCalledTimes(1);
      expect(mockedAppRender).toHaveBeenCalledWith(renderContext);
    });

    it("passes the HTML render result to the response handler", async () => {
      const result = await execute();

      expect(result).toBe(response);

      expect(mockedHandleResponse).toHaveBeenCalledTimes(1);
      expect(mockedHandleResponse).toHaveBeenCalledWith({
        result: renderResult,
      });
    });

    it("does not invoke inspection output on a normal request", async () => {
      await execute();

      expect(mockedInspectLifeCycle).not.toHaveBeenCalled();
    });

    it("runs each lifecycle stage exactly once", async () => {
      await execute();

      expect(mockedHandleRequest).toHaveBeenCalledTimes(1);
      expect(mockedResolveInspectStage).toHaveBeenCalledTimes(1);
      expect(mockedCreateAppInit).toHaveBeenCalledTimes(1);
      expect(mockedHandleRouting).toHaveBeenCalledTimes(1);
      expect(mockedCreateAppResolve).toHaveBeenCalledTimes(1);
      expect(mockedCreateAppRenderContext).toHaveBeenCalledTimes(1);
      expect(mockedAppRender).toHaveBeenCalledTimes(1);
      expect(mockedHandleResponse).toHaveBeenCalledTimes(1);
    });

    it("returns the Response produced by handleResponse", async () => {
      const customResponse = new Response("Custom", {
        status: 201,
      });

      mockedHandleResponse.mockReturnValue(customResponse);

      const result = await execute();

      expect(result).toBe(customResponse);
      expect(result.status).toBe(201);
    });
  });
});
