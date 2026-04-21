// tests/src/app-context/resolve/breadcrumbs.resolve.app-context.test.ts

import { resolveBreadcrumbsAppContext } from "@app-context/resolve/breadcrumbs.resolve.app-context";
import { appStateCreate } from "@app-state/create.app-state";

const env = {
  APP_HOST: "dev.kevinellen.com",
} as Env;

describe("resolveBreadcrumbsAppContext", () => {
  it("resolves parent breadcrumb items for a public page and sets the current label", () => {
    const appState = appStateCreate(env);

    const result = resolveBreadcrumbsAppContext(
      ["home", "about", "about-equipment"],
      appState,
    );

    expect(result).toEqual({
      items: [
        {
          kind: "internal",
          id: "home",
          svgId: null,
          behaviour: {
            openInNewTab: false,
          },
          href: "/",
          text: "Home",
        },
        {
          kind: "internal",
          id: "about",
          svgId: null,
          behaviour: {
            openInNewTab: false,
          },
          href: "/about",
          text: "About",
        },
      ],
      current: "Equipment",
    });
  });

  it("resolves an error breadcrumb chain using the error page title as the current label", () => {
    const appState = appStateCreate(env);

    const result = resolveBreadcrumbsAppContext(
      ["home", "error-404"],
      appState,
    );

    expect(result.items).toEqual([
      {
        kind: "internal",
        id: "home",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
        href: "/",
        text: "Home",
      },
    ]);

    expect(result.current).toBe("404 | Page not found");
  });

  it("throws when breadcrumbs are empty", () => {
    const appState = appStateCreate(env);

    expect(() => resolveBreadcrumbsAppContext([] as never, appState)).toThrow(
      "Breadcrumbs must contain at least one item.",
    );
  });

  it("throws when a parent breadcrumb id cannot be resolved", () => {
    const appState = appStateCreate(env);

    expect(() =>
      resolveBreadcrumbsAppContext(
        ["home", "missing-page" as never, "about"],
        appState,
      ),
    ).toThrow();
  });

  it("throws when the current breadcrumb id cannot be resolved", () => {
    const appState = appStateCreate(env);

    expect(() =>
      resolveBreadcrumbsAppContext(["home", "missing-page" as never], appState),
    ).toThrow("Missing page for breadcrumb id 'missing-page'.");
  });
});
