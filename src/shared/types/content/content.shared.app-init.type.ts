// src/shared/types/content/content.shared.app-init.type.ts

import type {
  ContentCommonAuthored,
  PagePresentationAuthored,
} from "../../../content-schema/content/content.content-schema.authored.type";
import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";
import type { ErrorContentAuthored } from "../../../content-schema/content/error.content.content-schema.authored.type";

import type { TopicId } from "../../../content-schema/topics/topic-id.topics.content-schema.type";
import type { PageId } from "./page-id.content.shared.type";
import type { ScriptAssetId } from "../assets/script-id.asset.shared.type";
import type { OmitAndReplace } from "../utilities/omit-replace.utility.shared.type";

import type { ContentBodyAppInit } from "./body/body.content.shared.app-init.type";
import type { StructuredDataContentAppInit } from "./structured-data.content.shared.app-init.type";

export type ContentDatesAppInit = Readonly<{
  created: string;
  lastUpdated: string | null;
}>;

export type PagePresentationAppInit = Readonly<
  OmitAndReplace<
    PagePresentationAuthored,
    {
      header: Readonly<{
        transparent: boolean;
        inverted: boolean;
      }>;
    }
  >
>;

export type ContentAppInit = Readonly<
  OmitAndReplace<
    Omit<ContentCommonAuthored, "photos">,
    {
      id: PageId;
      status: number;
      breadcrumbs: readonly PageId[];
      dates: ContentDatesAppInit;
      body: ContentBodyAppInit;
      pagePresentation: PagePresentationAppInit;
    }
  > & {
    kind: PublicContentAuthored["kind"] | ErrorContentAuthored["kind"];

    slug: string | null;

    topics: readonly TopicId[];

    metadata: Readonly<{
      title: string;
      description: string;
      sitemap: boolean;
    }>;

    scripts: readonly ScriptAssetId[];

    structuredData: StructuredDataContentAppInit | null;
  }
>;
