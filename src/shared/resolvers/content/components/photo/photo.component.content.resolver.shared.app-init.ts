// src/shared/resolvers/content/components/photo/photo.component.content.resolver.shared.app-init.ts

import type { PhotoComponentContentAuthored } from "../../../../../content-schema/content/components/photo.component.content.content-schema.authored.type";
import type { PhotoComponentContentAppInit } from "../../../../types/content/components/photo.component.content.shared.app-init.type";

type Input = Readonly<{
  authored: PhotoComponentContentAuthored;
}>;

export const resolvePhotoComponentContentAppInit = ({
  authored,
}: Input): PhotoComponentContentAppInit => ({
  ...authored,
});
