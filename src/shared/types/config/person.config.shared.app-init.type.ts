// src/shared/types/config/person.config.shared.app-init.type.ts

import type { PersonConfigAuthored } from "./person.config.shared.authored.type";

export type PersonConfigAppInit = PersonConfigAuthored &
  Readonly<{
    website: string;
  }>;
