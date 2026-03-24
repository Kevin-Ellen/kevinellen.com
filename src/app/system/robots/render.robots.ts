// src/app/system/robots/render.robots.ts

import type {
  RobotsDocument,
  RobotsRule,
} from "@app/system/robots/robots.types";

const renderRule = (rule: RobotsRule): string[] => {
  const lines: string[] = [`User-agent: ${rule.userAgent}`];

  for (const path of rule.allow ?? []) {
    lines.push(`Allow: ${path}`);
  }

  for (const path of rule.disallow ?? []) {
    lines.push(`Disallow: ${path}`);
  }

  return lines;
};

export const renderRobotsDocument = (document: RobotsDocument): string => {
  const lines: string[] = [];

  document.rules.forEach((rule, index) => {
    if (index > 0) {
      lines.push("");
    }

    lines.push(...renderRule(rule));
  });

  if (document.sitemaps.length > 0) {
    if (lines.length > 0) {
      lines.push("");
    }

    for (const sitemap of document.sitemaps) {
      lines.push(`Sitemap: ${sitemap}`);
    }
  }

  return `${lines.join("\n")}\n`;
};
