// src/app/life-cycle/app-resolve/resolvers/content/components/editorial-photo/editorial-photo.component.content.resolver.app-resolve.test.ts

import { resolveEditorialPhotoComponentContentAppResolve } from "./editorial-photo.component.content.resolver.app-resolve";

type Content = Parameters<
  typeof resolveEditorialPhotoComponentContentAppResolve
>[0]["content"];

describe("Editorial-photo component AppResolve resolver", () => {
  const createContent = (): Content =>
    ({
      kind: "editorialPhoto",
      photoId: "forest-001",
    }) as unknown as Content;

  it("preserves the original component properties", () => {
    const content = createContent();

    expect(
      resolveEditorialPhotoComponentContentAppResolve({ content }),
    ).toEqual(content);
  });

  it("returns a different object reference", () => {
    const content = createContent();

    const result = resolveEditorialPhotoComponentContentAppResolve({
      content,
    });

    expect(result).not.toBe(content);
  });

  it("does not modify the source component", () => {
    const content = Object.freeze(createContent());

    const result = resolveEditorialPhotoComponentContentAppResolve({
      content,
    });

    expect(result).toEqual(content);
    expect(result).not.toBe(content);
  });
});
