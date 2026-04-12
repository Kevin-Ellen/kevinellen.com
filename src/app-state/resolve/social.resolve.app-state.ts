// src/app-state/resolve/social.resolve.app-state.ts

import type { AppStateSocial } from "@shared-types/config/social/app-state.social.types";

import { authoredSocial } from "@app-state/config/social/authored.social.app-state";

export const appStateResolveSocial: AppStateSocial = authoredSocial;
