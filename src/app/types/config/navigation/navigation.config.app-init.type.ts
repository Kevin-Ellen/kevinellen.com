// src/app/types/config/navigation/navigation.config.app-init.type.ts

import type {
  NavigationConfigAuthored,
  FooterNavigationSectionAuthored,
} from "./navigation.config.authored.type";

import type {
  InternalLinkAppInit,
  ExternalLinkAppInit,
  LinkAppInit,
} from "../../../../shared/types/content/primitives/link.primitive.content.shared.app-init.type";

import type { OmitAndReplace } from "../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type FooterNavigationSectionAppInit = Readonly<
  OmitAndReplace<
    FooterNavigationSectionAuthored,
    {
      links: readonly LinkAppInit[];
    }
  >
>;

export type NavigationConfigAppInit = Readonly<
  OmitAndReplace<
    NavigationConfigAuthored,
    {
      branding: InternalLinkAppInit;
      primary: readonly InternalLinkAppInit[];
      social: readonly ExternalLinkAppInit[];
      footer: Readonly<{
        primary: readonly FooterNavigationSectionAppInit[];
        legal: FooterNavigationSectionAppInit;
      }>;
    }
  >
>;
