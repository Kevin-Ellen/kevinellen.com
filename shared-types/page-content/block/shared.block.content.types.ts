// shared-types/page-content/block/shared.block.content.types.ts

export type BlockContentModuleFlow = "content" | "breakout";

export type BlockContentModulePagination = Readonly<{
  pageSize: number;
}>;

export type BlockContentModuleListStyle = "unordered" | "ordered";
