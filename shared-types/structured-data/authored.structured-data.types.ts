// shared-types/structured-data/authored.structured-data.types.ts

import type { Thing, WithContext } from "schema-dts";

export type AuthoredStructuredDataNode = WithContext<Thing>;

export type AuthoredStructuredDataEntry = Readonly<{
  id: string;
  json: AuthoredStructuredDataNode;
}>;
