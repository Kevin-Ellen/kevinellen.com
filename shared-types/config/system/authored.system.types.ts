// shared-types/config/system/authored.system.types.ts

import type { SystemGoneRule } from "@shared-types/config/system/gone-rules.system.types";
import type { SystemRedirectRule } from "@shared-types/config/system/redirect-rules.system.types";

export type AuthoredSystem = Readonly<{
  redirectRules: readonly SystemRedirectRule[];
  goneRules: readonly SystemGoneRule[];
}>;
