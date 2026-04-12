// shared-types/content/pages/definitions/base.defintion.page.types

import type { PageId } from "@shared-types/pages/shared/id.shared.page.types";
import type { PageMetadata } from "@shared-types/pages/shared/metadata.shared.page.types";
import type { PageContent } from "../content/content.page.types";

export type BasePageDefinition = {
  id: PageId;
  metadata: PageMetadata;
  content: PageContent;
};
