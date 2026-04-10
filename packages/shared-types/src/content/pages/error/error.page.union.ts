// packages/shared-types/src/content/pages/error/error.page.union.ts

import type { BaseErrorPageDefinition } from "@shared-types/content/pages/error/error.page.definition";
import type { ErrorPageContentAuthored } from "@shared-types/content/pages/error/error.page.content";

export type ErrorPage = BaseErrorPageDefinition<ErrorPageContentAuthored>;
