// src/app/types/config/navigation/navigation.config.authored.type.ts

import type {
  InternalLinkAuthored,
  SocialLinkAuthored,
  LinkAuthored,
} from "../../../../content-schema/primitives/link.primitive.content-schema.authored.type";

export type FooterNavigationSectionAuthored = Readonly<{
  id: string;
  label: string;
  links: readonly LinkAuthored[];
}>;

export type NavigationConfigAuthored = Readonly<{
  branding: InternalLinkAuthored;
  primary: readonly InternalLinkAuthored[];
  social: readonly SocialLinkAuthored[];
  footer: Readonly<{
    primary: readonly FooterNavigationSectionAuthored[];
    legal: FooterNavigationSectionAuthored;
  }>;
}>;
