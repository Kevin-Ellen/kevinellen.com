// src/app/types/config/resources/resources.config.app-init.type.ts

import type {
  ResourcePreloadAuthored,
  ResourcesConfigAuthored,
} from "./resources.config.authored.type";
import type { OmitAndReplace } from "../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type ResourcePreloadAppInit = Readonly<
  OmitAndReplace<
    ResourcePreloadAuthored,
    {
      type: string | null;
      crossorigin: NonNullable<ResourcePreloadAuthored["crossorigin"]> | null;
    }
  >
>;

export type ResourcesConfigAppInit = Readonly<
  OmitAndReplace<
    ResourcesConfigAuthored,
    {
      preloads: readonly ResourcePreloadAppInit[];
    }
  >
>;
