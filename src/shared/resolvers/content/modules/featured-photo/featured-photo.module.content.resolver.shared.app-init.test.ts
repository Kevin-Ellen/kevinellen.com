// src/shared/resolvers/content/modules/featured-photo/featured-photo.module.content.resolver.shared.app-init.test.ts

import { resolvePhotoComponentContentAppInit } from "../../components/photo/photo.component.content.resolver.shared.app-init";

import { resolveFeaturedPhotoModuleContentAppInit } from "./featured-photo.module.content.resolver.shared.app-init";

jest.mock(
  "../../components/photo/photo.component.content.resolver.shared.app-init",
  () => ({
    resolvePhotoComponentContentAppInit: jest.fn(),
  }),
);

const mockedPhotoResolver = jest.mocked(resolvePhotoComponentContentAppInit);

type Input = Parameters<typeof resolveFeaturedPhotoModuleContentAppInit>[0];
type Authored = Input["authored"];
type ResolvedPhoto = ReturnType<typeof resolvePhotoComponentContentAppInit>;

describe("Featured photo module AppInit resolver", () => {
  const createAuthored = (overrides: Record<string, unknown> = {}): Authored =>
    ({
      kind: "featuredPhoto",
      photoId: "forest-fox",
      ...overrides,
    }) as unknown as Authored;

  const resolve = (authored: Authored) =>
    resolveFeaturedPhotoModuleContentAppInit({ authored });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedPhotoResolver.mockImplementation(({ authored }) => ({ ...authored }));
  });

  it("converts the authored module into a photo component", () => {
    const authored = createAuthored();

    resolve(authored);

    expect(mockedPhotoResolver).toHaveBeenCalledWith({
      authored: {
        ...authored,
        kind: "photo",
      },
    });

    expect(mockedPhotoResolver).toHaveBeenCalledTimes(1);
  });

  it("returns a featured photo module", () => {
    const result = resolve(createAuthored());

    expect(result.kind).toBe("featuredPhoto");
  });

  it("forces wide to true", () => {
    const result = resolve(
      createAuthored({
        wide: false,
      }),
    );

    expect(result.wide).toBe(true);
  });

  it("preserves properties returned by the photo resolver", () => {
    const photo = {
      kind: "photo",
      photoId: "resolved-photo",
      caption: "Red fox in woodland",
    } as unknown as ResolvedPhoto;

    mockedPhotoResolver.mockReturnValue(photo);

    const result = resolve(createAuthored());

    expect(result).toMatchObject({
      kind: "featuredPhoto",
      photoId: "resolved-photo",
      caption: "Red fox in woodland",
      wide: true,
    });
  });

  it("overrides the photo resolver's kind and wide values", () => {
    const photo = {
      kind: "photo",
      photoId: "forest-fox",
      wide: false,
    } as unknown as ResolvedPhoto;

    mockedPhotoResolver.mockReturnValue(photo);

    const result = resolve(createAuthored());

    expect(result.kind).toBe("featuredPhoto");
    expect(result.wide).toBe(true);
  });

  it("does not mutate the authored featured photo", () => {
    const authored = createAuthored();
    const original = { ...authored };

    resolve(authored);

    expect(authored).toEqual(original);
  });

  it("does not mutate the resolved photo object", () => {
    const photo = {
      kind: "photo",
      photoId: "forest-fox",
      wide: false,
    } as unknown as ResolvedPhoto;

    mockedPhotoResolver.mockReturnValue(photo);

    resolve(createAuthored());

    expect(photo.kind).toBe("photo");
    expect((photo as ResolvedPhoto & { wide: boolean }).wide).toBe(false);
  });

  it("returns a new object rather than the resolver result", () => {
    const photo = {
      kind: "photo",
      photoId: "forest-fox",
    } as unknown as ResolvedPhoto;

    mockedPhotoResolver.mockReturnValue(photo);

    const result = resolve(createAuthored());

    expect(result).not.toBe(photo);
  });

  it("propagates photo resolution failures", () => {
    const error = new Error("Photo resolution failed");

    mockedPhotoResolver.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve(createAuthored())).toThrow(error);
  });

  it("returns a fresh object on repeated resolution", () => {
    const authored = createAuthored();

    const first = resolve(authored);
    const second = resolve(authored);

    expect(first).not.toBe(second);
    expect(first).toEqual(second);
  });
});
