// src/shared/resolvers/content/body/body.content.resolver.shared.app-init.test.ts

import { resolveModuleContentAppInit } from "../modules/module.content.resolver.shared.app-init";
import { resolveContentBodyFooterAppInit } from "./footer/footer.body.content.resolver.shared.app-init";

import { resolveContentBodyAppInit } from "./body.content.resolver.shared.app-init";

jest.mock("../modules/module.content.resolver.shared.app-init", () => ({
  resolveModuleContentAppInit: jest.fn(),
}));

jest.mock("./footer/footer.body.content.resolver.shared.app-init", () => ({
  resolveContentBodyFooterAppInit: jest.fn(),
}));

const mockedModuleResolver = jest.mocked(resolveModuleContentAppInit);
const mockedFooterResolver = jest.mocked(resolveContentBodyFooterAppInit);

type Input = Parameters<typeof resolveContentBodyAppInit>[0];
type AuthoredModule = Input["authored"]["modules"][number];

describe("Content body AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];
  const dates = {} as Input["dates"];
  const topics = {} as Input["topics"];

  const createModule = (id: string): AuthoredModule =>
    ({
      id,
      kind: "pageIntro",
    }) as unknown as AuthoredModule;

  const createInput = (
    modules: readonly AuthoredModule[] = [],
    footer?: Input["authored"]["footer"],
  ): Input => ({
    authored: {
      modules,
      footer,
    },
    svgAssets,
    socialProfiles,
    dates,
    topics,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedModuleResolver.mockImplementation(
      ({ authored }) =>
        ({
          ...authored,
          resolved: true,
        }) as unknown as ReturnType<typeof resolveModuleContentAppInit>,
    );

    mockedFooterResolver.mockReturnValue([]);
  });

  describe("Module resolution", () => {
    it("returns an empty module collection when none are authored", () => {
      const result = resolveContentBodyAppInit(createInput());

      expect(result.modules).toEqual([]);
      expect(mockedModuleResolver).not.toHaveBeenCalled();
    });

    it("resolves a single body module", () => {
      const authored = createModule("intro");

      const result = resolveContentBodyAppInit(createInput([authored]));

      expect(mockedModuleResolver).toHaveBeenCalledWith({
        authored,
        svgAssets,
        socialProfiles,
        dates,
        topics,
      });

      expect(result.modules).toHaveLength(1);
    });

    it("resolves multiple modules in their authored order", () => {
      const modules = [
        createModule("intro"),
        createModule("photography"),
        createModule("related-content"),
      ];

      resolveContentBodyAppInit(createInput(modules));

      expect(mockedModuleResolver).toHaveBeenCalledTimes(3);

      modules.forEach((module, index) => {
        expect(mockedModuleResolver).toHaveBeenNthCalledWith(index + 1, {
          authored: module,
          svgAssets,
          socialProfiles,
          dates,
          topics,
        });
      });
    });

    it("preserves the resolved module results and their order", () => {
      const first = {
        id: "resolved-first",
      } as unknown as ReturnType<typeof resolveModuleContentAppInit>;

      const second = {
        id: "resolved-second",
      } as unknown as ReturnType<typeof resolveModuleContentAppInit>;

      mockedModuleResolver
        .mockReturnValueOnce(first)
        .mockReturnValueOnce(second);

      const result = resolveContentBodyAppInit(
        createInput([createModule("first"), createModule("second")]),
      );

      expect(result.modules).toEqual([first, second]);
      expect(result.modules[0]).toBe(first);
      expect(result.modules[1]).toBe(second);
    });
  });

  describe("Footer delegation", () => {
    it("passes an undefined footer to the footer resolver", () => {
      const input = createInput();

      resolveContentBodyAppInit(input);

      expect(mockedFooterResolver).toHaveBeenCalledWith({
        authored: undefined,
        svgAssets,
        socialProfiles,
        dates,
        topics,
      });

      expect(mockedFooterResolver).toHaveBeenCalledTimes(1);
    });

    it("passes authored footer modules and all dependencies", () => {
      const footer = [
        createModule("footer-links"),
      ] as Input["authored"]["footer"];

      resolveContentBodyAppInit(createInput([], footer));

      expect(mockedFooterResolver).toHaveBeenCalledWith({
        authored: footer,
        svgAssets,
        socialProfiles,
        dates,
        topics,
      });
    });

    it("returns the footer resolver output unchanged", () => {
      const footer = [
        {
          kind: "resolved-footer",
        },
      ] as unknown as ReturnType<typeof resolveContentBodyFooterAppInit>;

      mockedFooterResolver.mockReturnValue(footer);

      const result = resolveContentBodyAppInit(createInput());

      expect(result.footer).toBe(footer);
    });
  });

  describe("Resolver behaviour", () => {
    it("resolves body modules before resolving the footer", () => {
      resolveContentBodyAppInit(createInput([createModule("intro")]));

      expect(mockedModuleResolver.mock.invocationCallOrder[0]).toBeLessThan(
        mockedFooterResolver.mock.invocationCallOrder[0],
      );
    });

    it("propagates body module resolution failures", () => {
      const error = new Error("Module resolution failed");

      mockedModuleResolver.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        resolveContentBodyAppInit(createInput([createModule("intro")])),
      ).toThrow(error);

      expect(mockedFooterResolver).not.toHaveBeenCalled();
    });

    it("propagates footer resolution failures", () => {
      const error = new Error("Footer resolution failed");

      mockedFooterResolver.mockImplementation(() => {
        throw error;
      });

      expect(() => resolveContentBodyAppInit(createInput())).toThrow(error);
    });

    it("does not mutate the authored modules array", () => {
      const modules = [createModule("first"), createModule("second")];

      const original = [...modules];

      resolveContentBodyAppInit(createInput(modules));

      expect(modules).toEqual(original);
    });

    it("returns a fresh modules array", () => {
      const modules = [createModule("intro")];

      const result = resolveContentBodyAppInit(createInput(modules));

      expect(result.modules).not.toBe(modules);
    });
  });
});
