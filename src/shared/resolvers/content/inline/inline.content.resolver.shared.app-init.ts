// src/shared/resolvers/content/inline/inline.content.resolver.shared.app-init.ts

import type { InlineContentAuthored } from "../../../../content-schema/content/inline/inline.content.content-schema.authored.type";
import type { InlineContentAppInit } from "../../../types/content/inline/inline.content.shared.app-init.type";
import type { LinkInlineContentAuthored } from "../../../../content-schema/content/inline/link.inline.content.content-schema.authored.type";
import type { TextInlineContentAuthored } from "../../../../content-schema/content/inline/text.inline.content.content-schema.authored.type";
import type { SvgAssetsConfigAppInit } from "../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../types/config/person.config.shared.app-init.type";

import { resolveTextInlineContentAppInit } from "./text/text.inline.content.resolver.shared.app-init";
import { resolveLinkInlineContentAppInit } from "./link/link.inline.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: InlineContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
}>;

const resolvers: Record<
  InlineContentAuthored["kind"],
  (input: Input) => InlineContentAppInit
> = {
  text: ({ authored }) =>
    resolveTextInlineContentAppInit(authored as TextInlineContentAuthored),

  link: ({ authored, svgAssets, socialProfiles }) =>
    resolveLinkInlineContentAppInit({
      authored: authored as LinkInlineContentAuthored,
      svgAssets,
      socialProfiles,
    }),
};

export const resolveInlineContentAppInit = (
  input: Input,
): InlineContentAppInit => {
  const resolver = resolvers[input.authored.kind];

  if (!resolver) {
    throw new Error(`Unsupported inline kind: ${input.authored.kind}`);
  }

  return resolver(input);
};
