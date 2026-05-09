// src/app-render-context/shared/create-nonce.app-render-context.test.ts

import { createNonceAppRenderContext } from "@app-render-context/shared/create-nonce.app-render-context";

describe("createNonceAppRenderContext", () => {
  it("creates a 32 character hex nonce", () => {
    const nonce = createNonceAppRenderContext();

    expect(nonce).toMatch(/^[a-f0-9]{32}$/);
  });

  it("creates unique nonces", () => {
    expect(createNonceAppRenderContext()).not.toBe(
      createNonceAppRenderContext(),
    );
  });
});
