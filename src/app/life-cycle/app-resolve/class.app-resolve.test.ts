// src/app/life-cycle/app-resolve/class.app-resolve.test.ts

import { AppResolve, type AppResolveContext } from "./class.app-resolve";

describe("AppResolve class", () => {
  const createContext = (): AppResolveContext =>
    ({
      site: {
        title: "Kevin Ellen",
      },
      registries: {
        content: {
          bySlug: {},
          errorsByStatus: {},
        },
        scripts: {},
        svg: {},
        structuredData: [],
      },
      shell: {
        navigation: {},
        footer: {},
      },
      content: {
        id: "home",
        status: 200,
      },
    }) as unknown as AppResolveContext;

  it("exposes the content status", () => {
    const context = createContext();
    const appResolve = new AppResolve(context);

    expect(appResolve.status).toBe(200);
  });

  it("exposes the resolved site configuration", () => {
    const context = createContext();
    const appResolve = new AppResolve(context);

    expect(appResolve.site).toBe(context.site);
  });

  it("exposes the resolved content", () => {
    const context = createContext();
    const appResolve = new AppResolve(context);

    expect(appResolve.content).toBe(context.content);
  });

  it("exposes the scripts registry", () => {
    const context = createContext();
    const appResolve = new AppResolve(context);

    expect(appResolve.scripts).toBe(context.registries.scripts);
  });

  it("exposes the SVG registry", () => {
    const context = createContext();
    const appResolve = new AppResolve(context);

    expect(appResolve.svgs).toBe(context.registries.svg);
  });

  it("exposes the resolved shell", () => {
    const context = createContext();
    const appResolve = new AppResolve(context);

    expect(appResolve.shell).toBe(context.shell);
  });

  it("exposes the structured-data registry", () => {
    const context = createContext();
    const appResolve = new AppResolve(context);

    expect(appResolve.structuredData).toBe(context.registries.structuredData);
  });

  it("returns the original context as its inspection snapshot", () => {
    const context = createContext();
    const appResolve = new AppResolve(context);

    expect(appResolve.toInspectionSnapshot).toBe(context);
  });

  it("preserves a non-successful content status", () => {
    const context = createContext();

    const notFoundContext = {
      ...context,
      content: {
        ...context.content,
        status: 404,
      },
    } as AppResolveContext;

    const appResolve = new AppResolve(notFoundContext);

    expect(appResolve.status).toBe(404);
  });

  it("does not create a new inspection snapshot on each access", () => {
    const context = createContext();
    const appResolve = new AppResolve(context);

    expect(appResolve.toInspectionSnapshot).toBe(
      appResolve.toInspectionSnapshot,
    );
  });

  it("retains the original context even if the supplied object changes", () => {
    const context = createContext();
    const appResolve = new AppResolve(context);

    expect(appResolve.toInspectionSnapshot).toBe(context);
    expect(appResolve.content).toBe(context.content);
  });
});
