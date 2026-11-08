// src/app/life-cycle/app-render/document/page/body/modules/photo-sequence/photo-sequence.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { PhotoSequenceModule } from "./photo-sequence.module.body.page.document.app-render";
import { PhotoObject } from "../../components/photo-object/photo-object.component.body.page.document.app-render";

jest.mock(
  "../../components/photo-object/photo-object.component.body.page.document.app-render",
  () => ({
    PhotoObject: jest.fn(() => <div data-testid="sequence-photo" />),
  }),
);

const mockedPhoto = jest.mocked(PhotoObject);

type Module = Parameters<typeof PhotoSequenceModule>[0]["module"];
type Item = Module["photos"][number];
type Photo = Item["photo"];

describe("PhotoSequenceModule", () => {
  const createPhoto = (id: string): Photo =>
    ({
      id,
      alt: `Photograph ${id}`,
    }) as Photo;

  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      photos: [],
      caption: null,
      ...overrides,
    }) as Module;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a labelled photographic group", () => {
    const { container } = render(
      <PhotoSequenceModule module={createModule()} />,
    );

    expect(container.querySelector("figure")).toHaveClass("m-photo-sequence");

    expect(
      screen.getByRole("group", {
        name: "Photographic sequence",
      }),
    ).toHaveClass("m-photo-sequence__items");
  });

  it("renders every photograph in order", () => {
    const first = createPhoto("first");
    const second = createPhoto("second");

    const photos = [{ photo: first }, { photo: second }] as Item[];

    render(<PhotoSequenceModule module={createModule({ photos })} />);

    expect(screen.getAllByTestId("sequence-photo")).toHaveLength(2);
    expect(mockedPhoto).toHaveBeenCalledTimes(2);
    expect(mockedPhoto.mock.calls[0]?.[0].photo).toBe(first);
    expect(mockedPhoto.mock.calls[1]?.[0].photo).toBe(second);
  });

  it("forwards the sequence responsive sizes", () => {
    render(
      <PhotoSequenceModule
        module={createModule({
          photos: [{ photo: createPhoto("first") }] as Item[],
        })}
      />,
    );

    expect(mockedPhoto.mock.calls[0]?.[0]).toEqual({
      photo: expect.any(Object),
      sizes: "(min-width: 1024px) 55vw, 85vw",
    });
  });

  it("wraps each photograph in a sequence item", () => {
    const { container } = render(
      <PhotoSequenceModule
        module={createModule({
          photos: [
            { photo: createPhoto("first") },
            { photo: createPhoto("second") },
          ] as Item[],
        })}
      />,
    );

    expect(
      container.querySelectorAll(
        ".m-photo-sequence__item > [data-testid='sequence-photo']",
      ),
    ).toHaveLength(2);
  });

  it("renders a caption when supplied", () => {
    const { container } = render(
      <PhotoSequenceModule
        module={createModule({
          caption: "A sequence of bird behaviour.",
        })}
      />,
    );

    expect(container.querySelector("figcaption")).toHaveClass(
      "m-photo-sequence__caption",
    );

    expect(
      screen.getByText("A sequence of bird behaviour."),
    ).toBeInTheDocument();
  });

  it("omits the caption when null", () => {
    const { container } = render(
      <PhotoSequenceModule module={createModule()} />,
    );

    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("renders a caption element for an empty string", () => {
    const { container } = render(
      <PhotoSequenceModule module={createModule({ caption: "" })} />,
    );

    expect(container.querySelector("figcaption")).toBeEmptyDOMElement();
  });

  it("supports an empty sequence", () => {
    render(<PhotoSequenceModule module={createModule()} />);

    expect(screen.queryAllByTestId("sequence-photo")).toHaveLength(0);
    expect(mockedPhoto).not.toHaveBeenCalled();
  });
});
