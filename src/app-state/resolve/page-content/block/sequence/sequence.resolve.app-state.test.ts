// src/app-state/resolve/page-content/block/sequence/sequence.resolve.app-state.test.ts

import { appStateResolveSequenceBlock } from "@app-state/resolve/page-content/block/sequence/sequence.resolve.app-state";

describe("appStateResolveSequenceBlock", () => {
  it("applies deterministic defaults", () => {
    expect(
      appStateResolveSequenceBlock({
        kind: "sequence",
        caption: [{ kind: "text", value: "A three-frame dive sequence." }],
        photos: {
          1: "photo-one",
          2: "photo-two",
          3: "photo-three",
        },
      } as never),
    ).toEqual({
      kind: "sequence",
      caption: [{ kind: "text", value: "A three-frame dive sequence." }],
      photos: {
        1: "photo-one",
        2: "photo-two",
        3: "photo-three",
      },
      immersive: false,
      flow: "breakout",
    });
  });

  it("preserves authored values", () => {
    expect(
      appStateResolveSequenceBlock({
        kind: "sequence",
        immersive: true,
        flow: "breakout",
        caption: [{ kind: "text", value: "A more immersive sequence." }],
        photos: {
          1: "photo-one",
          2: "photo-two",
        },
      } as never),
    ).toEqual({
      kind: "sequence",
      immersive: true,
      flow: "breakout",
      caption: [{ kind: "text", value: "A more immersive sequence." }],
      photos: {
        1: "photo-one",
        2: "photo-two",
      },
    });
  });
});
