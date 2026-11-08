// src/app/life-cycle/app-init/class.app-init.test.ts

import type { AppInitContext } from "./class.app-init";
import { AppInit } from "./class.app-init";

describe("AppInit", () => {
  const createContext = (): AppInitContext =>
    ({
      site: { identifier: "site" },
      assets: { identifier: "assets" },
      person: { identifier: "person" },
      topics: { identifier: "topics" },
      navigation: { identifier: "navigation" },
      footer: { identifier: "footer" },
      robotsTxt: { identifier: "robotsTxt" },
      resources: { identifier: "resources" },
      content: { identifier: "content" },
    }) as unknown as AppInitContext;

  it("preserves the supplied site reference", () => {
    const context = createContext();
    const app = new AppInit(context);

    expect(app.site).toBe(context.site);
  });

  it("preserves the supplied person reference", () => {
    const context = createContext();
    const app = new AppInit(context);

    expect(app.person).toBe(context.person);
  });

  it("preserves the supplied robots.txt reference", () => {
    const context = createContext();
    const app = new AppInit(context);

    expect(app.robotsTxt).toBe(context.robotsTxt);
  });

  it("preserves the supplied content reference", () => {
    const context = createContext();
    const app = new AppInit(context);

    expect(app.content).toBe(context.content);
  });

  it("preserves the supplied assets reference", () => {
    const context = createContext();
    const app = new AppInit(context);

    expect(app.assets).toBe(context.assets);
  });

  it("preserves the supplied navigation reference", () => {
    const context = createContext();
    const app = new AppInit(context);

    expect(app.navigation).toBe(context.navigation);
  });

  it("preserves the supplied footer reference", () => {
    const context = createContext();
    const app = new AppInit(context);

    expect(app.footer).toBe(context.footer);
  });

  it("exposes the original context through the inspection getter", () => {
    const context = createContext();
    const app = new AppInit(context);

    expect(app.toInspectionSnapshot).toBe(context);
  });

  it("includes all context sections in the inspection snapshot", () => {
    const context = createContext();
    const app = new AppInit(context);

    expect(app.toInspectionSnapshot).toEqual(context);

    expect(Object.keys(app.toInspectionSnapshot)).toEqual([
      "site",
      "assets",
      "person",
      "topics",
      "navigation",
      "footer",
      "robotsTxt",
      "resources",
      "content",
    ]);
  });

  it("does not expose a copied context", () => {
    const context = createContext();
    const app = new AppInit(context);

    const first = app.toInspectionSnapshot;
    const second = app.toInspectionSnapshot;

    expect(first).toBe(context);
    expect(second).toBe(first);
  });

  it("supports a frozen context", () => {
    const context = Object.freeze(createContext());
    const app = new AppInit(context);

    expect(app.site).toBe(context.site);
    expect(app.toInspectionSnapshot).toBe(context);
  });

  it("keeps separate AppInit instances isolated", () => {
    const firstContext = createContext();
    const secondContext = createContext();

    const first = new AppInit(firstContext);
    const second = new AppInit(secondContext);

    expect(first.toInspectionSnapshot).toBe(firstContext);
    expect(second.toInspectionSnapshot).toBe(secondContext);
    expect(first.site).not.toBe(second.site);
  });
});
