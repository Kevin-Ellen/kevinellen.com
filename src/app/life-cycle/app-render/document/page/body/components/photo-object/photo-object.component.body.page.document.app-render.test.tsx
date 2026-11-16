// src/app/life-cycle/app-render/document/page/body/components/photo-object/photo-object.component.body.page.document.app-render.test.tsx

// src/app/life-cycle/app-render/document/page/body/components/photo-object/photo-object.component.body.page.document.app-render.test.tsx

import { render, screen, within } from "@testing-library/react";

import { PhotoObject } from "./photo-object.component.body.page.document.app-render";

type Props = Parameters<typeof PhotoObject>[0];
type Photo = Props["photo"];

describe("PhotoObject", () => {
  const createPhoto = (overrides: Partial<Photo> = {}): Photo => ({
    id: "woodpecker",
    title: "An Unexpected Encounter",
    species: [
      {
        name: "Great spotted woodpecker",
        scientificName: "Dendrocopos major",
        taxonRank: "species",
      },
    ],
    image: {
      id: "cf-woodpecker",
      src: "/media/photo/1200/800/woodpecker",
      srcSet: "/media/photo/400/267/woodpecker 400w",
      viewerSrc: "/media/photo/woodpecker",
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
  });

  describe("image rendering", () => {
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
      render(
        <PhotoObject photo={createPhoto()} presentation={{ priority: true }} />,
      );

      const image = screen.getByRole("img");

      expect(image).toHaveAttribute("loading", "eager");
      expect(image).toHaveAttribute("fetchpriority", "high");
    });

    it("forwards the sizes attribute", () => {
      render(
        <PhotoObject
          photo={createPhoto()}
          presentation={{
            sizes: "(max-width: 48rem) 100vw, 50vw",
          }}
        />,
      );

      expect(screen.getByRole("img")).toHaveAttribute(
        "sizes",
        "(max-width: 48rem) 100vw, 50vw",
      );
    });

    it("combines wide and custom figure classes", () => {
      const { container } = render(
        <PhotoObject
          photo={createPhoto()}
          presentation={{
            wide: true,
            className: "m-gallery__photo",
          }}
        />,
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
  });

  describe("photograph identity", () => {
    it("renders the editorial title", () => {
      render(<PhotoObject photo={createPhoto()} />);

      expect(screen.getByText("An Unexpected Encounter")).toHaveClass(
        "c-photo__title",
      );
    });

    it("renders the common and scientific names", () => {
      render(<PhotoObject photo={createPhoto()} />);

      expect(
        screen.getByText("Great spotted woodpecker", {
          exact: false,
        }),
      ).toHaveClass("c-photo__species-item");

      const scientificName = screen.getByText("Dendrocopos major");

      expect(scientificName.tagName).toBe("EM");
    });

    it("supports multiple species identifications", () => {
      render(
        <PhotoObject
          photo={createPhoto({
            species: [
              {
                name: "Western marsh harrier",
                scientificName: "Circus aeruginosus",
                taxonRank: "species",
              },
              {
                name: "Pied wagtail",
                scientificName: "Motacilla alba yarrellii",
                taxonRank: "subspecies",
              },
            ],
          })}
        />,
      );

      expect(screen.getByText("Circus aeruginosus")).toBeInTheDocument();

      expect(screen.getByText("Motacilla alba yarrellii")).toBeInTheDocument();
    });

    it("omits the species block when no species are identified", () => {
      const { container } = render(
        <PhotoObject photo={createPhoto({ species: [] })} />,
      );

      expect(container.querySelector(".c-photo__species")).toBeNull();
      expect(screen.getByText("An Unexpected Encounter")).toBeInTheDocument();
    });

    it("renders the photograph location and icon", () => {
      const { container } = render(<PhotoObject photo={createPhoto()} />);

      expect(screen.getByText("Epping Forest, Essex")).toBeInTheDocument();

      const icon = container.querySelector(".c-photo__location-icon use");

      expect(icon).toHaveAttribute("href", "#icon-location-dot");
    });

    it("omits location when absent", () => {
      const { container } = render(
        <PhotoObject photo={createPhoto({ location: "" })} />,
      );

      expect(container.querySelector(".c-photo__location")).toBeNull();
    });
  });

  describe("non-expandable photographs", () => {
    it("renders the commentary inline", () => {
      render(<PhotoObject photo={createPhoto()} />);

      expect(
        screen.getByText("An unexpected encounter in the forest."),
      ).toHaveClass("c-photo__description");
    });

    it("omits commentary when absent", () => {
      const { container } = render(
        <PhotoObject photo={createPhoto({ commentary: "" })} />,
      );

      expect(container.querySelector(".c-photo__description")).toBeNull();
    });

    it("does not render an expansion trigger or dialog", () => {
      const { container } = render(<PhotoObject photo={createPhoto()} />);

      expect(container.querySelector(".c-photo__expand-trigger")).toBeNull();

      expect(container.querySelector("dialog")).toBeNull();
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
        expect(document.getElementById(target!)).not.toBeNull();
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

  describe("expandable photographs", () => {
    const renderExpandable = () =>
      render(
        <PhotoObject
          photo={createPhoto()}
          presentation={{ expandable: true }}
        />,
      );

    it("renders an accessible expansion trigger", () => {
      const { container } = renderExpandable();

      const trigger = screen.getByRole("button", {
        name: /Expand photograph: An Unexpected Encounter/,
      });

      expect(trigger).toHaveAttribute("type", "button");
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      expect(trigger).toHaveAttribute(
        "aria-controls",
        container.querySelector("dialog")?.id,
      );

      expect(
        within(trigger).getByRole("img", {
          name: "Woodpecker perched on a tree",
        }),
      ).toBeInTheDocument();
    });

    it("keeps identity and location visible in the inline caption", () => {
      const { container } = renderExpandable();

      const caption = container.querySelector("figcaption");

      expect(caption).not.toBeNull();

      expect(
        within(caption as HTMLElement).getByText("An Unexpected Encounter"),
      ).toBeInTheDocument();

      expect(
        within(caption as HTMLElement).getByText("Dendrocopos major"),
      ).toBeInTheDocument();

      expect(
        within(caption as HTMLElement).getByText("Epping Forest, Essex"),
      ).toBeInTheDocument();
    });

    it("moves commentary and camera settings out of the inline caption", () => {
      const { container } = renderExpandable();

      const caption = container.querySelector("figcaption");

      expect(caption?.querySelector(".c-photo__description")).toBeNull();
      expect(caption?.querySelector(".c-photo__metadata")).toBeNull();

      const dialog = container.querySelector("dialog");

      expect(dialog).not.toBeNull();

      expect(dialog?.querySelector(".c-photo__description")).toHaveTextContent(
        "An unexpected encounter in the forest.",
      );

      expect(dialog?.querySelectorAll(".c-photo__metadata-item")).toHaveLength(
        4,
      );
    });

    it("renders a closed dialog linked to its expansion trigger", () => {
      const { container } = renderExpandable();

      const trigger = screen.getByRole("button", {
        name: /Expand photograph: An Unexpected Encounter/,
      });
      const dialog = container.querySelector("dialog");

      expect(dialog).not.toBeNull();
      expect(dialog).not.toHaveAttribute("open");
      expect(trigger).toHaveAttribute("data-photo-expand");
      expect(trigger).toHaveAttribute("aria-controls", dialog?.id);
      expect(dialog).toHaveAttribute("aria-labelledby", `${dialog?.id}-title`);
      expect(document.getElementById(`${dialog?.id}-title`)).toHaveTextContent(
        "An Unexpected Encounter",
      );
    });

    it("renders the deferred viewer image and metadata", () => {
      const { container } = renderExpandable();
      const dialog = container.querySelector("dialog");

      expect(dialog).not.toBeNull();

      const viewerImage = dialog?.querySelector(".c-photo__viewer-image");

      expect(viewerImage).toHaveAttribute(
        "alt",
        "Woodpecker perched on a tree",
      );
      expect(viewerImage).toHaveAttribute(
        "data-photo-viewer-src",
        "/media/photo/woodpecker",
      );
      expect(viewerImage).not.toHaveAttribute("src");
      expect(viewerImage).not.toHaveAttribute("srcset");
      expect(viewerImage).toHaveAttribute("width", "1200");
      expect(viewerImage).toHaveAttribute("height", "800");

      expect(dialog?.querySelector(".c-photo__description")).toHaveTextContent(
        "An unexpected encounter in the forest.",
      );
      expect(dialog?.querySelector(".c-photo__metadata")).toHaveTextContent(
        "500mm",
      );
      expect(dialog?.querySelector(".c-photo__metadata")).toHaveTextContent(
        "1600",
      );
    });

    it("prepares the viewer image for eager loading without requesting it immediately", () => {
      const { container } = renderExpandable();

      const image = container.querySelector(".c-photo__viewer-image");

      expect(image).toHaveAttribute("loading", "eager");
      expect(image).toHaveAttribute(
        "data-photo-viewer-src",
        "/media/photo/woodpecker",
      );
      expect(image).not.toHaveAttribute("src");
    });

    it("renders a close control for the browser script", () => {
      const { container } = renderExpandable();
      const dialog = container.querySelector("dialog");

      expect(dialog).not.toBeNull();

      const closeButton = dialog?.querySelector("[data-photo-close]");

      expect(closeButton).toHaveAttribute("type", "button");
      expect(closeButton).toHaveAttribute(
        "aria-label",
        "Close photograph viewer",
      );
    });

    it("keeps the dialog closed until the browser script runs", () => {
      const { container } = renderExpandable();
      const dialog = container.querySelector("dialog");

      expect(dialog).not.toBeNull();
      expect(dialog).not.toHaveAttribute("open");
      expect(dialog?.querySelector("[data-photo-close]")).not.toBeNull();
    });

    it("generates independent dialogs for multiple photographs", () => {
      const { container } = render(
        <>
          <PhotoObject
            photo={createPhoto()}
            presentation={{ expandable: true }}
          />
          <PhotoObject
            photo={createPhoto({
              id: "second",
              title: "A Second Encounter",
            })}
            presentation={{ expandable: true }}
          />
        </>,
      );

      const dialogs = Array.from(container.querySelectorAll("dialog"));
      const dialogIds = dialogs.map((dialog) => dialog.id);
      const triggers = Array.from(
        container.querySelectorAll("[data-photo-expand]"),
      );

      expect(dialogs).toHaveLength(2);
      expect(new Set(dialogIds).size).toBe(2);
      expect(triggers).toHaveLength(2);
      expect(
        triggers.map((trigger) => trigger.getAttribute("aria-controls")),
      ).toEqual(dialogIds);
      expect(dialogs[0]).not.toHaveAttribute("open");
      expect(dialogs[1]).not.toHaveAttribute("open");
    });

    it("generates distinct metadata popover IDs in the viewer", () => {
      const { container } = render(
        <>
          <PhotoObject
            photo={createPhoto()}
            presentation={{ expandable: true }}
          />
          <PhotoObject
            photo={createPhoto({ id: "second" })}
            presentation={{ expandable: true }}
          />
        </>,
      );

      const targets = Array.from(
        container.querySelectorAll("[popovertarget]"),
      ).map((button) => button.getAttribute("popovertarget"));

      expect(targets).toHaveLength(8);
      expect(new Set(targets).size).toBe(8);

      targets.forEach((target) => {
        expect(document.getElementById(target!)).not.toBeNull();
      });
    });
  });
});
