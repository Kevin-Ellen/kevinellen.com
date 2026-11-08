// src/app/life-cycle/app-resolve/resolvers/content/modules/rich-content/rich-content.module.content.resolver.app-resolve.test.ts

import { resolveRichContentModuleContentAppResolve } from "./rich-content.module.content.resolver.app-resolve";
import { resolveComponentContentAppResolve } from "../../components/component.content.resolver.app-resolve";

jest.mock("../../components/component.content.resolver.app-resolve", () => ({
  resolveComponentContentAppResolve: jest.fn(),
}));

const mockedComponent = jest.mocked(resolveComponentContentAppResolve);

type Input = Parameters<typeof resolveRichContentModuleContentAppResolve>[0];
type Content = Input["content"];
type Component = Content["components"][number];
type ResolvedComponent = Awaited<
  ReturnType<typeof resolveComponentContentAppResolve>
>;

describe("Rich-content module AppResolve resolver", () => {
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
      createComponent("list"),
      createComponent("photo"),
    ],
  ): Content =>
    ({
      kind: "richContent",
      components,
    }) as unknown as Content;

  const resolve = (content: Content = createContent()) =>
    resolveRichContentModuleContentAppResolve({
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

  it("resolves each component with the correct dependencies", async () => {
    const content = createContent();
    const result = await resolve(content);

    expect(mockedComponent).toHaveBeenCalledTimes(3);

    content.components.forEach((component, index) => {
      expect(mockedComponent).toHaveBeenNthCalledWith(index + 1, {
        content: component,
        contentRegistry,
        getPhoto,
      });
    });

    expect(result.components.map((component) => component.kind)).toEqual([
      "paragraph",
      "list",
      "photo",
    ]);
  });

  it("preserves the returned component references and order", async () => {
    const first = { kind: "paragraph" } as ResolvedComponent;
    const second = { kind: "photo" } as ResolvedComponent;

    mockedComponent.mockResolvedValueOnce(first).mockResolvedValueOnce(second);

    const result = await resolve(
      createContent([createComponent("paragraph"), createComponent("photo")]),
    );

    expect(result.components[0]).toBe(first);
    expect(result.components[1]).toBe(second);
  });

  it("supports empty component collections", async () => {
    const result = await resolve(createContent([]));

    expect(result.components).toEqual([]);
    expect(mockedComponent).not.toHaveBeenCalled();
  });

  it("creates a new module and component array", async () => {
    const content = createContent();
    const result = await resolve(content);

    expect(result).not.toBe(content);
    expect(result.components).not.toBe(content.components);
    expect(result.kind).toBe(content.kind);
  });

  it("does not mutate the original content", async () => {
    const content = Object.freeze(createContent());
    const originalComponents = content.components;

    await resolve(content);

    expect(content.components).toBe(originalComponents);
  });

  it("propagates component resolution errors", async () => {
    const error = new Error("Component resolution failed");

    mockedComponent.mockRejectedValue(error);

    await expect(resolve()).rejects.toThrow(error);
  });
});
