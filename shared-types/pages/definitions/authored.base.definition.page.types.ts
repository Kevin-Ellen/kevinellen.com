// shared-types/pages/definitions/authored.base.definition.page.types.ts

import type { PageId } from "@shared-types/pages/shared/id.shared.page.types";
import type { PageMetadata } from "@shared-types/pages/shared/metadata.shared.page.types";
import type { AuthoredPageContent } from "@shared-types/page-content/authored.page-content.types";

export type AuthoredBasePageDefinition = Readonly<{
  id: PageId;
  metadata: PageMetadata;
  content: AuthoredPageContent;
}>;
