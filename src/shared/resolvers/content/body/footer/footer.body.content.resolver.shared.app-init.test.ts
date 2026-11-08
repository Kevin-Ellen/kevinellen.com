// src/shared/resolvers/content/body/footer/footer.body.content.resolver.shared.app-init.test.ts

import { resolveModuleContentAppInit } from "../../modules/module.content.resolver.shared.app-init";

import { resolveContentBodyFooterAppInit } from "./footer.body.content.resolver.shared.app-init";

jest.mock("../../modules/module.content.resolver.shared.app-init", () => ({
  resolveModuleContentAppInit: jest.fn(),
}));

const mockedModuleResolver = jest.mocked(resolveModuleContentAppInit);

type Input = Parameters<typeof resolveContentBodyFooterAppInit>[0];
type FooterModule = NonNullable<Input["authored"]>[number];

describe("Content body footer AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];
  const dates = {} as Input["dates"];
  const topics = {} as Input["topics"];

  const createModule = (id: string): FooterModule =>
    ({
      id,
      kind: "pageIntro",
    }) as unknown as FooterModule;

  const createInput = (authored?: Input["authored"]): Input => ({
    authored,
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
  });

  describe("Optional footer handling", () => {
    it("returns an empty array for an undefined footer", () => {
      const result = resolveContentBodyFooterAppInit(createInput());

      expect(result).toEqual([]);

      expect(mockedModuleResolver).not.toHaveBeenCalled();
    });

    it("returns an empty array for an empty footer", () => {
      const result = resolveContentBodyFooterAppInit(createInput([]));

      expect(result).toEqual([]);

      expect(mockedModuleResolver).not.toHaveBeenCalled();
    });

    it("returns a new empty array for each undefined footer", () => {
      const first = resolveContentBodyFooterAppInit(createInput());

      const second = resolveContentBodyFooterAppInit(createInput());

      expect(first).toEqual([]);
      expect(second).toEqual([]);
      expect(first).not.toBe(second);
    });
  });

  describe("Footer module resolution", () => {
    it("resolves a single footer module", () => {
      const authored = createModule("footer-links");

      const result = resolveContentBodyFooterAppInit(createInput([authored]));

      expect(mockedModuleResolver).toHaveBeenCalledWith({
        authored,
        svgAssets,
        socialProfiles,
        dates,
        topics,
      });

      expect(mockedModuleResolver).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
    });

    it("resolves every footer module in order", () => {
      const modules = [
        createModule("footer-navigation"),
        createModule("footer-social"),
        createModule("footer-related"),
      ];

      resolveContentBodyFooterAppInit(createInput(modules));

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

    it("preserves resolved module references and order", () => {
      const first = {
        id: "resolved-footer-one",
      } as unknown as ReturnType<typeof resolveModuleContentAppInit>;

      const second = {
        id: "resolved-footer-two",
      } as unknown as ReturnType<typeof resolveModuleContentAppInit>;

      mockedModuleResolver
        .mockReturnValueOnce(first)
        .mockReturnValueOnce(second);

      const result = resolveContentBodyFooterAppInit(
        createInput([createModule("first"), createModule("second")]),
      );

      expect(result).toEqual([first, second]);
      expect(result[0]).toBe(first);
      expect(result[1]).toBe(second);
    });

    it("passes all shared dependencies by reference", () => {
      const authored = createModule("footer");

      resolveContentBodyFooterAppInit(createInput([authored]));

      const input = mockedModuleResolver.mock.calls[0]?.[0];

      expect(input?.authored).toBe(authored);
      expect(input?.svgAssets).toBe(svgAssets);
      expect(input?.socialProfiles).toBe(socialProfiles);
      expect(input?.dates).toBe(dates);
      expect(input?.topics).toBe(topics);
    });
  });

  describe("Failure propagation and immutability", () => {
    it("propagates a module resolver failure", () => {
      const error = new Error("Footer module resolution failed");

      mockedModuleResolver.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        resolveContentBodyFooterAppInit(createInput([createModule("footer")])),
      ).toThrow(error);
    });

    it("stops resolving after the first module failure", () => {
      mockedModuleResolver.mockImplementation(() => {
        throw new Error("Resolution stopped");
      });

      expect(() =>
        resolveContentBodyFooterAppInit(
          createInput([createModule("first"), createModule("second")]),
        ),
      ).toThrow("Resolution stopped");

      expect(mockedModuleResolver).toHaveBeenCalledTimes(1);
    });

    it("does not mutate the authored footer array", () => {
      const modules = [createModule("first"), createModule("second")];

      const original = [...modules];

      resolveContentBodyFooterAppInit(createInput(modules));

      expect(modules).toEqual(original);
    });

    it("returns a new array rather than the authored footer array", () => {
      const modules = [createModule("footer")];

      const result = resolveContentBodyFooterAppInit(createInput(modules));

      expect(result).not.toBe(modules);
    });
  });
});
