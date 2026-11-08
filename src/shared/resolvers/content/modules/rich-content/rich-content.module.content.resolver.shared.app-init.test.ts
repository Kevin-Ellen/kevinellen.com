// src/shared/resolvers/content/modules/rich-content/rich-content.module.content.resolver.shared.app-init.test.ts

import { resolveComponentContentAppInit } from "../../components/component.content.resolver.shared.app-init";
import { resolveRichContentModuleContentAppInit } from "./rich-content.module.content.resolver.shared.app-init";

jest.mock(
  "../../components/component.content.resolver.shared.app-init",
  () => ({
    resolveComponentContentAppInit: jest.fn(),
  }),
);

const mockedComponentResolver = jest.mocked(resolveComponentContentAppInit);

type Input = Parameters<typeof resolveRichContentModuleContentAppInit>[0];
type Authored = Input["authored"];
type Component = Authored["components"][number];
type Resolved = ReturnType<typeof resolveComponentContentAppInit>;

describe("Rich content module AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];

  const createComponent = (id: string): Component =>
    ({
      kind: "paragraph",
      id,
      content: [],
    }) as unknown as Component;

  const createAuthored = (components: readonly Component[] = []): Authored =>
    ({
      kind: "richContent",
      components,
    }) as unknown as Authored;

  const resolve = (authored: Authored) =>
    resolveRichContentModuleContentAppInit({
      authored,
      svgAssets,
      socialProfiles,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedComponentResolver.mockImplementation(
      ({ authored }) => ({ ...authored }) as Resolved,
    );
  });

  it("returns an empty collection when no components exist", () => {
    const result = resolve(createAuthored());

    expect(result.components).toEqual([]);
    expect(mockedComponentResolver).not.toHaveBeenCalled();
  });

  it("resolves a single component with shared dependencies", () => {
    const component = createComponent("intro");

    const result = resolve(createAuthored([component]));

    expect(mockedComponentResolver).toHaveBeenCalledWith({
      authored: component,
      svgAssets,
      socialProfiles,
    });
    expect(result.components).toHaveLength(1);
  });

  it("resolves every component in authored order", () => {
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
    } as Resolved;

    const second = {
      kind: "paragraph",
      content: [],
    } as Resolved;

    mockedComponentResolver
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second);

    const result = resolve(
      createAuthored([createComponent("first"), createComponent("second")]),
    );

    expect(result.components[0]).toBe(first);
    expect(result.components[1]).toBe(second);
  });

  it("does not mutate the authored collection", () => {
    const component = createComponent("intro");
    const authored = createAuthored([component]);

    const original = [...authored.components];
    const result = resolve(authored);

    expect(authored.components).toEqual(original);
    expect(authored.components[0]).toBe(component);

    expect(result).not.toBe(authored);
    expect(result.components).not.toBe(authored.components);
    expect(result.components[0]).not.toBe(component);
  });

  it("preserves unrelated authored properties", () => {
    const authored = {
      ...createAuthored(),
      identifier: "journal-content",
    };

    expect(resolve(authored)).toMatchObject({
      identifier: "journal-content",
    });
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

  it("stops resolving after the first failure", () => {
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
