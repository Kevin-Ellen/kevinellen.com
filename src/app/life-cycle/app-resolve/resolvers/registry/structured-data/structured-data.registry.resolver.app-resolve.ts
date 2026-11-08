// src/app/life-cycle/app-resolve/resolvers/registry/structured-data/structured-data.registry.resolver.app-resolve.ts

import type { Graph } from "schema-dts";

import type { PersonConfigAppInit } from "../../../../../../shared/types/config/person.config.shared.app-init.type";
import type { SiteConfigAppInit } from "../../../../../../shared/types/config/site.config.shared.app-init.type";
import type { ContentAppResolve } from "../../../../../types/document/page/content/content.page.document.app-resolve.type";
import type { SiteConfigAppResolve } from "../../../../../types/config/site.config.app-resolve.type";
import type { StructuredDataRegistryAppResolve } from "../../../../../types/registries/structured-data.registry.app-resolve.type";

import { resolveGlobalStructuredDataAppResolve } from "../../structured-data/global/global.structured-data.resolver.app-resolve";
import { resolveDerivedStructuredDataAppResolve } from "../../structured-data/derived/derived.structured-data.resolver.app-resolve";
import { resolveAuthoredStructuredDataAppResolve } from "../../structured-data/authored/authored.structured-data.resolver.app-resolve";

type Input = Readonly<{
  person: PersonConfigAppInit;
  site: SiteConfigAppInit;
  resolvedSite: SiteConfigAppResolve;
  content: ContentAppResolve;
}>;

type SchemaNode = Graph["@graph"][number];

type GraphNode = Readonly<{
  "@id"?: string;
  "@type"?: string | readonly string[];
  [key: string]: unknown;
}>;

// Inspection only: schema-dts nodes are treated as property records.
// This does not validate or transform the original graph entity.
const toGraphNode = (value: SchemaNode): GraphNode =>
  value as unknown as GraphNode;

const sameTypes = (
  left: string | readonly string[],
  right: string | readonly string[],
): boolean => {
  const leftTypes = typeof left === "string" ? [left] : [...left];
  const rightTypes = typeof right === "string" ? [right] : [...right];

  if (leftTypes.length !== rightTypes.length) {
    return false;
  }

  leftTypes.sort();
  rightTypes.sort();

  return leftTypes.every((type, index) => type === rightTypes[index]);
};

const getGraphOrigin = (graph: Graph["@graph"]): string => {
  const website = graph.map(toGraphNode).find((node) => {
    const type = node["@type"];

    return (
      type === "WebSite" || (Array.isArray(type) && type.includes("WebSite"))
    );
  });

  if (!website || typeof website["@id"] !== "string") {
    throw new Error(
      "Cannot resolve structured data: WebSite identifier is missing.",
    );
  }

  return new URL(website["@id"]).origin;
};

const mergeGraph = (graph: Graph["@graph"]): Graph["@graph"] => {
  const nodes = new Map<string, SchemaNode>();
  const withoutId: SchemaNode[] = [];

  for (const item of graph) {
    const node = toGraphNode(item);
    const id = node["@id"];

    if (typeof id !== "string" || id.length === 0) {
      withoutId.push(item);
      continue;
    }

    const existing = nodes.get(id);

    if (!existing) {
      nodes.set(id, item);
      continue;
    }

    const existingNode = toGraphNode(existing);

    if (
      existingNode["@type"] !== undefined &&
      node["@type"] !== undefined &&
      !sameTypes(existingNode["@type"], node["@type"])
    ) {
      throw new Error(`Conflicting structured data types for entity "${id}".`);
    }

    // The sources are schema-dts nodes. A shallow merge cannot be
    // proven to preserve every node-specific schema-dts constraint.
    // This assertion is therefore an explicit graph-merge boundary.
    const merged = {
      ...existingNode,
      ...node,
    } as SchemaNode;

    nodes.set(id, merged);
  }

  return [...nodes.values(), ...withoutId];
};

export const resolveStructuredDataRegistryAppResolve = ({
  person,
  site,
  resolvedSite,
  content,
}: Input): StructuredDataRegistryAppResolve => {
  const globalGraph = resolveGlobalStructuredDataAppResolve({
    person,
    site,
  });

  const derivedGraph = resolveDerivedStructuredDataAppResolve({
    content,
    site: resolvedSite,
  });

  const authoredGraph = resolveAuthoredStructuredDataAppResolve({
    structuredData: content.structuredData,
    origin: getGraphOrigin(globalGraph),
  });

  return mergeGraph([...globalGraph, ...derivedGraph, ...authoredGraph]);
};
