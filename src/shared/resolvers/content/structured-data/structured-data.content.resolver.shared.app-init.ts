// src/shared/resolvers/content/structured-data/structured-data.content.resolver.shared.app-init.ts

import type { Graph } from "schema-dts";

import type { StructuredDataContentAuthored } from "../../../../content-schema/content/structured-data.content.content-schema.authored.type";
import type { StructuredDataContentAppInit } from "../../../types/content/structured-data.content.shared.app-init.type";

export const resolveStructuredDataAppInit = (
  authored: StructuredDataContentAuthored,
): StructuredDataContentAppInit => {
  const graph: unknown = authored["@graph"];

  return {
    "@context": "https://schema.org",
    // Authored JSON-LD is validated by the publishing contract.
    // schema-dts supplies compile-time types, not runtime validation.
    "@graph": graph as Graph["@graph"],
  };
};
