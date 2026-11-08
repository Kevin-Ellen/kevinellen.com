// src/shared/resolvers/content/body/footer/footer.body.content.resolver.shared.app-init.ts

import type { ContentBodyFooterAuthored } from "../../../../../content-schema/content/body/footer.body.content-schema.authored.type";
import type { ContentBodyFooterAppInit } from "../../../../types/content/body/footer.content.shared.body.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../../types/config/person.config.shared.app-init.type";
import type { ContentDatesAppInit } from "../../../../types/content/content.shared.app-init.type";
import type { TopicsConfigAppInit } from "../../../../../app/types/config/topics/topics.config.app-init.type";

import { resolveModuleContentAppInit } from "../../modules/module.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: ContentBodyFooterAuthored | undefined;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
  dates: ContentDatesAppInit;
  topics: TopicsConfigAppInit;
}>;

export const resolveContentBodyFooterAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
  dates,
  topics,
}: Input): ContentBodyFooterAppInit =>
  (authored ?? []).map((module) =>
    resolveModuleContentAppInit({
      authored: module,
      svgAssets,
      socialProfiles,
      dates,
      topics,
    }),
  );
