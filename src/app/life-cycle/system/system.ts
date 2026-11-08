// src/app/life-cycle/system/system.ts

import type { AppInit } from "../app-init/class.app-init";
import type { SystemResolverId } from "../../types/system/system.shared.type";
import type { ResponseOutput } from "../../types/response/response.shared.type";
import type { PublishedRegistry } from "../../../shared/types/content/kv-ledger.content.shared.type";

import { resolveRobotsTxtSystem } from "./robots-txt/robots-txt.system";
import { resolveWebmanifestSystem } from "./webmanifest/webmanifest.system";
import { resolveSitemapSystem } from "./sitemap-xml/sitemap-xml.system";

type Input = Readonly<{
  resolver: SystemResolverId;
  appInit: AppInit;
  ledger: PublishedRegistry | null;
}>;

export const handleSystem = ({
  resolver,
  appInit,
  ledger,
}: Input): ResponseOutput => {
  const resolvers: Record<SystemResolverId, () => ResponseOutput> = {
    "robots-txt": () => resolveRobotsTxtSystem({ appInit }),
    webmanifest: () => resolveWebmanifestSystem({ appInit }),
    sitemap: () => {
      if (ledger === null) {
        throw new Error("Sitemap requires a published ledger");
      }

      return resolveSitemapSystem({ appInit, ledger });
    },
  };

  const selected = resolvers[resolver];

  if (!selected) {
    throw new Error(`Unsupported system resolver: ${resolver}`);
  }

  return selected();
};
