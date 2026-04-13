// tests/src/app-state/resolve/social.resolve.app-state.test.ts

import { appStateResolveSocial } from "@app-state/resolve/social.resolve.app-state";
import { authoredSocial } from "@app-state/config/social/authored.social.app-state";

describe("appStateResolveSocial", () => {
  it("exposes the authored social config unchanged", () => {
    expect(appStateResolveSocial).toEqual(authoredSocial);
  });

  it("preserves the authored social config reference", () => {
    expect(appStateResolveSocial).toBe(authoredSocial);
  });
});
