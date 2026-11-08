// src/app/life-cycle/app-render-context/resolvers/primitives/svg/svg.primitive.resolver.app-render-context.ts

import type { SvgReferenceAppResolve } from "../../../../../types/primitives/assets/svg/svg.asset.app-resolve.type";
import type { SvgReferenceAppRenderContext } from "../../../../../types/primitives/assets/svg/svg.asset.app-render-context.type";

type Input = Readonly<{
  reference: SvgReferenceAppResolve;
}>;

export const resolveSvgReferenceAppRenderContext = ({
  reference,
}: Input): SvgReferenceAppRenderContext => ({
  ...reference,
});
