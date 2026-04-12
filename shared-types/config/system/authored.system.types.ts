// shared-types/config/system/app-state.system.types.ts

import type { GoneRules } from "./gone-rules.system.types";
import type { RedirectRules } from "./redirect-rules.system.types";

export type AuthoredSystem = {
  redirectRules: RedirectRules;
  goneRules: GoneRules;
};
