type RouteHandler = (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
) => Promise<Response>;

export type RouteMap = Record<string, RouteHandler>;
