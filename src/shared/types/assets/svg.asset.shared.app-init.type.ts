// src/shared/types/assets/svg.asset.shared.app-init.type.ts

import type {
  SvgAssetAuthored,
  SvgReferenceAuthored,
} from "../../../content-schema/assets/svg.asset.content-schema.authored.type";
import type { SvgAssetId } from "./svg-id.asset.shared.type";
import type { OmitAndReplace } from "../utilities/omit-replace.utility.shared.type";

export type SvgAssetAppInit = Readonly<
  OmitAndReplace<
    SvgAssetAuthored,
    {
      id: SvgAssetId;
      width: number;
      height: number;
    }
  >
>;

export type SvgReferenceAppInit = Readonly<
  OmitAndReplace<
    SvgReferenceAuthored,
    {
      id: SvgAssetId;
      width: number;
      height: number;
    }
  >
>;
