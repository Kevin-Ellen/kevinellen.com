// src/request/pre-request/photo-assets/types/photo-assets.pre-request.request.types.ts

export type PhotoAssetRequest = {
  imageId: string;
  variant: string;
};

export type PhotoAssetResolution =
  | {
      outcome: "continue";
    }
  | {
      outcome: "asset";
      asset: PhotoAssetRequest;
    };
