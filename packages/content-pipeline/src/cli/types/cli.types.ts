// packages/content-pipeline/src/cli/types/cli.types.ts

export type ContentCliEntity = "photo" | "journal" | "article";

export type ContentCliAction =
  | "start"
  | "create"
  | "upload"
  | "status"
  | "pull"
  | "reupload";
