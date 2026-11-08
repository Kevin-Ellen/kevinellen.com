// src/app/life-cycle/app-init/class.app-init.ts

import type { SiteConfigAppInit } from "../../../shared/types/config/site.config.shared.app-init.type";
import type { AssetConfigAppInit } from "../../../shared/resolvers/assets/asset.resolver.shared.app-init";
import type { PersonConfigAppInit } from "../../../shared/types/config/person.config.shared.app-init.type";
import type { TopicsConfigAppInit } from "../../types/config/topics/topics.config.app-init.type";
import type { NavigationConfigAppInit } from "../../types/config/navigation/navigation.config.app-init.type";
import type { FooterConfigAppInit } from "../../types/config/footer/footer.config.app-init.type";
import type { RobotsTxtConfigAppInit } from "../../types/config/robots-txt/robots-txt.config.app-init.type";
import type { ResourcesConfigAppInit } from "../../types/config/resources/resources.config.app-init.type";
import type { ContentConfigAppInit } from "../../../shared/resolvers/config/content.config.resolver.shared.app-init";

export type AppInitContext = Readonly<{
  site: SiteConfigAppInit;
  assets: AssetConfigAppInit;
  person: PersonConfigAppInit;
  topics: TopicsConfigAppInit;
  navigation: NavigationConfigAppInit;
  footer: FooterConfigAppInit;
  robotsTxt: RobotsTxtConfigAppInit;
  resources: ResourcesConfigAppInit;
  content: ContentConfigAppInit;
}>;

export class AppInit {
  readonly #context: AppInitContext;

  constructor(context: AppInitContext) {
    this.#context = context;
  }

  get site(): SiteConfigAppInit {
    return this.#context.site;
  }

  get person(): PersonConfigAppInit {
    return this.#context.person;
  }

  get robotsTxt(): RobotsTxtConfigAppInit {
    return this.#context.robotsTxt;
  }

  public get content(): ContentConfigAppInit {
    return this.#context.content;
  }

  public get assets(): AssetConfigAppInit {
    return this.#context.assets;
  }

  public get navigation(): NavigationConfigAppInit {
    return this.#context.navigation;
  }

  public get footer(): FooterConfigAppInit {
    return this.#context.footer;
  }

  // Inspection getter
  get toInspectionSnapshot(): AppInitContext {
    return this.#context;
  }
}
