// src/app-state/resolve/system.resolve.app-state.ts

import type { AppStateSystem } from "@shared-types/config/system/app-state.system.types";

import { REDIRECT_RULES } from "@app-state/config/system/authored.redirect-rules.system.app-state";
import { GONE_RULES } from "@app-state/config/system/authored.gone-rules.system.app-state";

import { deepFreeze } from "@utils/deepFreeze.util";

export const appStateResolveSystem: AppStateSystem = deepFreeze({
  redirectRules: REDIRECT_RULES,
  goneRules: GONE_RULES,
});
