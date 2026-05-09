// src/app-state/resolve/metadata-labels.resolve.app-state.test.ts

import { appStateResolveMetadataLabels } from "@app-state/resolve/metadata-labels.resolve.app-state";
import { appStateMetadataLabelsAuthored } from "@app-state/config/metadata-labels/authored.metadata-labels.app-state";

describe("appStateResolveMetadataLabels", () => {
  it("uses authored metadata labels", () => {
    expect(appStateResolveMetadataLabels).toBe(appStateMetadataLabelsAuthored);
  });
});
