// src/request/pre-request/assets/photo/config/robots/robots.photo-assets.pre-request.request.ts

export const resolvePhotoAssetRobotsResponseHeader = (
  env: Env,
): string | null => {
  if (env.APP_ENV === "prod") {
    return null;
  }

  return "noindex, nofollow, noarchive, nosnippet, noimageindex";
};
