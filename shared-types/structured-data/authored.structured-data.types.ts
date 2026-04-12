// shared-types/structured-data/authored.structured-data.types.ts

import type { Thing, WithContext } from "schema-dts";

export type StructuredDataNodeAuthored = WithContext<Thing>;

export type AuthoredStructuredDataEntry = Readonly<{
  id: string;
  json: StructuredDataNodeAuthored;
}>;
