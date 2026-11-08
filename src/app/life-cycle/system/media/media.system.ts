// src/app/life-cycle/system/media/media.system.ts

type Input = Readonly<{
  request: Request;
  imagesAccountHash: string;
  ctx: ExecutionContext;
}>;

type ImageFormat = "avif" | "webp" | "jpeg";

const sizedPhotoRoute =
  /^\/media\/photo\/(\d+)\/(\d+)\/([a-z0-9][a-z0-9-]*)\/?$/;

const canonicalPhotoRoute = /^\/media\/photo\/([a-z0-9][a-z0-9-]*)\/?$/;

const maxDimension = 4096;
const canonicalVariant = "public";

const cacheControl = "public, max-age=86400, s-maxage=2592000";

const resolveImageFormat = (accept: string): ImageFormat => {
  const accepted = accept.toLowerCase().split(",");

  const supports = (format: string): boolean =>
    accepted.some((entry) => {
      const [mediaType, ...parameters] = entry.trim().split(";");

      if (mediaType !== `image/${format}`) {
        return false;
      }

      const quality = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => parameter.startsWith("q="));

      return !quality || Number(quality.slice(2)) > 0;
    });

  if (supports("avif")) {
    return "avif";
  }

  if (supports("webp")) {
    return "webp";
  }

  return "jpeg";
};

export const handleMediaSystem = async ({
  request,
  imagesAccountHash,
  ctx,
}: Input): Promise<Response | null> => {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/media/")) {
    return null;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        Allow: "GET, HEAD",
      },
    });
  }

  const sizedMatch = sizedPhotoRoute.exec(url.pathname);
  const canonicalMatch = canonicalPhotoRoute.exec(url.pathname);

  if (!sizedMatch && !canonicalMatch) {
    return new Response("Media not found", { status: 404 });
  }

  const photoId = (sizedMatch?.[3] ?? canonicalMatch?.[1]) as string;

  let variant = canonicalVariant;
  let canonicalPath = `/media/photo/${photoId}`;

  if (sizedMatch) {
    const width = Number(sizedMatch[1]);
    const height = Number(sizedMatch[2]);

    if (
      !Number.isSafeInteger(width) ||
      !Number.isSafeInteger(height) ||
      width < 1 ||
      height < 1 ||
      width > maxDimension ||
      height > maxDimension
    ) {
      return new Response("Invalid image dimensions", {
        status: 400,
      });
    }

    variant = `w=${width},h=${height},fit=scale-down`;
    canonicalPath = `/media/photo/${width}/${height}/${photoId}`;
  }

  const format = resolveImageFormat(request.headers.get("Accept") ?? "");

  // Normalise the key so arbitrary query parameters cannot
  // create additional cache entries.
  const cacheUrl = new URL(canonicalPath, url.origin);
  cacheUrl.searchParams.set("format", format);

  const cacheKey = new Request(cacheUrl.toString(), {
    method: "GET",
  });

  const cache = (
    caches as CacheStorage & {
      readonly default: Cache;
    }
  ).default;

  if (request.method === "GET") {
    try {
      const cached = await cache.match(cacheKey);

      if (cached) {
        const headers = new Headers(cached.headers);
        headers.set("X-Media-Cache", "HIT");

        return new Response(cached.body, {
          status: cached.status,
          headers,
        });
      }
    } catch (error) {
      console.warn("Media cache lookup failed", error);
    }
  }

  const imageUrl =
    `https://imagedelivery.net/${imagesAccountHash}` +
    `/${encodeURIComponent(photoId)}` +
    `/${variant}`;

  const response = await fetch(
    new Request(imageUrl, {
      method: request.method,
      headers: {
        Accept: `image/${format}`,
      },
    }),
  );

  if (!response.ok) {
    if (response.status === 404) {
      return new Response("Image not found", {
        status: 404,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    console.warn("Media upstream delivery failed", {
      status: response.status,
      photoId,
    });

    return new Response("Image unavailable", {
      status: 502,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  const headers = new Headers(response.headers);

  headers.delete("Set-Cookie");
  headers.delete("Vary");
  headers.set("Cache-Control", cacheControl);
  headers.set("X-Media-Cache", "MISS");

  const result = new Response(
    request.method === "HEAD" ? null : response.body,
    {
      status: response.status,
      headers,
    },
  );

  // Cache successful complete GET responses only.
  if (request.method === "GET" && response.status === 200) {
    const cachedHeaders = new Headers(headers);
    cachedHeaders.delete("X-Media-Cache");

    const cacheResponse = new Response(result.clone().body, {
      status: result.status,
      headers: cachedHeaders,
    });

    ctx.waitUntil(
      cache.put(cacheKey, cacheResponse).catch((error: unknown) => {
        console.warn("Media cache write failed", error);
      }),
    );
  }

  return result;
};
