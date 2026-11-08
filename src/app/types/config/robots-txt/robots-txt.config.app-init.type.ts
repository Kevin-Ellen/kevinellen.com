// src/app/types/config/robots-txt/robots-txt.config.app-init.type.ts

import type {
  RobotsTxtConfigAuthored,
  RobotsTxtGroupAuthored,
} from "./robots-txt.config.authored.type";

import type { OmitAndReplace } from "../../../../shared/types/utilities/omit-replace.utility.shared.type";

type RobotsTxtGroupAppInit = Readonly<
  OmitAndReplace<
    RobotsTxtGroupAuthored,
    {
      allow: readonly string[];
      disallow: readonly string[];
      crawlDelay: number | null;
    }
  >
>;

export type RobotsTxtConfigAppInit = Readonly<
  Omit<RobotsTxtConfigAuthored, "sitemapPath" | "groups"> & {
    groups: readonly RobotsTxtGroupAppInit[];
    sitemapUrl: string;
  }
>;
