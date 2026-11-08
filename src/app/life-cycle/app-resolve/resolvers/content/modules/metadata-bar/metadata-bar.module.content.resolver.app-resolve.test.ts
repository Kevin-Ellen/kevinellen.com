// src/app/life-cycle/app-resolve/resolvers/content/modules/metadata-bar/metadata-bar.module.content.resolver.app-resolve.test.ts

import { resolveMetadataBarModuleContentAppResolve } from "./metadata-bar.module.content.resolver.app-resolve";
import { resolveSvgReferenceAppResolve } from "../../../primitives/svg/svg.primitive.resolver.app-resolve";

jest.mock("../../../primitives/svg/svg.primitive.resolver.app-resolve", () => ({
  resolveSvgReferenceAppResolve: jest.fn(),
}));

const mockedSvg = jest.mocked(resolveSvgReferenceAppResolve);

type Input = Parameters<typeof resolveMetadataBarModuleContentAppResolve>[0];
type Content = Input["content"];
type Reference = Parameters<
  typeof resolveSvgReferenceAppResolve
>[0]["reference"];
type ResolvedReference = ReturnType<typeof resolveSvgReferenceAppResolve>;

describe("Metadata-bar module AppResolve resolver", () => {
  const createReference = (id: string): Reference => ({ id }) as Reference;

  const createContent = (): Content =>
    ({
      kind: "metadataBar",
      cameras: {
        label: "Cameras",
        icon: createReference("camera"),
      },
      lenses: {
        label: "Lenses",
        icon: createReference("lens"),
      },
      location: {
        label: "Location",
        icon: createReference("map-pin"),
      },
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedSvg.mockImplementation(({ reference }) => ({ ...reference }));
  });

  it("resolves all three icons", () => {
    const content = createContent();

    resolveMetadataBarModuleContentAppResolve({ content });

    expect(mockedSvg).toHaveBeenCalledTimes(3);

    expect(mockedSvg).toHaveBeenNthCalledWith(1, {
      reference: content.cameras.icon,
    });
    expect(mockedSvg).toHaveBeenNthCalledWith(2, {
      reference: content.lenses.icon,
    });
    expect(mockedSvg).toHaveBeenNthCalledWith(3, {
      reference: content.location.icon,
    });
  });

  it("uses the exact objects returned by the SVG resolver", () => {
    const camera = { id: "icon-camera" } as ResolvedReference;
    const lens = { id: "icon-aperture" } as ResolvedReference;
    const location = { id: "icon-location-dot" } as ResolvedReference;

    mockedSvg
      .mockReturnValueOnce(camera)
      .mockReturnValueOnce(lens)
      .mockReturnValueOnce(location);

    const result = resolveMetadataBarModuleContentAppResolve({
      content: createContent(),
    });

    expect(result.cameras.icon).toBe(camera);
    expect(result.lenses.icon).toBe(lens);
    expect(result.location.icon).toBe(location);
  });

  it("preserves metadata around the icons", () => {
    const result = resolveMetadataBarModuleContentAppResolve({
      content: createContent(),
    });

    expect(result.cameras).toMatchObject({ label: "Cameras" });
    expect(result.lenses).toMatchObject({ label: "Lenses" });
    expect(result.location).toMatchObject({ label: "Location" });
  });

  it("creates a new module and new metadata groups", () => {
    const content = createContent();
    const result = resolveMetadataBarModuleContentAppResolve({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.cameras).not.toBe(content.cameras);
    expect(result.lenses).not.toBe(content.lenses);
    expect(result.location).not.toBe(content.location);
  });

  it("does not mutate the source icons", () => {
    const content = createContent();

    const originalCameraIcon = content.cameras.icon;
    const originalLensIcon = content.lenses.icon;
    const originalLocationIcon = content.location.icon;

    resolveMetadataBarModuleContentAppResolve({ content });

    expect(content.cameras.icon).toBe(originalCameraIcon);
    expect(content.lenses.icon).toBe(originalLensIcon);
    expect(content.location.icon).toBe(originalLocationIcon);
  });

  it("propagates SVG resolution failures", () => {
    const error = new Error("Invalid SVG reference");

    mockedSvg.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveMetadataBarModuleContentAppResolve({
        content: createContent(),
      }),
    ).toThrow(error);
  });
});
