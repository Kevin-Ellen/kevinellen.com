// src/app/life-cycle/app-init/resolvers/person/person.resolver.app-init.ts

import type { PersonConfigAuthored } from "../../../../../shared/types/config/person.config.shared.authored.type";
import type { PersonConfigAppInit } from "../../../../../shared/types/config/person.config.shared.app-init.type";

type Input = Readonly<{
  authored: PersonConfigAuthored;
  canonicalDomain: string;
}>;

export const resolvePersonConfigAppInit = ({
  authored,
  canonicalDomain,
}: Input): PersonConfigAppInit => ({
  ...authored,
  website: canonicalDomain,
});
