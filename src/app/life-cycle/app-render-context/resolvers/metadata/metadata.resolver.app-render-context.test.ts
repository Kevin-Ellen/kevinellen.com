// src/app/life-cycle/app-render-context/resolvers/metadata/metadata.resolver.app-render-context.test.ts

import { resolveMetadataAppRenderContext } from "./metadata.resolver.app-render-context";

describe("Metadata AppRenderContext resolver", () => {
  it("preserves a successful HTTP status", () => {
    const result = resolveMetadataAppRenderContext({
      status: 200,
    });

    expect(result.status).toBe(200);
  });

  it.each([301, 400, 403, 404, 500])("preserves HTTP status %i", (status) => {
    const result = resolveMetadataAppRenderContext({
      status,
    });

    expect(result.status).toBe(status);
  });

  it("generates a valid Base64 nonce", () => {
    const result = resolveMetadataAppRenderContext({
      status: 200,
    });

    expect(result.nonce).toMatch(/^[A-Za-z0-9+/]{22}==$/);
  });

  it("generates a nonce containing exactly 16 bytes", () => {
    const result = resolveMetadataAppRenderContext({
      status: 200,
    });

    const decoded = atob(result.nonce);

    expect(decoded).toHaveLength(16);
  });

  it("generates a new nonce for every resolution", () => {
    const first = resolveMetadataAppRenderContext({
      status: 200,
    });

    const second = resolveMetadataAppRenderContext({
      status: 200,
    });

    expect(first.nonce).not.toBe(second.nonce);
  });

  it("generates a nonce independently of the HTTP status", () => {
    const success = resolveMetadataAppRenderContext({
      status: 200,
    });

    const notFound = resolveMetadataAppRenderContext({
      status: 404,
    });

    expect(atob(success.nonce)).toHaveLength(16);
    expect(atob(notFound.nonce)).toHaveLength(16);
  });

  it("returns a new metadata object on each resolution", () => {
    const first = resolveMetadataAppRenderContext({
      status: 200,
    });

    const second = resolveMetadataAppRenderContext({
      status: 200,
    });

    expect(first).not.toBe(second);
  });
});
