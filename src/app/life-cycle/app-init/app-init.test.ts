// src/app/life-cycle/app-init/app-init.test.ts

import type { ValidatedEnv } from "../../entry.type";

import { AppInit } from "./class.app-init";
import { createAppInit } from "./app-init";

import { siteConfigAuthored } from "../../../shared/config/site.config.shared.authored";
import { personConfigAuthored } from "../../../shared/config/person.config.shared.authored";
import { navigationConfigAuthored } from "../../config/navigation.config";
import { footerConfigAuthored } from "../../config/footer.config";
import { robotsTxtConfigAuthored } from "../../config/robots-txt.config";
import { resourcesConfigAuthored } from "../../config/resources.config";
import { contentConfigAuthored } from "../../config/content.config";
import { topicsConfigAuthored } from "../../../shared/config/topics.config.shared.app-state";

import { resolveSiteConfigAppInit } from "./resolvers/site/site.resolver.app-init";
import { resolveAssetConfigAppInit } from "../../../shared/resolvers/assets/asset.resolver.shared.app-init";
import { resolvePersonConfigAppInit } from "./resolvers/person/person.resolver.app-init";
import { resolveNavigationConfigAppInit } from "./resolvers/navigation/navigation.resolver.app-init";
import { resolveFooterConfigAppInit } from "./resolvers/footer/footer.resolver.app-init";
import { resolveRobotsTxtConfigAppInit } from "./resolvers/robots-txt/robots-txt.resolver.app-init";
import { resolveResourcesConfigAppInit } from "./resolvers/resources/resources.resolver.app-init";
import { resolveContentConfigAppInit } from "../../../shared/resolvers/config/content.config.resolver.shared.app-init";
import { resolveTopicsConfigAppInit } from "../../../shared/resolvers/content/topics/topics.resolve.shared.app-init";

jest.mock("./resolvers/site/site.resolver.app-init", () => ({
  resolveSiteConfigAppInit: jest.fn(),
}));

jest.mock(
  "../../../shared/resolvers/assets/asset.resolver.shared.app-init",
  () => ({
    resolveAssetConfigAppInit: jest.fn(),
  }),
);

jest.mock("./resolvers/person/person.resolver.app-init", () => ({
  resolvePersonConfigAppInit: jest.fn(),
}));

jest.mock("./resolvers/navigation/navigation.resolver.app-init", () => ({
  resolveNavigationConfigAppInit: jest.fn(),
}));

jest.mock("./resolvers/footer/footer.resolver.app-init", () => ({
  resolveFooterConfigAppInit: jest.fn(),
}));

jest.mock("./resolvers/robots-txt/robots-txt.resolver.app-init", () => ({
  resolveRobotsTxtConfigAppInit: jest.fn(),
}));

jest.mock("./resolvers/resources/resources.resolver.app-init", () => ({
  resolveResourcesConfigAppInit: jest.fn(),
}));

jest.mock(
  "../../../shared/resolvers/content/topics/topics.resolve.shared.app-init",
  () => ({
    resolveTopicsConfigAppInit: jest.fn(),
  }),
);

jest.mock(
  "../../../shared/resolvers/config/content.config.resolver.shared.app-init",
  () => ({
    resolveContentConfigAppInit: jest.fn(),
  }),
);

const mockedSite = jest.mocked(resolveSiteConfigAppInit);
const mockedAssets = jest.mocked(resolveAssetConfigAppInit);
const mockedPerson = jest.mocked(resolvePersonConfigAppInit);
const mockedNavigation = jest.mocked(resolveNavigationConfigAppInit);
const mockedFooter = jest.mocked(resolveFooterConfigAppInit);
const mockedRobotsTxt = jest.mocked(resolveRobotsTxtConfigAppInit);
const mockedResources = jest.mocked(resolveResourcesConfigAppInit);
const mockedTopics = jest.mocked(resolveTopicsConfigAppInit);
const mockedContent = jest.mocked(resolveContentConfigAppInit);

