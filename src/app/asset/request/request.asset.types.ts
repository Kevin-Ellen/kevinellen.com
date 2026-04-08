// src/app/asset/request/request.asset.types.ts

export type IconAssetFileName =
  | "apple-touch-icon.png"
  | "favicon.ico"
  | "favicon-96x96.png"
  | "ke-monogram-logo.svg"
  | "web-app-manifest-192x192.png"
  | "web-app-manifest-512x512.png";

export type AssetRequest =
  | {
      family: "icon";
      requestPath:
        | `/assets/icons/${IconAssetFileName}`
        | "/favicon.ico"
        | "/apple-touch-icon.png";
      assetPath: `/assets/icons/${IconAssetFileName}`;
      fileName: IconAssetFileName;
      extension: "png" | "svg" | "ico";
      contentType: "image/png" | "image/svg+xml" | "image/x-icon";
      cacheProfile: "icon";
    }
  | {
      family: "font";
      requestPath: `/assets/fonts/${string}.woff2`;
      assetPath: `/assets/fonts/${string}.woff2`;
      fileName: `${string}.woff2`;
      extension: "woff2";
      contentType: "font/woff2";
      cacheProfile: "font";
    }
  | {
      family: "image";
      requestPath: `/assets/images/${string}`;
      assetPath: `/assets/images/${string}`;
      fileName: string;
      extension: "png" | "jpg" | "jpeg" | "webp" | "avif";
      contentType: "image/png" | "image/jpeg" | "image/webp" | "image/avif";
      cacheProfile: "image";
    };
