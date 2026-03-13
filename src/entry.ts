import CSS from "../.build/generated/styles.css?raw";

type RouteHandler = (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
) => Promise<Response>;

type RouteMap = Record<string, RouteHandler>;

export async function handleRobots(): Promise<Response> {
  return new Response(
    `User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml`,
    {
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    },
  );
}

export async function handleSitemap(): Promise<Response> {
  return new Response(`<urlset></urlset>`, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  });
}

export async function handleManifest(): Promise<Response> {
  return new Response(
    JSON.stringify({
      name: "Kevin Ellen",
      short_name: "Kevin",
      start_url: "/",
      display: "standalone",
    }),
    {
      headers: {
        "content-type": "application/manifest+json; charset=utf-8",
      },
    },
  );
}

const SYSTEM_ROUTE_MAP: RouteMap = {
  "/robots.txt": handleRobots,
  "/sitemap.xml": handleSitemap,
  "/manifest.webmanifest": handleManifest,
};

/**
 * Placeholder prefix routing layer
 * Future:
 * - /images/
 * - /api/
 * - /feeds/
 * - /og/
 */
async function handlePrefixRoutes(
  path: string,
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response | null> {
  if (path.startsWith("/images/")) {
    return new Response("image placeholder", { status: 501 });
  }

  return null;
}

/**
 * Placeholder App runtime
 * Later replaced by App class
 */
async function handleApp(): Promise<Response> {
  const bundleName = "SASS/CSS - E";

  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${bundleName}</title>
<style>${CSS}</style>
</head>
<body>
<main>
<h1>${bundleName}</h1>
<p>Hello from Cloudflare + GitHub + Spacelift + Terraform</p>
</main>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "x-robots-tag": "noindex",
    },
  });
}

export default {
  async fetch(
    req: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    // exact system routes
    const systemHandler = SYSTEM_ROUTE_MAP[path];
    if (systemHandler) return systemHandler(req, env, ctx);

    // prefix routes
    const prefixResponse = await handlePrefixRoutes(path, req, env, ctx);
    if (prefixResponse) return prefixResponse;

    // fallback → app
    return handleApp();
  },
};
