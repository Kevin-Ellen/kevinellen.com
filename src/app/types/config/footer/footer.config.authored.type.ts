// src/app/types/config/footer/footer.config.authored.type.ts

import type { ExternalLinkAuthored } from "../../../../content-schema/primitives/link.primitive.content-schema.authored.type";

export type FooterConfigAuthored = Readonly<{
  conservation: Readonly<{
    heading: string;
    conservations: readonly Readonly<{
      id: string;
      link: ExternalLinkAuthored;
    }>[];
  }>;
  colophon: Readonly<{
    rights: string;
  }>;
}>;
