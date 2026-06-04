// src/app-render-context/resolve/body-content/block/sequence/sequence.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextSequenceBlock } from "@shared-types/page-content/block/sequence/app-context.sequence.block.types";
import type { AppRenderContextSequenceBlock } from "@shared-types/page-content/block/sequence/app-render-context.sequence.block.types";
import type {
  AppRenderContextPhotoMetaGroup,
  AppRenderContextPhotoMetaItem,
} from "@shared-types/media/photo/app-render-context.photo.types";

import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

const normaliseSequenceMetaValue = (
  item: AppRenderContextPhotoMetaItem,
): string => item.value.replace(/^ISO\s+/u, "");

const formatSequenceMetaValue = (
  item: AppRenderContextPhotoMetaItem,
  values: readonly string[],
): string => {
  if (item.id === "iso") {
    return `ISO ${values.join("–")}`;
  }

  return values.join(", ");
};

const dedupePhotoMetaItems = (
  items: readonly AppRenderContextPhotoMetaItem[],
): readonly AppRenderContextPhotoMetaItem[] => {
  const grouped = new Map<string, AppRenderContextPhotoMetaItem[]>();

  items.forEach((item) => {
    grouped.set(item.id, [...(grouped.get(item.id) ?? []), item]);
  });

  return Array.from(grouped.values()).map((group) => {
    const [first] = group;

    const values = Array.from(
      new Set(group.map((item) => normaliseSequenceMetaValue(item))),
    );

    return {
      ...first,
      value: formatSequenceMetaValue(first, values),
    };
  });
};

const resolveSequenceMeta = (
  groups: readonly (readonly AppRenderContextPhotoMetaGroup[])[],
): readonly AppRenderContextPhotoMetaGroup[] => {
  const groupMap = new Map<
    AppRenderContextPhotoMetaGroup["kind"],
    AppRenderContextPhotoMetaItem[]
  >();

  groups.forEach((photoGroups) => {
    photoGroups.forEach((group) => {
      groupMap.set(group.kind, [
        ...(groupMap.get(group.kind) ?? []),
        ...group.items,
      ]);
    });
  });

  return Array.from(groupMap.entries())
    .map(([kind, items]) => ({
      kind,
      items: dedupePhotoMetaItems(items),
    }))
    .filter((group) => group.items.length > 0);
};

export const appRenderContextResolveSequenceBlock = (
  appContext: AppContext,
  block: AppContextSequenceBlock,
): AppRenderContextSequenceBlock => {
  const photos = block.photos.map((item) => ({
    position: item.position,
    photo: appRenderContextResolvePhoto(item.photo, appContext.metadataLabels),
  }));

  return {
    kind: block.kind,
    immersive: block.immersive,
    flow: block.flow,
    caption: block.caption.map((item) =>
      appRenderContextResolveInline(appContext, item),
    ),
    photos,
    meta: resolveSequenceMeta(photos.map((item) => item.photo.meta)),
  };
};
