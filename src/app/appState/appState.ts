// src/app/appState/appState.ts

import type { SiteConfig } from "@app/config/site.config.types";
import type {
  AppAssets,
  AppStateInit,
  Pages,
  ErrorPageStatus,
} from "@app/appState/appState.types";
import type { PageDefinition } from "@app/pages/page.definition";

/**
 * AppState represents the raw, immutable application state
 * constructed at request start before repository indexing.
 *
 * It must remain free of derived logic.
 */
export class AppState {
  readonly siteConfig: SiteConfig;
  readonly appAssets: AppAssets;
  readonly pages: Pages;

  constructor(init: AppStateInit) {
    this.assertRequiredErrorPages(init);

    this.siteConfig = Object.freeze({ ...init.siteConfig });

    this.appAssets = Object.freeze({
      ...init.appAssets,
      scripts: Object.freeze([...init.appAssets.scripts]),
      svgs: Object.freeze([...init.appAssets.svgs]),
    });

    this.pages = Object.freeze({
      all: Object.freeze([...init.pages.all]),
      errors: Object.freeze({
        404: init.pages.errors[404],
        500: init.pages.errors[500],
      }),
    });
  }

  private assertRequiredErrorPages(init: AppStateInit): void {
    if (!init.pages?.errors?.[404]) {
      throw new Error(
        "Invariant violation: 404 error page is not registered in AppState.",
      );
    }

    if (!init.pages?.errors?.[500]) {
      throw new Error(
        "Invariant violation: 500 error page is not registered in AppState.",
      );
    }
  }

  public getPageBySlug(slug: string): PageDefinition | null {
    return this.pages.all.find((page) => page.core.slug === slug) ?? null;
  }

  public getErrorPageByStatus(status: ErrorPageStatus): PageDefinition {
    return this.pages.errors[status];
  }

  public toJSON(): AppStateInit {
    return {
      siteConfig: this.siteConfig,
      appAssets: this.appAssets,
      pages: this.pages,
    };
  }
}
