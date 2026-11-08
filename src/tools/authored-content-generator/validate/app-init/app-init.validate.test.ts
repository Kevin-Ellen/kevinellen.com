// src/tools/authored-content-generator/validate/app-init/app-init.validate.test.ts

import type { ContentAuthored } from "../../../../content-schema/content/content.content-schema.authored.type";
import type { PhotoAssetAuthored } from "../../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";

import { resolveContentAppInit } from "../../../../shared/resolvers/content/content.resolver.shared.app-init";
import { resolveAssetConfigAppInit } from "../../../../shared/resolvers/assets/asset.resolver.shared.app-init";
import { resolveTopicsConfigAppInit } from "../../../../shared/resolvers/content/topics/topics.resolve.shared.app-init";
import { resolvePhotoAppInit } from "../../../../shared/resolvers/assets/photo/photo.asset.resolver.shared.app-init";

import { personConfigAuthored } from "../../../../shared/config/person.config.shared.authored";
import { topicsConfigAuthored } from "../../../../shared/config/topics.config.shared.app-state";

import {
  validateContentAppInit,
  validatePhotoAppInit,
} from "./app-init.validate";

jest.mock(
  "../../../../shared/resolvers/content/content.resolver.shared.app-init",
  () => ({
    resolveContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "../../../../shared/resolvers/assets/asset.resolver.shared.app-init",
  () => ({
    resolveAssetConfigAppInit: jest.fn(),
  }),
);

jest.mock(
  "../../../../shared/resolvers/content/topics/topics.resolve.shared.app-init",
  () => ({
    resolveTopicsConfigAppInit: jest.fn(),
  }),
);

jest.mock(
  "../../../../shared/resolvers/assets/photo/photo.asset.resolver.shared.app-init",
  () => ({
    resolvePhotoAppInit: jest.fn(),
  }),
);

const mockedContent = jest.mocked(resolveContentAppInit);
const mockedAssets = jest.mocked(resolveAssetConfigAppInit);
const mockedTopics = jest.mocked(resolveTopicsConfigAppInit);
const mockedPhoto = jest.mocked(resolvePhotoAppInit);

describe("Authored AppInit validation", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockedAssets.mockReturnValue({
      svg: { logo: { id: "logo" } },
      scripts: {
        registry: {
          analytics: {},
          navigation: {},
        },
      },
    } as never);

    mockedTopics.mockReturnValue({
      wildlife: { id: "wildlife" },
    } as never);

    mockedContent.mockReturnValue({
      id: "journal-example",
    } as never);

    mockedPhoto.mockReturnValue({
      id: "forest-fox",
    } as never);
  });

  describe("Content AppInit", () => {
    const authored = {
      id: "journal-example",
      kind: "public",
      pageType: "journalEntry",
    } as ContentAuthored;

    it("resolves asset and topic configurations", () => {
      validateContentAppInit(authored);

      expect(mockedAssets).toHaveBeenCalledTimes(1);

      expect(mockedTopics).toHaveBeenCalledWith({
        authored: topicsConfigAuthored,
      });
    });

    it("passes all required dependencies to the content resolver", () => {
      validateContentAppInit(authored);

      expect(mockedContent).toHaveBeenCalledWith({
        authored,
        svgAssets: {
          logo: { id: "logo" },
        },
        socialProfiles: personConfigAuthored.socialProfiles,
        scriptIds: ["analytics", "navigation"],
        topics: {
          wildlife: { id: "wildlife" },
        },
      });
    });

    it("returns the resolved content AppInit", () => {
      const result = validateContentAppInit(authored);

      expect(result).toEqual({
        id: "journal-example",
      });
    });

    it("handles an empty script registry", () => {
      mockedAssets.mockReturnValue({
        svg: {},
        scripts: { registry: {} },
      } as never);

      validateContentAppInit(authored);

      expect(mockedContent).toHaveBeenCalledWith(
        expect.objectContaining({
          scriptIds: [],
        }),
      );
    });

    it("propagates asset resolver errors", () => {
      const error = new Error("Invalid asset configuration");

      mockedAssets.mockImplementation(() => {
        throw error;
      });

      expect(() => validateContentAppInit(authored)).toThrow(error);

      expect(mockedContent).not.toHaveBeenCalled();
    });

    it("propagates topic resolver errors", () => {
      const error = new Error("Invalid topic configuration");

      mockedTopics.mockImplementation(() => {
        throw error;
      });

      expect(() => validateContentAppInit(authored)).toThrow(error);

      expect(mockedContent).not.toHaveBeenCalled();
    });

    it("propagates content resolver errors", () => {
      const error = new Error("Content AppInit failed");

      mockedContent.mockImplementation(() => {
        throw error;
      });

      expect(() => validateContentAppInit(authored)).toThrow(error);
    });
  });

  describe("Photo AppInit", () => {
    const authored = {
      id: "forest-fox",
    } as PhotoAssetAuthored;

    it("passes authored photo metadata to the resolver", () => {
      validatePhotoAppInit(authored);

      expect(mockedPhoto).toHaveBeenCalledWith(authored);
      expect(mockedPhoto).toHaveBeenCalledTimes(1);
    });

    it("returns the resolved photo AppInit", () => {
      const result = validatePhotoAppInit(authored);

      expect(result).toEqual({
        id: "forest-fox",
      });
    });

    it("propagates photo resolver errors", () => {
      const error = new Error("Photo AppInit failed");

      mockedPhoto.mockImplementation(() => {
        throw error;
      });

      expect(() => validatePhotoAppInit(authored)).toThrow(error);
    });
  });
});
