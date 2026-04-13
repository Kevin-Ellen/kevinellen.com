// tests/src/app-state/resolve/metadata-labels.resolve.app-state.test.ts

import { appStateResolveMetadataLabels } from "@app-state/resolve/metadata-labels.resolve.app-state";
import { appStateMetadataLabelsAuthored } from "@app-state/config/metadata-labels/authored.metadata-labels.app-state";

describe("appStateResolveMetadataLabels", () => {
  it("exposes the authored metadata labels unchanged", () => {
    expect(appStateResolveMetadataLabels).toEqual(
      appStateMetadataLabelsAuthored,
    );
  });

  it("preserves the authored metadata labels reference", () => {
    expect(appStateResolveMetadataLabels).toBe(appStateMetadataLabelsAuthored);
  });
});
