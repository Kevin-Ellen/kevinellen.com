// src/app/life-cycle/app-render/document/page/body/components/photo-object/photo-object.component.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { PhotoObject } from "./photo-object.component.body.page.document.app-render";

type Props = Parameters<typeof PhotoObject>[0];
type Photo = Props["photo"];

describe("PhotoObject", () => {
  const createPhoto = (overrides: Partial<Photo> = {}): Photo =>
    ({
      id: "woodpecker",
      image: {
        id: "cf-woodpecker",
        src: "/media/photo/1200/800/woodpecker",
        srcSet: "/media/photo/400/267/woodpecker 400w",
      },
      width: 1200,
      height: 800,
      alt: "Woodpecker perched on a tree",
      commentary: "An unexpected encounter in the forest.",
      location: "Epping Forest, Essex",
      metadata: {
        shutter: "1/1000s",
        aperture: "f/7.1",
        focalLength: "500mm",
        iso: "1600",
      },
      ...overrides,
    }) as unknown as Photo;

  it("renders the responsive image", () => {
    render(<PhotoObject photo={createPhoto()} />);

    const image = screen.getByRole("img", {
      name: "Woodpecker perched on a tree",
    });

    expect(image).toHaveAttribute("src", "/media/photo/1200/800/woodpecker");
    expect(image).toHaveAttribute(
      "srcset",
      "/media/photo/400/267/woodpecker 400w",
    );
    expect(image).toHaveAttribute("width", "1200");
    expect(image).toHaveAttribute("height", "800");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("defaults to lazy loading", () => {
    render(<PhotoObject photo={createPhoto()} />);

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).not.toHaveAttribute("fetchpriority");
  });

  it("supports priority image loading", () => {
    render(<PhotoObject photo={createPhoto()} priority />);

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("fetchpriority", "high");
  });

  it("forwards the sizes attribute", () => {
    render(
      <PhotoObject
        photo={createPhoto()}
        sizes="(max-width: 48rem) 100vw, 50vw"
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "sizes",
      "(max-width: 48rem) 100vw, 50vw",
    );
  });

  it("combines wide and custom figure classes", () => {
    const { container } = render(
      <PhotoObject photo={createPhoto()} wide className="m-gallery__photo" />,
    );

    expect(container.querySelector("figure")).toHaveClass(
      "c-photo",
      "c-photo--wide",
      "m-gallery__photo",
    );

    expect(container.querySelector("figcaption")).toHaveClass(
      "c-photo__caption",
      "l-reading",
    );
  });

  it("omits wide classes by default", () => {
    const { container } = render(<PhotoObject photo={createPhoto()} />);

    expect(container.querySelector(".c-photo--wide")).toBeNull();
    expect(container.querySelector(".l-reading")).toBeNull();
  });

  it("renders the photograph commentary", () => {
    render(<PhotoObject photo={createPhoto()} />);

    expect(
      screen.getByText("An unexpected encounter in the forest."),
    ).toHaveClass("c-photo__description");
  });

  it("omits commentary when absent", () => {
    const { container } = render(
      <PhotoObject
        photo={createPhoto({
          commentary: "",
        })}
      />,
    );

    expect(container.querySelector(".c-photo__description")).toBeNull();
  });

  it("renders the photograph location and icon", () => {
    const { container } = render(<PhotoObject photo={createPhoto()} />);

    expect(screen.getByText("Epping Forest, Essex")).toBeInTheDocument();

    const icon = container.querySelector(".c-photo__location-icon use");

    expect(icon).toHaveAttribute("href", "#icon-location-dot");
  });

  it("renders all four photographic settings", () => {
    const { container } = render(<PhotoObject photo={createPhoto()} />);

    const terms = Array.from(
      container.querySelectorAll(".c-photo__metadata-term"),
    );

    const values = Array.from(
      container.querySelectorAll(".c-photo__metadata-value"),
    );

    expect(terms.map((term) => term.textContent)).toEqual([
      "Shutter speed",
      "Aperture",
      "Focal length",
      "ISO",
    ]);

    expect(values.map((value) => value.textContent)).toEqual([
      "1/1000s",
      "f/7.1",
      "500mm",
      "1600",
    ]);
  });

  it("renders explanatory popovers for every setting", () => {
    const { container } = render(<PhotoObject photo={createPhoto()} />);

    const buttons = screen.getAllByRole("button");
    const popovers = Array.from(
      container.querySelectorAll(".c-photo__metadata-popover"),
    );

    expect(buttons).toHaveLength(4);
    expect(popovers).toHaveLength(4);

    buttons.forEach((button) => {
      expect(button).toHaveAttribute("type", "button");

      const target = button.getAttribute("popovertarget");

      expect(target).toBeTruthy();
      expect(container.querySelector(`#${CSS.escape(target!)}`)).not.toBeNull();
    });
  });

  it("includes the metadata explanations", () => {
    render(<PhotoObject photo={createPhoto()} />);

    expect(
      screen.getByText("How long the camera sensor was exposed to light."),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "The size of the lens opening controlling light intake.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "The focal length of the lens when the photograph was taken.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("The camera's sensitivity setting for light."),
    ).toBeInTheDocument();
  });

  it("generates distinct popover targets across instances", () => {
    const { container } = render(
      <>
        <PhotoObject photo={createPhoto()} />
        <PhotoObject photo={createPhoto({ id: "second" })} />
      </>,
    );

    const targets = Array.from(
      container.querySelectorAll("[popovertarget]"),
    ).map((button) => button.getAttribute("popovertarget"));

    expect(targets).toHaveLength(8);
    expect(new Set(targets).size).toBe(8);
  });
});
