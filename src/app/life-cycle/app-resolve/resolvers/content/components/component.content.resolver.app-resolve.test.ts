// src/app/life-cycle/app-resolve/resolvers/content/components/component.content.resolver.app-resolve.test.ts

import { resolveComponentContentAppResolve } from "./component.content.resolver.app-resolve";

import { resolveParagraphComponentContentAppResolve } from "./paragraph/paragraph.component.content.resolver.app-resolve";
import { resolveListComponentContentAppResolve } from "./list/list.component.content.resolver.app-resolve";
import { resolvePhotoComponentContentAppResolve } from "./photo/photo.component.content.resolver.app-resolve";
import { resolveEditorialPhotoComponentContentAppResolve } from "./editorial-photo/editorial-photo.component.content.resolver.app-resolve";
import { resolveRichListComponentContentAppResolve } from "./rich-list/rich-list.component.content.resolver.app-resolve";

jest.mock(
  "./paragraph/paragraph.component.content.resolver.app-resolve",
  () => ({
    resolveParagraphComponentContentAppResolve: jest.fn(),
  }),
);

jest.mock("./list/list.component.content.resolver.app-resolve", () => ({
  resolveListComponentContentAppResolve: jest.fn(),
}));

jest.mock("./photo/photo.component.content.resolver.app-resolve", () => ({
  resolvePhotoComponentContentAppResolve: jest.fn(),
}));

jest.mock(
  "./editorial-photo/editorial-photo.component.content.resolver.app-resolve",
  () => ({
    resolveEditorialPhotoComponentContentAppResolve: jest.fn(),
  }),
);

jest.mock(
  "./rich-list/rich-list.component.content.resolver.app-resolve",
  () => ({
    resolveRichListComponentContentAppResolve: jest.fn(),
  }),
);

const mockedParagraph = jest.mocked(resolveParagraphComponentContentAppResolve);
const mockedList = jest.mocked(resolveListComponentContentAppResolve);
const mockedPhoto = jest.mocked(resolvePhotoComponentContentAppResolve);
const mockedEditorialPhoto = jest.mocked(
  resolveEditorialPhotoComponentContentAppResolve,
);
const mockedRichList = jest.mocked(resolveRichListComponentContentAppResolve);

type Input = Parameters<typeof resolveComponentContentAppResolve>[0];
type Content = Input["content"];
type ResolvedContent = Awaited<
  ReturnType<typeof resolveComponentContentAppResolve>
>;

describe("Component content AppResolve resolver", () => {
  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["contentRegistry"];

  const getPhoto = jest.fn<
    ReturnType<Input["getPhoto"]>,
    Parameters<Input["getPhoto"]>
  >();

  const createContent = (kind: Content["kind"]): Content =>
    ({
      kind,
    }) as Content;

  const createResolved = (kind: Content["kind"]): ResolvedContent =>
    ({
      kind,
    }) as ResolvedContent;

  const resolve = (content: Content) =>
    resolveComponentContentAppResolve({
      content,
      contentRegistry,
      getPhoto,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedParagraph.mockReturnValue(
      createResolved("paragraph") as ReturnType<
        typeof resolveParagraphComponentContentAppResolve
      >,
    );

    mockedList.mockReturnValue(
      createResolved("list") as ReturnType<
        typeof resolveListComponentContentAppResolve
      >,
    );

    mockedPhoto.mockResolvedValue(
      createResolved("photo") as Awaited<
        ReturnType<typeof resolvePhotoComponentContentAppResolve>
      >,
    );

    mockedEditorialPhoto.mockReturnValue(
      createResolved("editorialPhoto") as ReturnType<
        typeof resolveEditorialPhotoComponentContentAppResolve
      >,
    );

    mockedRichList.mockReturnValue(
      createResolved("richList") as ReturnType<
        typeof resolveRichListComponentContentAppResolve
      >,
    );
  });

  it("dispatches paragraph components with the content registry", async () => {
    const content = createContent("paragraph");

    const result = await resolve(content);

    expect(mockedParagraph).toHaveBeenCalledTimes(1);
    expect(mockedParagraph).toHaveBeenCalledWith({
      content,
      contentRegistry,
    });

    expect(result.kind).toBe("paragraph");
  });

  it("dispatches list components with the content registry", async () => {
    const content = createContent("list");

    const result = await resolve(content);

    expect(mockedList).toHaveBeenCalledTimes(1);
    expect(mockedList).toHaveBeenCalledWith({
      content,
      contentRegistry,
    });

    expect(result.kind).toBe("list");
  });

  it("dispatches photo components with the photo getter", async () => {
    const content = createContent("photo");

    const result = await resolve(content);

    expect(mockedPhoto).toHaveBeenCalledTimes(1);
    expect(mockedPhoto).toHaveBeenCalledWith({
      content,
      getPhoto,
    });

    expect(result.kind).toBe("photo");
  });

  it("dispatches editorial-photo components", async () => {
    const content = createContent("editorialPhoto");

    const result = await resolve(content);

    expect(mockedEditorialPhoto).toHaveBeenCalledTimes(1);
    expect(mockedEditorialPhoto).toHaveBeenCalledWith({
      content,
      contentRegistry,
      getPhoto,
    });

    expect(result.kind).toBe("editorialPhoto");
  });

  it("dispatches rich-list components", async () => {
    const content = createContent("richList");

    const result = await resolve(content);

    expect(mockedRichList).toHaveBeenCalledTimes(1);
    expect(mockedRichList).toHaveBeenCalledWith({
      content,
      contentRegistry,
      getPhoto,
    });

    expect(result.kind).toBe("richList");
  });

  it("invokes only the selected resolver", async () => {
    await resolve(createContent("paragraph"));

    expect(mockedParagraph).toHaveBeenCalledTimes(1);
    expect(mockedList).not.toHaveBeenCalled();
    expect(mockedPhoto).not.toHaveBeenCalled();
    expect(mockedEditorialPhoto).not.toHaveBeenCalled();
    expect(mockedRichList).not.toHaveBeenCalled();
  });

  it("returns the exact object produced by a synchronous resolver", async () => {
    const expected = createResolved("paragraph");

    mockedParagraph.mockReturnValue(
      expected as ReturnType<typeof resolveParagraphComponentContentAppResolve>,
    );

    const result = await resolve(createContent("paragraph"));

    expect(result).toBe(expected);
  });

  it("awaits asynchronous photo resolution", async () => {
    const expected = createResolved("photo");

    mockedPhoto.mockResolvedValue(
      expected as Awaited<
        ReturnType<typeof resolvePhotoComponentContentAppResolve>
      >,
    );

    const result = await resolve(createContent("photo"));

    expect(result).toBe(expected);
  });

  it("returns a Promise for synchronous components", () => {
    const result = resolve(createContent("paragraph"));

    expect(result).toBeInstanceOf(Promise);

    return expect(result).resolves.toMatchObject({
      kind: "paragraph",
    });
  });

  it("propagates synchronous resolver failures as rejections", async () => {
    const error = new Error("Paragraph resolution failed");

    mockedParagraph.mockImplementation(() => {
      throw error;
    });

    await expect(resolve(createContent("paragraph"))).rejects.toThrow(error);
  });

  it("propagates asynchronous photo resolution failures", async () => {
    const error = new Error("Photo metadata unavailable");

    mockedPhoto.mockRejectedValue(error);

    await expect(resolve(createContent("photo"))).rejects.toThrow(error);
  });

  it("does not mutate the original component", async () => {
    const content = Object.freeze(createContent("richList"));

    await resolve(content);

    expect(content.kind).toBe("richList");
  });
});
