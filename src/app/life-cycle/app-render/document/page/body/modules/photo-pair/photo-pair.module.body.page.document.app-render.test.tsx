// src/app/life-cycle/app-render/document/page/body/modules/photo-pair/photo-pair.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { PhotoPairModule } from "./photo-pair.module.body.page.document.app-render";
import { PhotoObject } from "../../components/photo-object/photo-object.component.body.page.document.app-render";

jest.mock(
  "../../components/photo-object/photo-object.component.body.page.document.app-render",
  () => ({
    PhotoObject: jest.fn(() => <div data-testid="pair-photo" />),
  }),
);

const mockedPhoto = jest.mocked(PhotoObject);

type Module = Parameters<typeof PhotoPairModule>[0]["module"];
type Item = Module["photos"][number];
type Photo = Item["photo"];

describe("PhotoPairModule", () => {
  const createPhoto = (id: string): Photo => ({
    id,
    title: `Photograph ${id}`,
    alt: `Photograph ${id}`,
    commentary: null,
    location: null,
    width: 1200,
    height: 800,
    image: {
      id: `image-${id}`,
      src: `/images/${id}.webp`,
      srcSet: `/images/${id}-400.webp 400w`,
    },
    metadata: {
      shutter: "1/1000s",
      aperture: "f/7.1",
      focalLength: "500mm",
      iso: "1600",
    },
  });

  const createItem = (id: string): Item => ({
    kind: "photo",
    photo: createPhoto(id),
  });

  const createModule = (
    photos: Module["photos"] = [createItem("first"), createItem("second")],
  ): Module => ({
    kind: "photoPair",
    photos,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the pair container and items", () => {
    const { container } = render(
      <PhotoPairModule
        module={createModule([createItem("first"), createItem("second")])}
      />,
    );

    expect(
      container.querySelector(".m-photo-pair > .m-photo-pair__items"),
    ).toBeInTheDocument();

    expect(screen.getAllByTestId("pair-photo")).toHaveLength(2);
  });

  it("forwards the original photographs in order", () => {
    const first = createItem("first");
    const second = createItem("second");

    render(<PhotoPairModule module={createModule([first, second])} />);

    expect(mockedPhoto).toHaveBeenCalledTimes(2);

    expect(mockedPhoto.mock.calls[0]?.[0].photo).toBe(first.photo);
    expect(mockedPhoto.mock.calls[1]?.[0].photo).toBe(second.photo);
  });

  it("sets the layout class and responsive sizes", () => {
    const first = createItem("first");
    const second = createItem("second");

    render(<PhotoPairModule module={createModule([first, second])} />);

    expect(mockedPhoto).toHaveBeenCalledTimes(2);

    expect(mockedPhoto.mock.calls[0]?.[0]).toEqual({
      photo: first.photo,
      className: "m-photo-pair__item",
      sizes: "(min-width: 60rem) 50vw, 100vw",
    });

    expect(mockedPhoto.mock.calls[1]?.[0]).toEqual({
      photo: second.photo,
      className: "m-photo-pair__item",
      sizes: "(min-width: 60rem) 50vw, 100vw",
    });
  });
});
