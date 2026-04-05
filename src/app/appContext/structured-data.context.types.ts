// src/app/context/structured-data.context.types.ts

import type { Graph, WithContext } from "schema-dts";
import type { StructuredDataNodeAuthored } from "@shared-types/structured-data/structured-data.authored.types";

export type PageStructuredDataContext =
  | readonly StructuredDataNodeAuthored[]
  | Graph
  | WithContext<StructuredDataNodeAuthored>;
