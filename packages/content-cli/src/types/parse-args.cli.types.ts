// packages/content-cli/src/types/parse-args.cli.types.ts

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

export type ContentCliMode = "interactive" | "direct";

export type ContentCliEntity = "journal" | "photo";

export type JournalCliAction =
  | "create"
  | "generate"
  | "validate"
  | "publish"
  | "read"
  | "list"
  | "status"
  | "promote";

export type PhotoCliAction =
  | "create"
  | "generate"
  | "validate"
  | "publish"
  | "read"
  | "list"
  | "status"
  | "homepageStripRebuild";

type ParsedDirectCliArgsBase = Readonly<{
  mode: "direct";
  env: ContentCliEnvironment;
}>;

export type ParsedJournalDirectCliArgs = ParsedDirectCliArgsBase &
  Readonly<{
    entity: "journal";
    action: JournalCliAction;
    bucket: ContentWorkspaceBucket;
    slug?: string;
    from?: ContentCliEnvironment;
    to?: ContentCliEnvironment;
  }>;

type ParsedPhotoDirectCliArgsBase = ParsedDirectCliArgsBase &
  Readonly<{
    entity: "photo";
    bucket: ContentWorkspaceBucket;
  }>;

export type ParsedPhotoCreateArgs = ParsedPhotoDirectCliArgsBase &
  Readonly<{
    action: "create";
  }>;

export type ParsedPhotoWorkspaceArgs = ParsedPhotoDirectCliArgsBase &
  Readonly<{
    action: "generate" | "validate" | "publish";
    slug: string;
  }>;

export type ParsedPhotoReadArgs = ParsedPhotoDirectCliArgsBase &
  Readonly<{
    action: "read";
    photoId: string;
  }>;

export type ParsedPhotoSimpleArgs = ParsedPhotoDirectCliArgsBase &
  Readonly<{
    action: "list" | "status";
  }>;

export type ParsedPhotoHomepageStripRebuildArgs = ParsedDirectCliArgsBase &
  Readonly<{
    entity: "photo";
    action: "homepageStripRebuild";
  }>;

export type ParsedPhotoDirectCliArgs =
  | ParsedPhotoCreateArgs
  | ParsedPhotoWorkspaceArgs
  | ParsedPhotoReadArgs
  | ParsedPhotoSimpleArgs;

export type ParsedDirectCliArgs =
  | ParsedJournalDirectCliArgs
  | ParsedPhotoDirectCliArgs
  | ParsedPhotoHomepageStripRebuildArgs;

export type ParsedInteractiveCliArgs = Readonly<{
  mode: "interactive";
  env: ContentCliEnvironment;
}>;

export type ParsedCliArgs = ParsedInteractiveCliArgs | ParsedDirectCliArgs;
