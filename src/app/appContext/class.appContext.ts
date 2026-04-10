// src/app/appContext/class.appContext.ts

import type {
  AppContextAssets,
  AppContextModel,
  AppContextBranding,
  AppContextBreadcrumb,
  AppContextMetadata,
  AppContextNavigation,
  AppContextPage,
  AppContextRequest,
  AppContextSiteIdentity,
  AppContextPageFooter,
  AppContextStructuredDataItem,
  AppContextHeadIcons,
  AppContextPhoto,
  AppContextPhotoId,
  AppContextPhotoMetadataConfig,
} from "@app/appContext/appContext.types";
import type { AppContextPageBodyContent } from "@app/appContext/content/content.appContext.types";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

export class AppContext {
  readonly #request: AppContextRequest;
  readonly #target: DocumentRenderTarget;
  readonly #page: AppContextPage;
  readonly #metadata: AppContextMetadata;
  readonly #breadcrumbs: readonly AppContextBreadcrumb[];
  readonly #navigation: AppContextNavigation;
  readonly #branding: AppContextBranding;
  readonly #siteIdentity: AppContextSiteIdentity;
  readonly #assets: AppContextAssets;
  readonly #pageFooter: AppContextPageFooter;
  readonly #structuredData: readonly AppContextStructuredDataItem[];
  readonly #content: AppContextPageBodyContent;
  readonly #icons: AppContextHeadIcons;
  readonly #photos: readonly AppContextPhoto[];
  readonly #photosById: Map<AppContextPhotoId, AppContextPhoto>;
  readonly #photoMetadata: AppContextPhotoMetadataConfig;

  public constructor(input: AppContextModel) {
    this.#request = input.request;
    this.#target = input.target;
    this.#page = input.page;
    this.#metadata = input.metadata;
    this.#breadcrumbs = input.breadcrumbs;
    this.#navigation = input.navigation;
    this.#branding = input.branding;
    this.#siteIdentity = input.siteIdentity;
    this.#assets = input.assets;
    this.#pageFooter = input.pageFooter;
    this.#structuredData = input.structuredData;
    this.#content = input.content;
    this.#icons = input.icons;
    this.#photos = input.photos;
    this.#photoMetadata = input.photoMetadata;

    this.#photosById = new Map(input.photos.map((photo) => [photo.id, photo]));
  }

  public get request(): AppContextRequest {
    return this.#request;
  }

  public get target(): DocumentRenderTarget {
    return this.#target;
  }

  public get page(): AppContextPage {
    return this.#page;
  }

  public get metadata(): AppContextMetadata {
    return this.#metadata;
  }

  public get breadcrumbs(): readonly AppContextBreadcrumb[] {
    return this.#breadcrumbs;
  }

  public get navigation(): AppContextNavigation {
    return this.#navigation;
  }

  public get branding(): AppContextBranding {
    return this.#branding;
  }

  public get siteIdentity(): AppContextSiteIdentity {
    return this.#siteIdentity;
  }

  public get assets(): AppContextAssets {
    return this.#assets;
  }

  public get pageFooter(): AppContextPageFooter {
    return this.#pageFooter;
  }

  public get structuredData(): readonly AppContextStructuredDataItem[] {
    return this.#structuredData;
  }

  public get content(): AppContextPageBodyContent {
    return this.#content;
  }

  public get icons(): AppContextHeadIcons {
    return this.#icons;
  }

  public get photos(): readonly AppContextPhoto[] {
    return this.#photos;
  }

  public get photoMetadata(): AppContextPhotoMetadataConfig {
    return this.#photoMetadata;
  }

  public getPhotoRecordById(id: AppContextPhotoId): AppContextPhoto {
    const photo = this.#photosById.get(id);

    if (!photo) {
      throw new Error(`Photo "${id}" not found in AppContext.`);
    }

    return photo;
  }
}
