// src/app/life-cycle/app-resolve/resolvers/structured-data/authored/authored.structured-data.resolver.app-resolve.ts

import type { Graph } from "schema-dts";

import type { ContentAppResolve } from "../../../../../types/document/page/content/content.page.document.app-resolve.type";

type Input = Readonly<{
  structuredData: ContentAppResolve["structuredData"];
  origin: string;
}>;

const URL_PROPERTIES = new Set([
  "@id",
  "url",
  "sameAs",
  "image",
  "contentUrl",
  "thumbnailUrl",
]);

const resolveUrls = (
  value: unknown,
  baseUrl: URL,
  property?: string,
): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => resolveUrls(item, baseUrl, property));
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        resolveUrls(child, baseUrl, key),
      ]),
    );
  }

  if (
    typeof value === "string" &&
    property !== undefined &&
    URL_PROPERTIES.has(property) &&
    value.startsWith("/")
  ) {
    return new URL(value, baseUrl).href;
  }

  return value;
};

export const resolveAuthoredStructuredDataAppResolve = ({
  structuredData,
  origin,
}: Input): Graph["@graph"] => {
  if (!structuredData) {
    return [];
  }

  const baseUrl = new URL(origin);

  return resolveUrls(structuredData["@graph"], baseUrl) as Graph["@graph"];
};
