// src/app/policies/csp.policy.ts

import type { RenderedInlineAsset } from "@types-src/renderedDocument.types";

const toBase64 = (bytes: Uint8Array): string => {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
};

const createSha256Hash = async (content: string): Promise<string> => {
  const encoded = new TextEncoder().encode(content);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  return `sha256-${toBase64(new Uint8Array(digest))}`;
};

const buildCspHeader = async (
  inlineAssets: RenderedInlineAsset[],
): Promise<string> => {
  const scriptHashes = new Set<string>();
  const styleHashes = new Set<string>();

  for (const asset of inlineAssets) {
    const hash = await createSha256Hash(asset.content);

    if (asset.kind === "script") {
      scriptHashes.add(`'${hash}'`);
    }

    if (asset.kind === "style") {
      styleHashes.add(`'${hash}'`);
    }
  }

  const directives = [
    `default-src 'self'`,
    `script-src 'self' ${Array.from(scriptHashes).join(" ")}`.trim(),
    `style-src 'self' ${Array.from(styleHashes).join(" ")}`.trim(),
    `img-src 'self' https: data:`,
    `font-src 'self' https: data:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `frame-ancestors 'none'`,
  ];

  return directives.join("; ");
};

export default buildCspHeader;
