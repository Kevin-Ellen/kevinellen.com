// src/shared/resolvers/content/topics/topics.resolve.shared.app-init.ts

import type { TopicsConfigAuthored } from "../../../../app/types/config/topics/topics.config.authored.type";
import type { TopicsConfigAppInit } from "../../../../app/types/config/topics/topics.config.app-init.type";

import { resolveEditorialPhotoComponentContentAppInit } from "../components/editorial-photo/editorial-photo.component.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: TopicsConfigAuthored;
}>;

export const resolveTopicsConfigAppInit = ({
  authored,
}: Input): TopicsConfigAppInit =>
  Object.fromEntries(
    Object.entries(authored).map(([id, topic]) => [
      id,
      {
        ...topic,
        image: resolveEditorialPhotoComponentContentAppInit({
          authored: topic.image,
        }),
      },
    ]),
  ) as TopicsConfigAppInit;
