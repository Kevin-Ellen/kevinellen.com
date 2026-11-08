// src/app/life-cycle/app-resolve/resolvers/content/modules/final-words/final-words.module.content.resolver.app-resolve.test.ts

import { resolveFinalWordsModuleContentAppResolve } from "./final-words.module.content.resolver.app-resolve";
import { resolveComponentContentAppResolve } from "../../components/component.content.resolver.app-resolve";

jest.mock("../../components/component.content.resolver.app-resolve", () => ({
  resolveComponentContentAppResolve: jest.fn(),
}));

const mockedComponent = jest.mocked(resolveComponentContentAppResolve);

type Input = Parameters<typeof resolveFinalWordsModuleContentAppResolve>[0];
type Content = Input["content"];
type Component = Content["components"][number];
type ResolvedComponent = Awaited<
  ReturnType<typeof resolveComponentContentAppResolve>
>;

describe("Final-words module AppResolve resolver", () => {
  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["contentRegistry"];

  const getPhoto = jest.fn<
    ReturnType<Input["getPhoto"]>,
    Parameters<Input["getPhoto"]>
  >();

  const createComponent = (kind: Component["kind"]): Component =>
    ({ kind }) as unknown as Component;

  const createContent = (
    components: readonly Component[] = [
      createComponent("paragraph"),
      createComponent("richList"),
    ],
  ): Content =>
    ({
      kind: "finalWords",
      components,
    }) as unknown as Content;

  const resolve = (content = createContent()) =>
    resolveFinalWordsModuleContentAppResolve({
      content,
      contentRegistry,
      getPhoto,
    });

  beforeEach(() => {
    jest.resetAllMocks();
    mockedComponent.mockImplementation(
      async ({ content }) => ({ kind: content.kind }) as ResolvedComponent,
    );
  });

  it("resolves every component with the correct dependencies", async () => {
    const content = createContent();
    const result = await resolve(content);

    expect(mockedComponent).toHaveBeenCalledTimes(2);

    content.components.forEach((component, index) => {
      expect(mockedComponent).toHaveBeenNthCalledWith(index + 1, {
        content: component,
        contentRegistry,
        getPhoto,
      });
    });

    expect(result.components.map((item) => item.kind)).toEqual([
      "paragraph",
      "richList",
    ]);
  });

  it("retains resolved component references", async () => {
    const resolved = {
      kind: "paragraph",
    } as ResolvedComponent;

    mockedComponent.mockResolvedValue(resolved);

    const result = await resolve(createContent([createComponent("paragraph")]));

    expect(result.components[0]).toBe(resolved);
  });

  it("supports no components", async () => {
    const result = await resolve(createContent([]));

    expect(result.components).toEqual([]);
    expect(mockedComponent).not.toHaveBeenCalled();
  });

  it("creates a new module and component array", async () => {
    const content = Object.freeze(createContent());
    const result = await resolve(content);

    expect(result).not.toBe(content);
    expect(result.components).not.toBe(content.components);
    expect(content.components).toHaveLength(2);
  });

  it("propagates component resolution failures", async () => {
    const error = new Error("Component failed");
    mockedComponent.mockRejectedValue(error);

    await expect(resolve()).rejects.toThrow(error);
  });
});
