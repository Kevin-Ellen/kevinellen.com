// src/shared/types/content/primitives/link.primitive.content.shared.app-init.type.ts

import type { PageId } from "../page-id.content.shared.type";
import type {
  LinkCommonAuthored,
  InternalLinkAuthored,
  ExternalLinkAuthored,
  LinkVariant,
} from "../../../../content-schema/primitives/link.primitive.content-schema.authored.type";

import type {
  LinkTarget,
  LinkRel,
} from "../../../../content-schema/primitives/link.primitive.content-schema.type";

import type { SvgReferenceAppInit } from "../../assets/svg.asset.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type LinkCommonAppInit = Readonly<
  OmitAndReplace<
    LinkCommonAuthored,
    {
      label: string | null;
      ariaLabel: string | null;
      title: string | null;
      icon: SvgReferenceAppInit | null;
      target: LinkTarget | null;
      rel: readonly LinkRel[] | null;
      variant: LinkVariant | null;
    }
  >
>;

export type InternalLinkAppInit = Readonly<
  OmitAndReplace<
    InternalLinkAuthored,
    LinkCommonAppInit & {
      pageId: PageId;
    }
  >
>;

export type ExternalLinkAppInit = Readonly<
  OmitAndReplace<
    ExternalLinkAuthored,
    LinkCommonAppInit & {
      href: string;
    }
  >
>;

export type LinkAppInit = InternalLinkAppInit | ExternalLinkAppInit;
