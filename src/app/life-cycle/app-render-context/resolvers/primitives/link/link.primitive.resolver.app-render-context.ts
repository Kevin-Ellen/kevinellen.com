// src/app/life-cycle/app-render-context/resolvers/primitives/link/link.primitive.resolver.app-render-context.ts

import type { LinkAppResolve } from "../../../../../types/primitives/link/link.primitive.app-resolve.type";
import type { LinkAppRenderContext } from "../../../../../types/primitives/link/link.primitive.app-render-context.type";

type Input = Readonly<{
  link: LinkAppResolve;
}>;

export const resolveLinkAppRenderContext = ({
  link,
}: Input): LinkAppRenderContext => link;
