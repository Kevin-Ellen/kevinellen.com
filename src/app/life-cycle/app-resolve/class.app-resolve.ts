// src/app/life-cycle/app-resolve/class.app-resolve.ts

import type { SiteConfigAppResolve } from "../../types/config/site.config.app-resolve.type";
import type { ContentAppResolve } from "../../types/document/page/content/content.page.document.app-resolve.type";
import type { RegistriesAppResolve } from "../../types/registries/registries.app-resolve.type";
import type { ShellAppResolve } from "../../types/document/shell.document.app-resolve.type";

export type AppResolveContext = Readonly<{
  site: SiteConfigAppResolve;
  registries: RegistriesAppResolve;
  shell: ShellAppResolve;
  content: ContentAppResolve;
}>;

export class AppResolve {
  readonly #context: AppResolveContext;

  constructor(context: AppResolveContext) {
    this.#context = context;
  }

  get status(): ContentAppResolve["status"] {
    return this.#context.content.status;
  }

  get site(): SiteConfigAppResolve {
    return this.#context.site;
  }

  get content(): ContentAppResolve {
    return this.#context.content;
  }

  get scripts(): RegistriesAppResolve["scripts"] {
    return this.#context.registries.scripts;
  }

  get svgs(): RegistriesAppResolve["svg"] {
    return this.#context.registries.svg;
  }

  get shell(): ShellAppResolve {
    return this.#context.shell;
  }

  get structuredData(): RegistriesAppResolve["structuredData"] {
    return this.#context.registries.structuredData;
  }

  // Inspection getter
  get toInspectionSnapshot(): AppResolveContext {
    return this.#context;
  }
}
