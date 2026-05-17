// src/app-state/resolve/social.resolve.app-state.test.ts

import { appStateResolveSocial } from "@app-state/resolve/social.resolve.app-state";
import { authoredSocial } from "@app-state/config/social/authored.social.app-state";

describe("appStateResolveSocial", () => {
  it("uses authored social config", () => {
    expect(appStateResolveSocial).toBe(authoredSocial);
  });
});