describe("createAppInit", () => {
  const env = {
    DOMAIN: "https://kevinellen.com",
  } as ValidatedEnv;

  const site = {
    canonicalDomain: "https://kevinellen.com",
  } as ReturnType<typeof resolveSiteConfigAppInit>;

  const svgAssets = {} as ReturnType<typeof resolveAssetConfigAppInit>["svg"];

  const assets = {
    svg: svgAssets,
    scripts: {
      registry: {
        "header-headroom": {},
      },
    },
  } as unknown as ReturnType<typeof resolveAssetConfigAppInit>;

  const socialProfiles = {
    instagram: "https://instagram.com/example",
  };

  const person = {
    name: "Test Photographer",
    socialProfiles,
  } as unknown as ReturnType<typeof resolvePersonConfigAppInit>;

  const navigation = {} as ReturnType<typeof resolveNavigationConfigAppInit>;
  const footer = {} as ReturnType<typeof resolveFooterConfigAppInit>;
  const robotsTxt = {} as ReturnType<typeof resolveRobotsTxtConfigAppInit>;
  const resources = {} as ReturnType<typeof resolveResourcesConfigAppInit>;
  const topics = {} as ReturnType<typeof resolveTopicsConfigAppInit>;
  const content = {} as ReturnType<typeof resolveContentConfigAppInit>;

  const initialise = () => createAppInit({ env });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedSite.mockReturnValue(site);
    mockedAssets.mockReturnValue(assets);
    mockedPerson.mockReturnValue(person);
    mockedNavigation.mockReturnValue(navigation);
    mockedFooter.mockReturnValue(footer);
    mockedRobotsTxt.mockReturnValue(robotsTxt);
    mockedResources.mockReturnValue(resources);
    mockedTopics.mockReturnValue(topics);
    mockedContent.mockReturnValue(content);
  });

  describe("Resolver orchestration", () => {
    it("resolves all nine configuration sections exactly once", () => {
      initialise();

      expect(mockedSite).toHaveBeenCalledTimes(1);
      expect(mockedAssets).toHaveBeenCalledTimes(1);
      expect(mockedPerson).toHaveBeenCalledTimes(1);
      expect(mockedNavigation).toHaveBeenCalledTimes(1);
      expect(mockedFooter).toHaveBeenCalledTimes(1);
      expect(mockedRobotsTxt).toHaveBeenCalledTimes(1);
      expect(mockedResources).toHaveBeenCalledTimes(1);
      expect(mockedTopics).toHaveBeenCalledTimes(1);
      expect(mockedContent).toHaveBeenCalledTimes(1);
    });

    it("resolves configuration in dependency order", () => {
      initialise();

      const callOrder = [
        mockedSite,
        mockedPerson,
        mockedAssets,
        mockedNavigation,
        mockedFooter,
        mockedRobotsTxt,
        mockedResources,
        mockedTopics,
        mockedContent,
      ].map((resolver) => resolver.mock.invocationCallOrder[0]);

      expect(callOrder).toEqual([...callOrder].sort((a, b) => a - b));
    });

    it("passes the validated environment to the site resolver", () => {
      initialise();

      expect(mockedSite).toHaveBeenCalledWith({
        authored: siteConfigAuthored,
        env,
      });
    });

    it("resolves the person using the site's canonical domain", () => {
      initialise();

      expect(mockedPerson).toHaveBeenCalledWith({
        authored: personConfigAuthored,
        canonicalDomain: site.canonicalDomain,
      });
    });

    it("initialises the asset resolver without arguments", () => {
      initialise();

      expect(mockedAssets).toHaveBeenCalledWith();
    });

    it("passes SVG assets and social profiles to navigation", () => {
      initialise();

      expect(mockedNavigation).toHaveBeenCalledWith({
        authored: navigationConfigAuthored,
        svgAssets,
        socialProfiles,
      });
    });

    it("passes resolved assets and person to footer", () => {
      initialise();

      expect(mockedFooter).toHaveBeenCalledWith({
        authored: footerConfigAuthored,
        svgAssets,
        person,
      });
    });

    it("resolves robots.txt using the canonical domain", () => {
      initialise();

      expect(mockedRobotsTxt).toHaveBeenCalledWith({
        authored: robotsTxtConfigAuthored,
        canonicalDomain: site.canonicalDomain,
      });
    });

    it("passes authored resources to the resources resolver", () => {
      initialise();

      expect(mockedResources).toHaveBeenCalledWith({
        authored: resourcesConfigAuthored,
      });
    });

    it("passes authored topics to the topics resolver", () => {
      initialise();

      expect(mockedTopics).toHaveBeenCalledWith({
        authored: topicsConfigAuthored,
      });
    });

    it("passes all required dependencies to content resolution", () => {
      initialise();

      expect(mockedContent).toHaveBeenCalledWith({
        authored: contentConfigAuthored,
        svgAssets,
        socialProfiles,
        scriptIds: ["header-headroom"],
        topics,
      });
    });
  });

  describe("Script ID extraction", () => {
    it("extracts script IDs from the resolved asset registry", () => {
      initialise();

      const input = mockedContent.mock.calls[0]?.[0];

      expect(input?.scriptIds).toEqual(["header-headroom"]);
    });

    it("passes an empty array when the script registry is empty", () => {
      mockedAssets.mockReturnValue({
        ...assets,
        scripts: {
          ...assets.scripts,
          registry: {} as typeof assets.scripts.registry,
        },
      });

      initialise();

      expect(mockedContent).toHaveBeenCalledWith(
        expect.objectContaining({
          scriptIds: [],
        }),
      );
    });

    it("preserves script registry key order", () => {
      mockedAssets.mockReturnValue({
        ...assets,
        scripts: {
          ...assets.scripts,
          registry: {
            "header-headroom": assets.scripts.registry["header-headroom"],
            // Runtime registry keys are deliberately tested here.
            ...({
              "additional-script": {},
            } as Record<string, unknown>),
          },
        },
      });

      initialise();

      const input = mockedContent.mock.calls[0]?.[0];

      expect(input?.scriptIds).toEqual([
        "header-headroom",
        "additional-script",
      ]);
    });
  });

  describe("AppInit construction", () => {
    it("returns an AppInit instance", () => {
      const result = initialise();

      expect(result).toBeInstanceOf(AppInit);
    });

    it("contains every resolved configuration", () => {
      const result = initialise();

      expect(result.toInspectionSnapshot).toEqual({
        site,
        assets,
        person,
        topics,
        navigation,
        footer,
        robotsTxt,
        resources,
        content,
      });
    });

    it("preserves the resolved configuration references", () => {
      const result = initialise();

      expect(result.site).toBe(site);
      expect(result.assets).toBe(assets);
      expect(result.person).toBe(person);
      expect(result.navigation).toBe(navigation);
      expect(result.footer).toBe(footer);
      expect(result.robotsTxt).toBe(robotsTxt);
      expect(result.content).toBe(content);
    });

    it("preserves topics and resources in the inspection snapshot", () => {
      const result = initialise();

      expect(result.toInspectionSnapshot.topics).toBe(topics);
      expect(result.toInspectionSnapshot.resources).toBe(resources);
    });

    it("constructs a new AppInit instance on every invocation", () => {
      const first = initialise();
      const second = initialise();

      expect(first).not.toBe(second);
      expect(first.toInspectionSnapshot).not.toBe(second.toInspectionSnapshot);
    });
  });

  describe("Failure propagation", () => {
    it("propagates site resolution failures", () => {
      const error = new Error("Site configuration failed");

      mockedSite.mockImplementation(() => {
        throw error;
      });

      expect(initialise).toThrow(error);

      expect(mockedPerson).not.toHaveBeenCalled();
      expect(mockedAssets).not.toHaveBeenCalled();
    });

    it("propagates asset resolution failures", () => {
      const error = new Error("Asset configuration failed");

      mockedAssets.mockImplementation(() => {
        throw error;
      });

      expect(initialise).toThrow(error);

      expect(mockedNavigation).not.toHaveBeenCalled();
      expect(mockedContent).not.toHaveBeenCalled();
    });

    it("propagates content resolution failures", () => {
      const error = new Error("Content configuration failed");

      mockedContent.mockImplementation(() => {
        throw error;
      });

      expect(initialise).toThrow(error);
    });
  });
});
