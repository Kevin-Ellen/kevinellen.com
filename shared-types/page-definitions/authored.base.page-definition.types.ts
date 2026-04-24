// shared-types/page-definitions/authored.base.page-definition.types.ts

import type { PageId } from "@shared-types/page-definitions/shared/shared.page-id.page-definition.types";
import type { PageMetadata } from "@shared-types/page-definitions/shared/shared.metadata.page-definition.types";
import type { AuthoredPageContent } from "@shared-types/page-content/authored.page-content.types";

export type AuthoredBasePageDefinition = Readonly<{
  id: PageId;
  metadata: PageMetadata;
  content: AuthoredPageContent;
  label: string;
}>;
