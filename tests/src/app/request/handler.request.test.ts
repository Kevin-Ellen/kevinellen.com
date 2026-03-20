// tests/src/app/request/handler.request.test.ts

import { AppState } from "@app/appState/appState";
import { createTestAppSeed } from "@src/app/bootstrap/appSeed.test.create";

import { handleRequest } from "@app/request/handler.request";
import { routeRequest } from "@app/request/router.request";

jest.mock("@app/request/router.request", () => ({
  routeRequest: jest.fn(),
}));

describe("handleRequest", () => {
  const mockedRouteRequest = jest.mocked(routeRequest);
  let appState: AppState;

  beforeEach(async () => {
    jest.clearAllMocks();

    const appSeed = await createTestAppSeed();
    appState = new AppState(appSeed);
  });

  it("returns the 404 page via getErrorPageByStatus(404) with status 404 when the router returns not-found", async () => {
    const expectedErrorPage = appState.getErrorPageByStatus(404);
    const getErrorPageByStatusSpy = jest.spyOn(
      appState,
      "getErrorPageByStatus",
    );

    mockedRouteRequest.mockReturnValue({
      kind: "not-found",
    });

    const request = new Request("https://example.com/does-not-exist");
    const response = await handleRequest(
      request,
      {} as Env,
      {} as ExecutionContext,
      appState,
    );

    expect(mockedRouteRequest).toHaveBeenCalledTimes(1);
    expect(mockedRouteRequest).toHaveBeenCalledWith(
      "/does-not-exist",
      appState,
    );

    expect(getErrorPageByStatusSpy).toHaveBeenCalledTimes(1);
    expect(getErrorPageByStatusSpy).toHaveBeenCalledWith(404);
    expect(getErrorPageByStatusSpy).not.toHaveBeenCalledWith(500);

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );

    const body = await response.json();
    expect(body).toEqual(expectedErrorPage);
  });

  it("returns the 500 page via getErrorPageByStatus(500) with status 500 when an unexpected error is thrown", async () => {
    const expectedErrorPage = appState.getErrorPageByStatus(500);
    const getErrorPageByStatusSpy = jest.spyOn(
      appState,
      "getErrorPageByStatus",
    );

    mockedRouteRequest.mockImplementation(() => {
      throw new Error("Boom");
    });

    const request = new Request("https://example.com/");
    const response = await handleRequest(
      request,
      {} as Env,
      {} as ExecutionContext,
      appState,
    );

    expect(mockedRouteRequest).toHaveBeenCalledTimes(1);
    expect(mockedRouteRequest).toHaveBeenCalledWith("/", appState);

    expect(getErrorPageByStatusSpy).toHaveBeenCalledTimes(1);
    expect(getErrorPageByStatusSpy).toHaveBeenCalledWith(500);
    expect(getErrorPageByStatusSpy).not.toHaveBeenCalledWith(404);

    expect(response.status).toBe(500);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );

    const body = await response.json();
    expect(body).toEqual(expectedErrorPage);
  });

  it("returns the resolved page with status 200 when the router returns found", async () => {
    const getErrorPageByStatusSpy = jest.spyOn(
      appState,
      "getErrorPageByStatus",
    );

    const homePage = appState.getPageBySlug("/");

    if (!homePage) {
      throw new Error('Test setup failed: expected home page at "/" to exist.');
    }

    mockedRouteRequest.mockReturnValue({
      kind: "found",
      page: homePage,
    });

    const request = new Request("https://example.com/");
    const response = await handleRequest(
      request,
      {} as Env,
      {} as ExecutionContext,
      appState,
    );

    expect(mockedRouteRequest).toHaveBeenCalledTimes(1);
    expect(mockedRouteRequest).toHaveBeenCalledWith("/", appState);

    expect(getErrorPageByStatusSpy).not.toHaveBeenCalled();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );

    const body = await response.json();
    expect(body).toEqual(homePage);
  });
});
