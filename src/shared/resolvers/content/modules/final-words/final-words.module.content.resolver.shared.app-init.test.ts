// src/shared/resolvers/content/modules/final-words/final-words.module.content.resolver.shared.app-init.test.ts

import { resolveComponentContentAppInit } from "../../components/component.content.resolver.shared.app-init";

import { resolveFinalWordsModuleContentAppInit } from "./final-words.module.content.resolver.shared.app-init";

jest.mock(
  "../../components/component.content.resolver.shared.app-init",
  () => ({
    resolveComponentContentAppInit: jest.fn(),
  }),
);

const mockedComponentResolver = jest.mocked(resolveComponentContentAppInit);

type Input = Parameters<typeof resolveFinalWordsModuleContentAppInit>[0];
type Authored = Input["authored"];
type Component = Authored["components"][number];
type ResolvedComponent = ReturnType<typeof resolveComponentContentAppInit>;

describe("Final words module AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];

  const createComponent = (id: string): Component =>
    ({
      kind: "paragraph",
      id,
      content: [],
    }) as unknown as Component;

  const createAuthored = (
    components: readonly Component[] = [],
    overrides: Record<string, unknown> = {},
  ): Authored =>
    ({
      kind: "finalWords",
      components,
      ...overrides,
    }) as unknown as Authored;

  const resolve = (authored: Authored) =>
    resolveFinalWordsModuleContentAppInit({
      authored,
      svgAssets,
      socialProfiles,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedComponentResolver.mockImplementation(
      ({ authored }) => ({ ...authored }) as ResolvedComponent,
    );
  });

  it("returns an empty components array when none exist", () => {
    const result = resolve(createAuthored());

    expect(result.components).toEqual([]);
    expect(mockedComponentResolver).not.toHaveBeenCalled();
  });

  it("resolves a single component", () => {
    const component = createComponent("closing-paragraph");

    const result = resolve(createAuthored([component]));

    expect(mockedComponentResolver).toHaveBeenCalledWith({
      authored: component,
      svgAssets,
      socialProfiles,
    });

    expect(result.components).toHaveLength(1);
  });

  it("resolves multiple components in authored order", () => {
    const components = [
      createComponent("first"),
      createComponent("second"),
      createComponent("third"),
    ];

    resolve(createAuthored(components));

    expect(mockedComponentResolver).toHaveBeenCalledTimes(3);

    components.forEach((component, index) => {
      expect(mockedComponentResolver).toHaveBeenNthCalledWith(index + 1, {
        authored: component,
        svgAssets,
        socialProfiles,
      });
    });
  });

  it("preserves resolved component references", () => {
    const first = {
      kind: "paragraph",
      content: [],
    } as ResolvedComponent;

    const second = {
      kind: "paragraph",
      content: [],
    } as ResolvedComponent;

    mockedComponentResolver
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second);

    const result = resolve(
      createAuthored([createComponent("first"), createComponent("second")]),
    );

    expect(result.components[0]).toBe(first);
    expect(result.components[1]).toBe(second);
  });

  it("preserves unrelated authored properties", () => {
    const authored = {
      ...createAuthored(),
      identifier: "closing-thoughts",
    };

    const result = resolve(authored);

    expect((result as typeof result & { identifier: string }).identifier).toBe(
      "closing-thoughts",
    );
  });

  it("does not mutate authored components", () => {
    const component = createComponent("first");
    const authored = createAuthored([component]);

    const original = {
      ...authored,
      components: [...authored.components],
    };

    resolve(authored);

    expect(authored).toEqual(original);
    expect(authored.components[0]).toBe(component);
  });

  it("creates new module and components array", () => {
    const authored = createAuthored([createComponent("first")]);

    const result = resolve(authored);

    expect(result).not.toBe(authored);
    expect(result.components).not.toBe(authored.components);
    expect(result.components[0]).not.toBe(authored.components[0]);
  });

  it("propagates component resolution failures", () => {
    const error = new Error("Component resolution failed");

    mockedComponentResolver.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve(createAuthored([createComponent("first")]))).toThrow(
      error,
    );
  });

  it("stops processing after the first component failure", () => {
    mockedComponentResolver.mockImplementation(() => {
      throw new Error("Resolution stopped");
    });

    expect(() =>
      resolve(
        createAuthored([createComponent("first"), createComponent("second")]),
      ),
    ).toThrow("Resolution stopped");

    expect(mockedComponentResolver).toHaveBeenCalledTimes(1);
  });
});
