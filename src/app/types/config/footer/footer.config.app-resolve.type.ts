// src/app/types/config/footer/footer.config.app-resolve.type.ts

import type { FooterConfigAppInit } from "./footer.config.app-init.type";
import type { LinkAppResolve } from "../../primitives/link/link.primitive.app-resolve.type";
import type { OmitAndReplace } from "../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type ConservationEntryAppResolve = Readonly<
  OmitAndReplace<
    FooterConfigAppInit["conservation"]["conservations"][number],
    {
      link: LinkAppResolve;
    }
  >
>;

export type FooterShellAppResolve = Readonly<
  OmitAndReplace<
    FooterConfigAppInit,
    {
      conservation: Readonly<
        OmitAndReplace<
          FooterConfigAppInit["conservation"],
          {
            conservations: readonly ConservationEntryAppResolve[];
          }
        >
      >;
    }
  >
>;
