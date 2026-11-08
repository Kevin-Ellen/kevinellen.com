// src/app/life-cycle/app-init/app-init.ts

import type { ValidatedEnv } from "../../entry.type";
import type { ScriptAssetId } from "../../../shared/types/assets/script-id.asset.shared.type";

import { AppInit } from "./class.app-init";

import { siteConfigAuthored } from "../../../shared/config/site.config.shared.authored";
import { personConfigAuthored } from "../../../shared/config/person.config.shared.authored";
import { navigationConfigAuthored } from "../../config/navigation.config";
import { footerConfigAuthored } from "../../config/footer.config";
import { robotsTxtConfigAuthored } from "../../config/robots-txt.config";
import { resourcesConfigAuthored } from "../../config/resources.config";
import { contentConfigAuthored } from "../../config/content.config";
import { topicsConfigAuthored } from "../../../shared/config/topics.config.shared.app-state";

import { resolveSiteConfigAppInit } from "./resolvers/site/site.resolver.app-init";
import { resolveAssetConfigAppInit } from "../../../shared/resolvers/assets/asset.resolver.shared.app-init";
import { resolvePersonConfigAppInit } from "./resolvers/person/person.resolver.app-init";
import { resolveNavigationConfigAppInit } from "./resolvers/navigation/navigation.resolver.app-init";
import { resolveFooterConfigAppInit } from "./resolvers/footer/footer.resolver.app-init";
import { resolveRobotsTxtConfigAppInit } from "./resolvers/robots-txt/robots-txt.resolver.app-init";
import { resolveResourcesConfigAppInit } from "./resolvers/resources/resources.resolver.app-init";
import { resolveContentConfigAppInit } from "../../../shared/resolvers/config/content.config.resolver.shared.app-init";
import { resolveTopicsConfigAppInit } from "../../../shared/resolvers/content/topics/topics.resolve.shared.app-init";

type Input = Readonly<{
  env: ValidatedEnv;
}>;

export const createAppInit = ({ env }: Input): AppInit => {
  const site = resolveSiteConfigAppInit({
    authored: siteConfigAuthored,
    env,
  });

  const person = resolvePersonConfigAppInit({
    authored: personConfigAuthored,
    canonicalDomain: site.canonicalDomain,
  });

  const assets = resolveAssetConfigAppInit();
  const scriptIds = Object.keys(assets.scripts.registry) as ScriptAssetId[];

  const navigation = resolveNavigationConfigAppInit({
    authored: navigationConfigAuthored,
    svgAssets: assets.svg,
    socialProfiles: person.socialProfiles,
  });

  const footer = resolveFooterConfigAppInit({
    authored: footerConfigAuthored,
    svgAssets: assets.svg,
    person: person,
  });

  const robotsTxt = resolveRobotsTxtConfigAppInit({
    authored: robotsTxtConfigAuthored,
    canonicalDomain: site.canonicalDomain,
  });

  const resources = resolveResourcesConfigAppInit({
    authored: resourcesConfigAuthored,
  });

  const topics = resolveTopicsConfigAppInit({
    authored: topicsConfigAuthored,
  });

  const content = resolveContentConfigAppInit({
    authored: contentConfigAuthored,
    svgAssets: assets.svg,
    socialProfiles: person.socialProfiles,
    scriptIds,
    topics,
  });

  return new AppInit({
    site,
    assets,
    person,
    topics,
    navigation,
    footer,
    robotsTxt,
    resources,
    content,
  });
};
