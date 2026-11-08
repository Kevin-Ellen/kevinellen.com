// src/app/life-cycle/app-render/document/page/body/modules/featured-photo/featured-photo.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { FeaturedPhotoModule } from "./featured-photo.module.body.page.document.app-render";
import { PhotoObject } from "../../components/photo-object/photo-object.component.body.page.document.app-render";

jest.mock(
  "../../components/photo-object/photo-object.component.body.page.document.app-render",
  () => ({
    PhotoObject: jest.fn(() => <div data-testid="featured-photo" />),
  }),
);

const mockedPhoto = jest.mocked(PhotoObject);

type Module = Parameters<typeof FeaturedPhotoModule>[0]["module"];

describe("FeaturedPhotoModule", () => {
  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      wide: false,
      photo: {
        id: "woodpecker",
        alt: "Woodpecker in Epping Forest",
      },
      ...overrides,
    }) as unknown as Module;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the featured photo container and frame", () => {
    const { container } = render(
      <FeaturedPhotoModule module={createModule()} />,
    );

    expect(
      container.querySelector(
        ".m-featured-photo > .l-frame > [data-testid='featured-photo']",
      ),
    ).toBeInTheDocument();
  });

  it("forwards the original photo reference", () => {
    const module = createModule();

    render(<FeaturedPhotoModule module={module} />);

    expect(mockedPhoto).toHaveBeenCalledTimes(1);

    expect(mockedPhoto.mock.calls[0]?.[0].photo).toBe(module.photo);
  });

  it("always enables priority image loading", () => {
    render(<FeaturedPhotoModule module={createModule()} />);

    expect(mockedPhoto.mock.calls[0]?.[0].priority).toBe(true);
  });

  it("forwards wide=true", () => {
    const module = createModule({ wide: true });

    render(<FeaturedPhotoModule module={module} />);

    expect(mockedPhoto.mock.calls[0]?.[0]).toEqual({
      photo: module.photo,
      wide: true,
      priority: true,
    });
  });

  it("renders exactly one photo component", () => {
    render(<FeaturedPhotoModule module={createModule()} />);

    expect(screen.getAllByTestId("featured-photo")).toHaveLength(1);
    expect(mockedPhoto).toHaveBeenCalledTimes(1);
  });
});
