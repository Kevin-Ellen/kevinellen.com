// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/metadata-bar/metadata-bar.module.content.resolver.app-render-context.test.ts

import { resolveMetadataBarModuleContentAppRenderContext } from "./metadata-bar.module.content.resolver.app-render-context";

import { resolveSvgReferenceAppRenderContext } from "../../../../../primitives/svg/svg.primitive.resolver.app-render-context";

jest.mock(
  "../../../../../primitives/svg/svg.primitive.resolver.app-render-context",
  () => ({
    resolveSvgReferenceAppRenderContext: jest.fn(),
  }),
);

const mockedSvg = jest.mocked(resolveSvgReferenceAppRenderContext);

type Content = Parameters<
  typeof resolveMetadataBarModuleContentAppRenderContext
>[0]["content"];

type SvgReference = Parameters<
  typeof resolveSvgReferenceAppRenderContext
>[0]["reference"];

describe("Metadata bar module AppRenderContext resolver", () => {
  const createSvg = (id: string): SvgReference =>
    ({ id }) as unknown as SvgReference;

  const cameraIcon = createSvg("camera");
  const lensIcon = createSvg("lens");
  const locationIcon = createSvg("location");

  const createContent = (): Content =>
    ({
      kind: "metadataBar",
      cameras: {
        label: "Canon EOS R7",
        icon: cameraIcon,
      },
      lenses: {
        label: "RF 100-500mm",
        icon: lensIcon,
      },
      location: {
        label: "Epping Forest",
        icon: locationIcon,
      },
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedSvg.mockImplementation(({ reference }) => ({ ...reference }));
  });

  it("resolves all three SVG references in order", () => {
    resolveMetadataBarModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(mockedSvg).toHaveBeenCalledTimes(3);

    expect(mockedSvg).toHaveBeenNthCalledWith(1, {
      reference: cameraIcon,
    });

    expect(mockedSvg).toHaveBeenNthCalledWith(2, {
      reference: lensIcon,
    });

    expect(mockedSvg).toHaveBeenNthCalledWith(3, {
      reference: locationIcon,
    });
  });

  it("preserves exact resolved SVG references", () => {
    const resolvedCamera = createSvg("resolved-camera");
    const resolvedLens = createSvg("resolved-lens");
    const resolvedLocation = createSvg("resolved-location");

    mockedSvg
      .mockReturnValueOnce(resolvedCamera)
      .mockReturnValueOnce(resolvedLens)
      .mockReturnValueOnce(resolvedLocation);

    const result = resolveMetadataBarModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result.cameras.icon).toBe(resolvedCamera);
    expect(result.lenses.icon).toBe(resolvedLens);
    expect(result.location.icon).toBe(resolvedLocation);
  });

  it("preserves camera, lens and location metadata", () => {
    const content = createContent();

    const result = resolveMetadataBarModuleContentAppRenderContext({
      content,
    });

    expect(result.cameras).toEqual({
      ...content.cameras,
      icon: result.cameras.icon,
    });

    expect(result.lenses).toEqual({
      ...content.lenses,
      icon: result.lenses.icon,
    });

    expect(result.location).toEqual({
      ...content.location,
      icon: result.location.icon,
    });
  });

  it("creates new module and metadata group objects", () => {
    const content = createContent();

    const result = resolveMetadataBarModuleContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.cameras).not.toBe(content.cameras);
    expect(result.lenses).not.toBe(content.lenses);
    expect(result.location).not.toBe(content.location);
  });

  it("propagates SVG resolver failures", () => {
    const error = new Error("Unknown SVG reference");

    mockedSvg.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveMetadataBarModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedSvg).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the original metadata", () => {
    const content = createContent();
    const originalCameras = content.cameras;
    const originalLenses = content.lenses;
    const originalLocation = content.location;

    resolveMetadataBarModuleContentAppRenderContext({ content });

    expect(content.cameras).toBe(originalCameras);
    expect(content.lenses).toBe(originalLenses);
    expect(content.location).toBe(originalLocation);
  });
});
