// src/shared/types/content/modules/topic-explorer.module.content.shared.app-init.type.ts

import type { TopicExplorerModuleContentAuthored } from "../../../../content-schema/content/modules/topic-explorer.module.content.content-schema.authored.type";
import type { TopicId } from "../../../../content-schema/topics/topic-id.topics.content-schema.type";
import type { EditorialPhotoComponentContentAppInit } from "../components/editorial-photo.component.content.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type TopicExplorerItemContentAppInit = Readonly<{
  id: TopicId;
  label: string;
  description: string;
  href: string;
  image: EditorialPhotoComponentContentAppInit;
}>;

export type TopicExplorerModuleContentAppInit = Readonly<
  OmitAndReplace<
    TopicExplorerModuleContentAuthored,
    {
      unrankedItems: readonly TopicExplorerItemContentAppInit[];
    }
  >
>;
