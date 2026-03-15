// src/system-handler/webmanifest.handler.ts

const handleWebmanifest = async (): Promise<Response> => {
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
};
export default handleWebmanifest;
