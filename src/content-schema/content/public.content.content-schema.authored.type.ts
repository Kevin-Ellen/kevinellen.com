// src/content-schema/content/public.content.content-schema.authored.type.ts

import type { ContentCommonAuthored } from "./content.content-schema.authored.type";
import type { StructuredDataContentAuthored } from "./structured-data.content.content-schema.authored.type";
import type { TopicId } from "../topics/topic-id.topics.content-schema.type";

export type PublicContentAuthored = ContentCommonAuthored &
  Readonly<{
    kind: "public";
    slug: string;

    metadata: Readonly<{
      title: string;
      description: string;
      sitemap: boolean;
    }>;

    topics?: readonly TopicId[];
    scripts?: readonly string[];
    structuredData?: StructuredDataContentAuthored;
    photos?: string[];
  }>;
