// src/shared/resolvers/content/components/editorial-photo/editorial-photo.component.content.resolver.shared.app-init.ts

import type { EditorialPhotoComponentContentAuthored } from "../../../../../content-schema/content/components/editorial-photo.component.content.content-schema.authored.type";
import type { EditorialPhotoComponentContentAppInit } from "../../../../types/content/components/editorial-photo.component.content.shared.app-init.type";

type Input = Readonly<{
  authored: EditorialPhotoComponentContentAuthored;
}>;

export const resolveEditorialPhotoComponentContentAppInit = ({
  authored,
}: Input): EditorialPhotoComponentContentAppInit => ({
  ...authored,
});
