// tests/src/app-context/resolve/shared/links/internal.link.shared.resolve.app-context.test.ts

import { resolveInternalLinkAppContext } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";

import { appStateCreate } from "@app-state/create.app-state";

const makeEnv = (): Env =>
  ({
    APP_ENV: "dev",
    APP_HOST: "dev.kevinellen.com",
  }) as Env;

describe("resolveInternalLinkAppContext", () => {
  it("resolves href and text from the linked public page", () => {
    const appState = appStateCreate(makeEnv());

    const result = resolveInternalLinkAppContext(
      {
        kind: "internal",
        id: "about",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
      appState,
    );

    expect(result).toEqual({
      kind: "internal",
      id: "about",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
      href: "/about",
      text: "About",
    });
  });

  it("throws when the link is invalid", () => {
    const appState = appStateCreate(makeEnv());

    expect(() =>
      resolveInternalLinkAppContext(null as never, appState),
    ).toThrow("Invalid AppStateInternalLink: null");
  });

  it("throws when the link id is null", () => {
    const appState = appStateCreate(makeEnv());

    expect(() =>
      resolveInternalLinkAppContext(
        {
          kind: "internal",
          id: null,
          svgId: null,
          behaviour: {
            openInNewTab: false,
          },
        } as never,
        appState,
      ),
    ).toThrow(
      `Invalid AppStateInternalLink: ${JSON.stringify({
        kind: "internal",
        id: null,
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      })}`,
    );
  });

  it("throws when the linked public page does not exist", () => {
    const appState = appStateCreate(makeEnv());

    expect(() =>
      resolveInternalLinkAppContext(
        {
          kind: "internal",
          id: "missing-page" as never,
          svgId: null,
          behaviour: {
            openInNewTab: false,
          },
        },
        appState,
      ),
    ).toThrow("Missing public page for internal link id 'missing-page'.");
  });

  it("throws when the linked public page is missing a slug", () => {
    const appState = {
      getPublicPageById: jest.fn().mockReturnValue({
        id: "about",
        label: "About",
        slug: null,
      }),
    } as never;

    expect(() =>
      resolveInternalLinkAppContext(
        {
          kind: "internal",
          id: "about",
          svgId: null,
          behaviour: {
            openInNewTab: false,
          },
        },
        appState,
      ),
    ).toThrow("Public page 'about' is missing a slug.");
  });
});
