// src/system-handler/robots.handler.ts

const handleRobots = async (): Promise<Response> => {
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
};
export default handleRobots;
