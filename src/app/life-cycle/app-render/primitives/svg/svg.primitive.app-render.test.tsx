// src/app/life-cycle/app-render/primitives/svg/svg.primitive.app-render.test.tsx

import { render } from "@testing-library/react";

import { Svg } from "./svg.primitive.app-render";

type Props = Parameters<typeof Svg>[0];
type SvgReference = Props["svg"];

describe("Svg AppRender primitive", () => {
  const createSvg = (overrides: Partial<SvgReference> = {}): SvgReference =>
    ({
      id: "camera",
      width: 24,
      height: 24,
      ...overrides,
    }) as SvgReference;

  it("renders an SVG element", () => {
    const { container } = render(<Svg svg={createSvg()} />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("references the correct SVG symbol", () => {
    const { container } = render(
      <Svg svg={createSvg({ id: "icon-camera" })} />,
    );

    expect(container.querySelector("use")).toHaveAttribute(
      "href",
      "#icon-camera",
    );
  });

  it("preserves the configured dimensions", () => {
    const { container } = render(
      <Svg
        svg={createSvg({
          width: 32,
          height: 20,
        })}
      />,
    );

    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "20");
  });

  it("hides the SVG from assistive technology", () => {
    const { container } = render(<Svg svg={createSvg()} />);

    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("applies an optional CSS class", () => {
    const { container } = render(
      <Svg svg={createSvg()} className="c-navigation__icon" />,
    );

    expect(container.querySelector("svg")).toHaveClass("c-navigation__icon");
  });

  it("does not add a class when none is provided", () => {
    const { container } = render(<Svg svg={createSvg()} />);

    expect(container.querySelector("svg")).not.toHaveAttribute("class");
  });

  it("renders exactly one SVG use element", () => {
    const { container } = render(<Svg svg={createSvg()} />);

    expect(container.querySelectorAll("svg use")).toHaveLength(1);
  });

  it("updates the referenced symbol when props change", () => {
    const { container, rerender } = render(
      <Svg svg={createSvg({ id: "icon-camera" })} />,
    );

    rerender(<Svg svg={createSvg({ id: "icon-location-dot" })} />);

    expect(container.querySelector("use")).toHaveAttribute(
      "href",
      "#icon-location-dot",
    );
  });
});
