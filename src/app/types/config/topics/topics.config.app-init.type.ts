// src/app/types/config/topics/topics.config.app-init.type.ts

import type { TopicsConfigAuthored } from "./topics.config.authored.type";
import type { EditorialPhotoComponentContentAppInit } from "../../../../shared/types/content/components/editorial-photo.component.content.shared.app-init.type";
import type { OmitAndReplace } from "../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type TopicConfigAppInit = Readonly<
  OmitAndReplace<
    TopicsConfigAuthored[keyof TopicsConfigAuthored],
    {
      image: EditorialPhotoComponentContentAppInit;
    }
  >
>;

export type TopicsConfigAppInit = Readonly<{
  [K in keyof TopicsConfigAuthored]: TopicConfigAppInit;
}>;
