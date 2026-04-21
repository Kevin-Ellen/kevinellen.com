// tests/src/app-context/resolve/shared/links/social.link.shared.resolve.app-context.test.ts

import { resolveSocialLinkAppContext } from "@app-context/resolve/shared/links/social.link.shared.resolve.app-context";
import { appStateCreate } from "@app-state/create.app-state";

const makeEnv = (): Env =>
  ({
    APP_ENV: "dev",
    APP_HOST: "dev.kevinellen.com",
  }) as Env;

describe("resolveSocialLinkAppContext", () => {
  it("resolves href and text from social config", () => {
    const appState = appStateCreate(makeEnv());

    const result = resolveSocialLinkAppContext(
      {
        kind: "social",
        id: "github",
        svgId: "icon-github",
        behaviour: {
          openInNewTab: true,
        },
      },
      appState,
    );

    expect(result).toEqual({
      kind: "social",
      id: "github",
      svgId: "icon-github",
      behaviour: {
        openInNewTab: true,
      },
      href: "https://github.com/Kevin-Ellen",
      text: "GitHub",
    });
  });

  it("throws when the social config entry does not exist", () => {
    const appState = appStateCreate(makeEnv());

    expect(() =>
      resolveSocialLinkAppContext(
        {
          kind: "social",
          id: "missing-social" as never,
          svgId: null,
          behaviour: {
            openInNewTab: true,
          },
        },
        appState,
      ),
    ).toThrow("Missing social config for social link id 'missing-social'.");
  });
});
