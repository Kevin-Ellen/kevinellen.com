// src/app/life-cycle/app-render/document/page/body/components/editorial-photo/editorial-photo.component.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { EditorialPhotoComponent } from "./editorial-photo.component.body.page.document.app-render";

type Props = Parameters<typeof EditorialPhotoComponent>[0];
type Photo = Props["photo"];

describe("EditorialPhotoComponent", () => {
  const createPhoto = (overrides: Partial<Photo> = {}): Photo =>
    ({
      kind: "editorialPhoto",
      src: "/media/forest.webp",
      alt: "Woodland in morning light",
      width: 1200,
      height: 800,
      priority: false,
      ...overrides,
    }) as Photo;

  it("renders the image with its metadata", () => {
    render(<EditorialPhotoComponent photo={createPhoto()} />);

    const image = screen.getByRole("img", {
      name: "Woodland in morning light",
    });

    expect(image).toHaveAttribute("src", "/media/forest.webp");
    expect(image).toHaveAttribute("width", "1200");
    expect(image).toHaveAttribute("height", "800");
    expect(image).toHaveAttribute("decoding", "async");
    expect(image).toHaveClass("c-photo__image");
  });

  it("defaults to lazy loading", () => {
    render(<EditorialPhotoComponent photo={createPhoto()} />);

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).not.toHaveAttribute("fetchpriority");
  });

  it("prioritises important images", () => {
    render(<EditorialPhotoComponent photo={createPhoto({ priority: true })} />);

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("fetchpriority", "high");
  });

  it("renders a standard figure without a frame", () => {
    const { container } = render(
      <EditorialPhotoComponent photo={createPhoto()} />,
    );

    expect(container.querySelector("figure")).toHaveClass("c-photo");
    expect(container.querySelector(".l-frame")).toBeNull();
    expect(container.querySelector(".c-photo--wide")).toBeNull();
  });

  it("wraps the image in a frame when wide", () => {
    const { container } = render(
      <EditorialPhotoComponent photo={createPhoto()} wide />,
    );

    expect(container.querySelector("figure")).toHaveClass(
      "c-photo",
      "c-photo--wide",
    );

    expect(container.querySelector(".l-frame > img")).toBe(
      screen.getByRole("img"),
    );
  });

  it("combines wide and custom figure classes", () => {
    const { container } = render(
      <EditorialPhotoComponent
        photo={createPhoto()}
        wide
        className="m-hero__photo"
      />,
    );

    expect(container.querySelector("figure")).toHaveClass(
      "c-photo",
      "c-photo--wide",
      "m-hero__photo",
    );
  });

  it("renders a description as a figcaption", () => {
    const { container } = render(
      <EditorialPhotoComponent
        photo={createPhoto({
          description: "An early morning in Epping Forest.",
        })}
      />,
    );

    expect(container.querySelector("figcaption")).toHaveClass(
      "c-photo__caption",
    );

    expect(screen.getByText("An early morning in Epping Forest.")).toHaveClass(
      "c-photo__description",
    );
  });

  it("adds the reading width to wide captions", () => {
    const { container } = render(
      <EditorialPhotoComponent
        photo={createPhoto({ description: "Forest" })}
        wide
      />,
    );

    expect(container.querySelector("figcaption")).toHaveClass(
      "c-photo__caption",
      "l-reading",
    );
  });

  it("omits the caption when no description exists", () => {
    const { container } = render(
      <EditorialPhotoComponent photo={createPhoto()} />,
    );

    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("omits an empty description", () => {
    const { container } = render(
      <EditorialPhotoComponent photo={createPhoto({ description: "" })} />,
    );

    expect(container.querySelector("figcaption")).toBeNull();
  });
});
