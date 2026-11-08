// src/app/types/config/footer/footer.config.app-init.type.ts

import type { FooterConfigAuthored } from "./footer.config.authored.type";
import type { ExternalLinkAppInit } from "../../../../shared/types/content/primitives/link.primitive.content.shared.app-init.type";
import type { OmitAndReplace } from "../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type FooterConfigAppInit = Readonly<
  OmitAndReplace<
    FooterConfigAuthored,
    {
      conservation: Readonly<
        OmitAndReplace<
          FooterConfigAuthored["conservation"],
          {
            conservations: readonly Readonly<
              OmitAndReplace<
                FooterConfigAuthored["conservation"]["conservations"][number],
                { link: ExternalLinkAppInit }
              >
            >[];
          }
        >
      >;
      colophon: Readonly<
        FooterConfigAuthored["colophon"] & {
          year: number;
          name: string;
        }
      >;
    }
  >
>;
