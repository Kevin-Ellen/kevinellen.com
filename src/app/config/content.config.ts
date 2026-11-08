// src/app/config/content.config.ts

import type { ContentAuthored } from "../../content-schema/content/content.content-schema.authored.type";
import type { TopicId } from "../../content-schema/topics/topic-id.topics.content-schema.type";

import { topicsConfigAuthored } from "../../shared/config/topics.config.shared.app-state";

import { aboutContentAuthored } from "../content/about/about.content.authored";
import { approachToPhotographyAboutContentAuthored } from "../content/about/approach-to-photography.about.content.authored";
import { equipmentAboutContentAuthored } from "../content/about/equipment.about.content.authored";
import { localInEssexAboutContentAuthored } from "../content/about/local-in-essex.about.content.authored";
import { travelsAboutContentAuthored } from "../content/about/travels.about.content.authored";

import { termsLegalContentAuthored } from "../content/legal/terms.legal.content.authored";
import { privacyLegalContentAuthored } from "../content/legal/privacy.legal.content.authored";
import { licensingLegalContentAuthored } from "../content/legal/licensing.legal.content.authored";

import { journalContentAuthored } from "../content/journal/journal.composed.content.authored";

import { topicsContentAuthored } from "../content/topics/topics.composed.content.authored";
import { createTopicEntryContentAuthored } from "../content/topics/entry.topics.composed.content.authored";

import { homeContentAuthored } from "../content/home.composed.content.authored";

import { notFoundContentAuthored } from "../content/errors/404.error.static.content.authored";

export const topicEntriesContentAuthored = (
  Object.keys(topicsConfigAuthored) as TopicId[]
).map((id) =>
  createTopicEntryContentAuthored({
    id,
    topic: topicsConfigAuthored[id],
  }),
);

export const contentConfigAuthored = [
  // About
  aboutContentAuthored,
  approachToPhotographyAboutContentAuthored,
  equipmentAboutContentAuthored,
  localInEssexAboutContentAuthored,
  travelsAboutContentAuthored,

  // Legal
  termsLegalContentAuthored,
  privacyLegalContentAuthored,
  licensingLegalContentAuthored,

  // Journal landing page
  journalContentAuthored,

  // Topics landing page
  topicsContentAuthored,
  ...topicEntriesContentAuthored,

  // Homepage
  homeContentAuthored,

  // Errors
  notFoundContentAuthored,
] as const satisfies readonly ContentAuthored[];
