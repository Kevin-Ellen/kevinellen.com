// src/app-render-context/shared/create-nonce.app-render-context.ts

export const createNonceAppRenderContext = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
};
