// src/app/request/pre-request/photo-assets/policy/policy.photo-assets.pre-request.request.ts

export const photoAssetResponsePolicy = (response: Response): Response => {
  const headers = new Headers(response.headers);

  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("x-runtime-policy", "photo");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
