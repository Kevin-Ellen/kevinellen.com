// src/app/life-cycle/app-render/document/page/body/modules/editorial-intro/editorial-intro.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { EditorialIntroModule } from "./editorial-intro.module.body.page.document.app-render";

type Module = Parameters<typeof EditorialIntroModule>[0]["module"];
type Portrait = NonNullable<Module["portrait"]>;

describe("EditorialIntroModule", () => {
  const createPortrait = (): Portrait =>
    ({
      src: "/media/portrait.webp",
      alt: "Photographer in Epping Forest",
      width: 800,
      height: 1000,
    }) as Portrait;

  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      eyebrow: "About",
      title: "Kevin Ellen",
      statement: "Wildlife photography and field observations.",
      description: "Exploring the natural world through photography.",
      location: null,
      portrait: null,
      ...overrides,
    }) as Module;

  it("renders the introductory content", () => {
    render(<EditorialIntroModule module={createModule()} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Kevin Ellen",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("About")).toHaveClass("m-editorial-intro__eyebrow");

    expect(
      screen.getByText("Wildlife photography and field observations."),
    ).toHaveClass("m-editorial-intro__statement");

    expect(
      screen.getByText("Exploring the natural world through photography."),
    ).toHaveClass("m-editorial-intro__description");
  });

  it("uses a semantic header with the frame layout", () => {
    const { container } = render(
      <EditorialIntroModule module={createModule()} />,
    );

    expect(container.querySelector("header")).toHaveClass(
      "m-editorial-intro",
      "l-frame",
    );
  });

  it("renders the location when provided", () => {
    render(
      <EditorialIntroModule
        module={createModule({
          location: "Loughton, Essex",
        })}
      />,
    );

    expect(screen.getByText("Loughton, Essex")).toHaveClass(
      "m-editorial-intro__location",
    );
  });

  it.each([null, ""])("omits the location when its value is %p", (location) => {
    const { container } = render(
      <EditorialIntroModule module={createModule({ location })} />,
    );

    expect(container.querySelector(".m-editorial-intro__location")).toBeNull();
  });

  it("renders an optional portrait with priority loading", () => {
    const { container } = render(
      <EditorialIntroModule
        module={createModule({
          portrait: createPortrait(),
        })}
      />,
    );

    const image = screen.getByRole("img", {
      name: "Photographer in Epping Forest",
    });

    expect(container.querySelector("figure")).toHaveClass(
      "c-photo",
      "m-editorial-intro__portrait",
    );

    expect(image).toHaveAttribute("src", "/media/portrait.webp");
    expect(image).toHaveAttribute("width", "800");
    expect(image).toHaveAttribute("height", "1000");
    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("fetchpriority", "high");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("omits the portrait figure when absent", () => {
    const { container } = render(
      <EditorialIntroModule module={createModule()} />,
    );

    expect(container.querySelector("figure")).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
  });
});
