// packages/content-cli/src/types/parse-args.cli.types.ts

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

export type ContentCliMode = "interactive" | "direct";

export type ContentCliEntity = "journal" | "photo";

export type ContentCliAction =
  | "create"
  | "generate"
  | "validate"
  | "publish"
  | "read"
  | "list"
  | "status"
  | "promote";

export type ParsedInteractiveCliArgs = Readonly<{
  mode: "interactive";
  env: ContentCliEnvironment;
}>;

export type ParsedDirectCliArgs = Readonly<{
  mode: "direct";
  env: ContentCliEnvironment;
  entity: ContentCliEntity;
  action: ContentCliAction;
  bucket: ContentWorkspaceBucket;
  slug?: string;
  photoId?: string;
  from?: ContentCliEnvironment;
  to?: ContentCliEnvironment;
}>;

export type ParsedCliArgs = ParsedInteractiveCliArgs | ParsedDirectCliArgs;
