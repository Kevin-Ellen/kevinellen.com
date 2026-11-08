// src/app/life-cycle/app-render/document/page/body/modules/hero/hero.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { HeroModule } from "./hero.module.body.page.document.app-render";
import { Svg } from "../../../../../primitives/svg/svg.primitive.app-render";

jest.mock("../../../../../primitives/svg/svg.primitive.app-render", () => ({
  Svg: jest.fn(() => <svg data-testid="location-icon" />),
}));

const mockedSvg = jest.mocked(Svg);

type Module = Parameters<typeof HeroModule>[0]["module"];

describe("HeroModule", () => {
  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      eyebrow: "Wildlife photography",
      title: ["Nature", "Observed"],
      description: "Photography from the field.",
      media: {
        src: "/images/hero.webp",
        width: 1800,
        height: 1000,
        alt: "Forest landscape",
        fetchPriority: "high",
        sources: [
          {
            src: "/images/hero-mobile.webp",
            media: "(max-width: 48rem)",
            width: 800,
            height: 1000,
          },
          {
            src: "/images/hero-desktop.webp",
            media: "(min-width: 48rem)",
            width: 1800,
            height: 1000,
          },
        ],
      },
      location: null,
      ...overrides,
    }) as Module;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the hero header and copy", () => {
    const { container } = render(<HeroModule module={createModule()} />);

    expect(container.querySelector("header")).toHaveClass("m-hero");
    expect(screen.getByText("Wildlife photography")).toHaveClass(
      "m-hero__eyebrow",
    );
    expect(screen.getByText("Photography from the field.")).toHaveClass(
      "m-hero__description",
    );
  });

  it("renders multiple title lines separated by breaks", () => {
    const { container } = render(<HeroModule module={createModule()} />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading.querySelectorAll("span")).toHaveLength(2);
    expect(heading.querySelectorAll("br")).toHaveLength(1);
    expect(heading.textContent).toBe("NatureObserved");
    expect(container.querySelector(".m-hero__title")).toBe(heading);
  });

  it("does not introduce a break for the first title line", () => {
    const { container } = render(
      <HeroModule module={createModule({ title: ["Nature"] })} />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Nature",
    );
    expect(container.querySelector(".m-hero__title br")).toBeNull();
  });

  it("renders responsive picture sources in order", () => {
    const { container } = render(<HeroModule module={createModule()} />);

    const sources = Array.from(container.querySelectorAll("picture source"));

    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute("srcset", "/images/hero-mobile.webp");
    expect(sources[0]).toHaveAttribute("media", "(max-width: 48rem)");
    expect(sources[0]).toHaveAttribute("width", "800");
    expect(sources[0]).toHaveAttribute("height", "1000");
    expect(sources[1]).toHaveAttribute("srcset", "/images/hero-desktop.webp");
  });

  it("renders image metadata and fetch priority", () => {
    render(<HeroModule module={createModule()} />);

    const image = screen.getByRole("img", { name: "Forest landscape" });

    expect(image).toHaveAttribute("src", "/images/hero.webp");
    expect(image).toHaveAttribute("width", "1800");
    expect(image).toHaveAttribute("height", "1000");
    expect(image).toHaveAttribute("fetchpriority", "high");
  });

  it("supports an empty source collection", () => {
    const module = createModule();

    const { container } = render(
      <HeroModule
        module={{
          ...module,
          media: { ...module.media, sources: [] },
        }}
      />,
    );

    expect(container.querySelectorAll("source")).toHaveLength(0);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("omits location when absent", () => {
    const { container } = render(<HeroModule module={createModule()} />);

    expect(container.querySelector(".m-hero__location")).toBeNull();
    expect(mockedSvg).not.toHaveBeenCalled();
  });

  it("forwards the location icon", () => {
    const icon = {
      id: "icon-location-dot",
      width: 16,
      height: 16,
    } as const;

    render(
      <HeroModule
        module={createModule({
          location: {
            label: "Estonia",
            icon,
          },
        })}
      />,
    );

    expect(mockedSvg).toHaveBeenCalledTimes(1);
    expect(mockedSvg.mock.calls[0]?.[0]).toEqual({
      svg: icon,
      className: "c-photo-location__icon",
    });
  });
});
