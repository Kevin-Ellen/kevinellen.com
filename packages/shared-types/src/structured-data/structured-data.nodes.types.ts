// packages/shared-types/src/structured-data/structured-data.nodes.types.ts

import type {
  BreadcrumbList,
  Person,
  Thing,
  WebSite,
  WithContext,
} from "schema-dts";

export type StructuredDataNodeAuthored = WithContext<Thing>;

export type StructuredDataBreadcrumbListNode = WithContext<BreadcrumbList>;
export type StructuredDataPersonNode = WithContext<Person>;
export type StructuredDataWebSiteNode = WithContext<WebSite>;

export type StructuredDataNode =
  | StructuredDataPersonNode
  | StructuredDataWebSiteNode
  | StructuredDataBreadcrumbListNode
  | StructuredDataNodeAuthored;

export type RenderContextStructuredData = {
  items: readonly StructuredDataNode[];
};
