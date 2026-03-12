export default {
  async fetch(
    _request: Request,
    _env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    return new Response("Hello from kevinellen.com");
  },
};
