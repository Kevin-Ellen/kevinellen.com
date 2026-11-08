// src/app/life-cycle/app-render-context/class.app-render-context.test.ts

import { AppRenderContext } from "./class.app-render-context";

type Context = ConstructorParameters<typeof AppRenderContext>[0];

describe("AppRenderContext class", () => {
  const createContext = (): Context =>
    ({
      metadata: {
        status: 200,
        nonce: "test-nonce",
      },
      document: {
        language: "en",
        head: {},
        page: {},
        end: {},
      },
    }) as unknown as Context;

  it("exposes response metadata", () => {
    const context = createContext();
    const appRenderContext = new AppRenderContext(context);

    expect(appRenderContext.metadata).toBe(context.metadata);
  });

  it("exposes the rendered document", () => {
    const context = createContext();
    const appRenderContext = new AppRenderContext(context);

    expect(appRenderContext.document).toBe(context.document);
  });

  it("returns the original context as its inspection snapshot", () => {
    const context = createContext();
    const appRenderContext = new AppRenderContext(context);

    expect(appRenderContext.toInspectionSnapshot).toBe(context);
  });

  it("preserves context references across repeated accesses", () => {
    const context = createContext();
    const appRenderContext = new AppRenderContext(context);

    expect(appRenderContext.metadata).toBe(appRenderContext.metadata);
    expect(appRenderContext.document).toBe(appRenderContext.document);

    expect(appRenderContext.toInspectionSnapshot).toBe(
      appRenderContext.toInspectionSnapshot,
    );
  });

  it("supports non-successful response metadata", () => {
    const context = createContext();

    const notFoundContext: Context = {
      ...context,
      metadata: {
        ...context.metadata,
        status: 404,
      },
    };

    const appRenderContext = new AppRenderContext(notFoundContext);

    expect(appRenderContext.metadata.status).toBe(404);
  });

  it("preserves the generated nonce", () => {
    const context = createContext();
    const appRenderContext = new AppRenderContext(context);

    expect(appRenderContext.metadata.nonce).toBe("test-nonce");
  });

  it("does not replace the constructor context", () => {
    const context = Object.freeze(createContext());
    const appRenderContext = new AppRenderContext(context);

    expect(appRenderContext.toInspectionSnapshot).toBe(context);
    expect(appRenderContext.metadata).toBe(context.metadata);
    expect(appRenderContext.document).toBe(context.document);
  });

  it("keeps independent context instances separate", () => {
    const firstContext = createContext();
    const secondContext = createContext();

    const first = new AppRenderContext(firstContext);
    const second = new AppRenderContext(secondContext);

    expect(first.toInspectionSnapshot).toBe(firstContext);
    expect(second.toInspectionSnapshot).toBe(secondContext);
    expect(first.metadata).not.toBe(second.metadata);
    expect(first.document).not.toBe(second.document);
  });
});
