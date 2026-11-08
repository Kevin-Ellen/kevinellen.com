// src/app/life-cycle/app-resolve/resolvers/primitives/svg/svg.primitive.resolver.app-resolve.ts

import type { SvgReferenceAppInit } from "../../../../../../shared/types/assets/svg.asset.shared.app-init.type";
import type { SvgReferenceAppResolve } from "../../../../../types/primitives/assets/svg/svg.asset.app-resolve.type";

type Input = Readonly<{
  reference: SvgReferenceAppInit;
}>;

export const resolveSvgReferenceAppResolve = ({
  reference,
}: Input): SvgReferenceAppResolve => ({
  ...reference,
});
