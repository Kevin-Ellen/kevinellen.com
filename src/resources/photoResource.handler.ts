// src/system-handlers/photoResource.handler.ts

const handlePhotoResource = async (
  _req: Request,
  _env: Env,
  _ctx: ExecutionContext,
): Promise<Response> => {
  return new Response("Photo resource not implemented yet", {
    status: 501,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
    },
  });
};

export default handlePhotoResource;
