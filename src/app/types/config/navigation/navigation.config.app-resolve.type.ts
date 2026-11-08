// src/app/types/config/navigation/navigation.config.app-resolve.type.ts

import type { NavigationConfigAppInit } from "./navigation.config.app-init.type";
import type { LinkAppResolve } from "../../primitives/link/link.primitive.app-resolve.type";
import type { OmitAndReplace } from "../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type FooterNavigationSectionAppResolve = Readonly<
  OmitAndReplace<
    NavigationConfigAppInit["footer"]["primary"][number],
    {
      links: readonly LinkAppResolve[];
    }
  >
>;

export type NavigationShellAppResolve = Readonly<
  OmitAndReplace<
    NavigationConfigAppInit,
    {
      branding: LinkAppResolve;
      primary: readonly LinkAppResolve[];
      social: readonly LinkAppResolve[];
      footer: Readonly<{
        primary: readonly FooterNavigationSectionAppResolve[];
        legal: FooterNavigationSectionAppResolve;
      }>;
    }
  >
>;
