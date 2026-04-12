// shared-types/pages/definitions/authored.base.error.definition.page.types.ts

import type { BasePageDefinition } from "@shared-types/pages/definitions/base.definition.page.types";
import type { ErrorPageStatus } from "@shared-types/pages/error/status.error.page.types";
import type { PageIdError } from "@shared-types/pages/shared/id.shared.page.types";

export type AuthoredErrorPageDefinition = Omit<BasePageDefinition, "id"> & {
  id: PageIdError;
  status: ErrorPageStatus;
};
