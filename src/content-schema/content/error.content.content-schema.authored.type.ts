// src/content-schema/content/error.content.content-schema.authored.type.ts

import type { ContentCommonAuthored } from "./content.content-schema.authored.type";

export type ErrorContentAuthored = ContentCommonAuthored &
  Readonly<{
    kind: "error";

    metadata: Readonly<{
      title: string;
      description: string;
    }>;
  }>;
