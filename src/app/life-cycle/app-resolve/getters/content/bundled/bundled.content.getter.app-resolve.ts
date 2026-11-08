// src/app/life-cycle/app-resolve/getters/content/bundled/bundled.content.getter.app-resolve.ts

import type { AppInit } from "../../../../app-init/class.app-init";

type Input = Readonly<
  | {
      appInit: AppInit;
      slug: string;
      status?: never;
    }
  | {
      appInit: AppInit;
      status: 404;
      slug?: never;
    }
>;

type BundledContentAppResolve =
  | AppInit["content"]["bySlug"][string]
  | NonNullable<AppInit["content"]["errorsByStatus"][404]>;

export const getBundledContentAppResolve = ({
  appInit,
  ...selection
}: Input): BundledContentAppResolve => {
  const content =
    selection.slug !== undefined
      ? appInit.content.bySlug[selection.slug]
      : appInit.content.errorsByStatus[selection.status];

  if (!content) {
    throw new Error(
      selection.slug !== undefined
        ? `Bundled content not found: ${selection.slug}`
        : `Bundled error content not found: ${selection.status}`,
    );
  }

  return content;
};
