// shared-types/page-definitions/authored.error.page-definition.types.ts

import type { AuthoredBasePageDefinition } from "@shared-types/page-definitions/authored.base.page-definition.types";
import type { ErrorPageStatus } from "@shared-types/page-definitions/shared/shared.error.page-definition.types";
import type { PageIdError } from "@shared-types/page-definitions/shared/shared.page-id.page-definition.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AuthoredErrorPageDefinitionSpecialisedFields = Readonly<{
  id: PageIdError;
  status: ErrorPageStatus;
}>;

export type AuthoredErrorPageDefinition = Replace<
  AuthoredBasePageDefinition,
  AuthoredErrorPageDefinitionSpecialisedFields
>;
