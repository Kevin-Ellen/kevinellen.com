// src/app/handlers/photo.handler.ts

const matchPhotoPath = (
  pathname: string,
): { imageId: string; variant: string } | null => {
  const match = /^\/photo\/([^/]+)\/([^/]+)$/.exec(pathname);

  if (!match) {
    return null;
  }

  const [, imageId, variant] = match;

  return { imageId, variant };
};

const buildCloudflareImageUrl = (
  accountHash: string,
  imageId: string,
  variant: string,
): string => {
  return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`;
};

export const photoHandler = async (
  env: Env,
  pathname: string,
): Promise<Response | null> => {
  const route = matchPhotoPath(pathname);

  if (!env.CF_ACCOUNT_ID) {
    throw new Error("Photo: CF Account ID not set");
  }

  if (!route) {
    return null;
  }

  const imageUrl = buildCloudflareImageUrl(
    env.CF_ACCOUNT_ID,
    route.imageId,
    route.variant,
  );

  const upstreamResponse = await fetch(imageUrl);

  const headers = new Headers(upstreamResponse.headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  });
};
