// shared-types/structured-data/authored.structured-data.types.ts

import type { StructuredDataNode } from "@shared-types/structured-data/shared.structured-data.types";

export type AuthoredStructuredDataEntry = Readonly<{
  id: string;
  json: StructuredDataNode;
}>;
