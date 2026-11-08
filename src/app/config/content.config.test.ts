// src/app/config/content.config.test.ts

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

import {
  contentConfigAuthored,
  topicEntriesContentAuthored,
} from "./content.config";

describe("Authored content configuration", () => {
  const staticEntries = [
    aboutContentAuthored,
    approachToPhotographyAboutContentAuthored,
    equipmentAboutContentAuthored,
    localInEssexAboutContentAuthored,
    travelsAboutContentAuthored,
    termsLegalContentAuthored,
    privacyLegalContentAuthored,
    licensingLegalContentAuthored,
    journalContentAuthored,
    topicsContentAuthored,
    homeContentAuthored,
    notFoundContentAuthored,
  ];

  describe("Topic entries", () => {
    it("generates one entry per configured topic", () => {
      expect(topicEntriesContentAuthored).toHaveLength(
        Object.keys(topicsConfigAuthored).length,
      );
    });

    it("generates entries in configured topic order", () => {
      const expected = Object.entries(topicsConfigAuthored).map(([id, topic]) =>
        createTopicEntryContentAuthored({
          id: id as keyof typeof topicsConfigAuthored,
          topic,
        }),
      );

      expect(topicEntriesContentAuthored).toEqual(expected);
    });

    it("does not generate duplicate topic pages", () => {
      const ids = topicEntriesContentAuthored.map((entry) => entry.id);

      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("Content registry", () => {
    it("includes every explicitly registered page", () => {
      for (const entry of staticEntries) {
        expect(contentConfigAuthored).toContain(entry);
      }
    });

    it("includes every generated topic page", () => {
      for (const entry of topicEntriesContentAuthored) {
        expect(contentConfigAuthored).toContain(entry);
      }
    });

    it("contains the expected number of entries", () => {
      expect(contentConfigAuthored).toHaveLength(
        staticEntries.length + topicEntriesContentAuthored.length,
      );
    });

    it("does not register duplicate content IDs", () => {
      const ids = contentConfigAuthored.map((entry) => entry.id);

      expect(new Set(ids).size).toBe(ids.length);
    });

    it("registers the homepage before the 404 fallback", () => {
      const homepageIndex = contentConfigAuthored.indexOf(homeContentAuthored);

      const notFoundIndex = contentConfigAuthored.indexOf(
        notFoundContentAuthored,
      );

      expect(homepageIndex).toBeGreaterThan(-1);
      expect(notFoundIndex).toBeGreaterThan(homepageIndex);
    });

    it("registers topic pages after the topics landing page", () => {
      const topicsIndex = contentConfigAuthored.indexOf(topicsContentAuthored);

      for (const entry of topicEntriesContentAuthored) {
        expect(contentConfigAuthored.indexOf(entry)).toBeGreaterThan(
          topicsIndex,
        );
      }
    });

    it("preserves the intended registry order", () => {
      expect(contentConfigAuthored).toEqual([
        aboutContentAuthored,
        approachToPhotographyAboutContentAuthored,
        equipmentAboutContentAuthored,
        localInEssexAboutContentAuthored,
        travelsAboutContentAuthored,
        termsLegalContentAuthored,
        privacyLegalContentAuthored,
        licensingLegalContentAuthored,
        journalContentAuthored,
        topicsContentAuthored,
        ...topicEntriesContentAuthored,
        homeContentAuthored,
        notFoundContentAuthored,
      ]);
    });
  });
});
