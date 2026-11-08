// src/app/life-cycle/app-resolve/resolvers/content/components/editorial-photo/editorial-photo.component.content.resolver.app-resolve.ts

import type { EditorialPhotoComponentContentAppInit } from "../../../../../../../shared/types/content/components/editorial-photo.component.content.shared.app-init.type";
import type { EditorialPhotoComponentContentAppResolve } from "../../../../../../types/document/page/content/components/editorial-photo/editorial-photo.component.content.page.document.app-resolve.type";

type Input = Readonly<{
  content: EditorialPhotoComponentContentAppInit;
}>;

export const resolveEditorialPhotoComponentContentAppResolve = ({
  content,
}: Input): EditorialPhotoComponentContentAppResolve => ({
  ...content,
});
