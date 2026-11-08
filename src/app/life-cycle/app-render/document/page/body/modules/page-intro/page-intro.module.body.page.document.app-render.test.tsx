// src/app/life-cycle/app-render/document/page/body/modules/page-intro/page-intro.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { PageIntroModule } from "./page-intro.module.body.page.document.app-render";
import { Svg } from "../../../../../primitives/svg/svg.primitive.app-render";

jest.mock("../../../../../primitives/svg/svg.primitive.app-render", () => ({
  Svg: jest.fn(() => <svg data-testid="intro-icon" />),
}));

const mockedSvg = jest.mocked(Svg);

type Module = Parameters<typeof PageIntroModule>[0]["module"];

describe("PageIntroModule", () => {
  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      title: "Morning at Viru Bog",
      eyebrow: "Journal",
      description: "A morning among the wetlands.",
      location: "Viru Bog, Estonia",
      date: { iso: "2026-10-15", label: "15 October 2026" },
      ...overrides,
    }) as Module;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the page title and introductory text", () => {
    const { container } = render(<PageIntroModule module={createModule()} />);

    expect(container.querySelector("header")).toHaveClass(
      "m-page-intro",
      "l-reading",
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Morning at Viru Bog",
      }),
    ).toHaveClass("m-page-intro__title");

    expect(screen.getByText("Journal")).toHaveClass("m-page-intro__eyebrow");

    expect(screen.getByText("A morning among the wetlands.")).toHaveClass(
      "m-page-intro__description",
    );
  });

  it("omits optional eyebrow and description", () => {
    const { container } = render(
      <PageIntroModule
        module={createModule({ eyebrow: "", description: "" })}
      />,
    );

    expect(container.querySelector(".m-page-intro__eyebrow")).toBeNull();
    expect(container.querySelector(".m-page-intro__description")).toBeNull();
  });

  it("renders the location and location icon", () => {
    render(<PageIntroModule module={createModule()} />);

    expect(screen.getByText("Viru Bog, Estonia")).toBeInTheDocument();

    expect(mockedSvg.mock.calls[0]?.[0]).toEqual({
      svg: {
        id: "icon-location-dot",
        width: 16,
        height: 16,
      },
      className: "m-page-intro__meta-icon",
    });
  });

  it("omits location and its icon when absent", () => {
    const { container } = render(
      <PageIntroModule module={createModule({ location: "" })} />,
    );

    expect(container.querySelector(".m-page-intro__location")).toBeNull();
    expect(mockedSvg).toHaveBeenCalledTimes(1);
  });

  it("renders the semantic publication date and calendar icon", () => {
    const { container } = render(<PageIntroModule module={createModule()} />);

    const date = container.querySelector("time");

    expect(date).toHaveAttribute("datetime", "2026-10-15");
    expect(date).toHaveTextContent("15 October 2026");

    expect(mockedSvg.mock.calls.map(([props]) => props.svg.id)).toContain(
      "icon-calendar",
    );
  });

  it("renders date metadata even without location", () => {
    render(<PageIntroModule module={createModule({ location: "" })} />);

    expect(screen.getByText("15 October 2026")).toBeInTheDocument();
    expect(mockedSvg.mock.calls[0]?.[0].svg.id).toBe("icon-calendar");
  });
});
