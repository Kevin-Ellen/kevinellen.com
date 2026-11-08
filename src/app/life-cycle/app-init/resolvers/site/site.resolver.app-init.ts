// src/app/life-cycle/app-init/resolvers/site/site.resolver.app-init.ts

import type { ValidatedEnv } from "../../../../entry.type";
import type { SiteConfigAuthored } from "../../../../../shared/types/config/site.config.shared.authored.type";
import type { SiteConfigAppInit } from "../../../../../shared/types/config/site.config.shared.app-init.type";

type Input = Readonly<{
  authored: SiteConfigAuthored;
  env: ValidatedEnv;
}>;

export const resolveSiteConfigAppInit = ({
  authored,
  env,
}: Input): SiteConfigAppInit => ({
  ...authored,
  canonicalDomain: env.DOMAIN,
});
