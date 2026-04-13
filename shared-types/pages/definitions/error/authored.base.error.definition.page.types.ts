// shared-types/pages/definitions/authored.base.error.definition.page.types.ts

import type { AuthoredBasePageDefinition } from "@shared-types/pages/definitions/authored.base.definition.page.types";
import type { ErrorPageStatus } from "@shared-types/pages/error/status.error.page.types";
import type { PageIdError } from "@shared-types/pages/shared/id.shared.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AuthoredErrorPageDeterministicFields = Readonly<{
  id: PageIdError;
  status: ErrorPageStatus;
}>;

export type AuthoredErrorPageDefinition = Replace<
  AuthoredBasePageDefinition,
  AuthoredErrorPageDeterministicFields
>;
