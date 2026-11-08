// src/app/life-cycle/app-render/document/page/body/modules/metadata-bar/metadata-bar.module.body.page.document.app-render.test.tsx

import { render, screen, within } from "@testing-library/react";

import { MetadataBarModule } from "./metadata-bar.module.body.page.document.app-render";
import { Svg } from "../../../../../primitives/svg/svg.primitive.app-render";

jest.mock("../../../../../primitives/svg/svg.primitive.app-render", () => ({
  Svg: jest.fn(() => <svg data-testid="metadata-icon" />),
}));

const mockedSvg = jest.mocked(Svg);

type Module = Parameters<typeof MetadataBarModule>[0]["module"];

describe("MetadataBarModule", () => {
  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      heading: "Photographic equipment",
      cameras: {
        icon: { id: "icon-camera", width: 16, height: 16 },
        entries: ["Canon EOS R7"],
      },
      lenses: {
        icon: { id: "icon-lens", width: 16, height: 16 },
        entries: ["RF 100–500mm", "RF 1.4× Extender"],
      },
      location: {
        icon: { id: "icon-location", width: 16, height: 16 },
        entries: "Epping Forest, Essex",
      },
      ...overrides,
    }) as Module;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the labelled aside and heading", () => {
    render(<MetadataBarModule module={createModule()} />);

    expect(
      screen.getByRole("complementary", {
        name: "Equipment and location",
      }),
    ).toHaveClass("m-metadata-bar", "l-frame");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Photographic equipment",
      }),
    ).toBeInTheDocument();
  });

  it("renders camera and lens entries as nested lists", () => {
    const { container } = render(<MetadataBarModule module={createModule()} />);

    const groups = Array.from(
      container.querySelectorAll(".m-metadata-bar__item"),
    );

    expect(groups).toHaveLength(3);

    expect(
      Array.from(groups[0].querySelectorAll(".m-metadata-bar__values li")).map(
        (element) => element.textContent,
      ),
    ).toEqual(["Canon EOS R7"]);

    expect(
      Array.from(groups[1].querySelectorAll(".m-metadata-bar__values li")).map(
        (element) => element.textContent,
      ),
    ).toEqual(["RF 100–500mm", "RF 1.4× Extender"]);

    expect(
      within(groups[2] as HTMLElement).getByText("Epping Forest, Essex"),
    ).toBeInTheDocument();
  });

  it("forwards the three corresponding icons", () => {
    const module = createModule();

    render(<MetadataBarModule module={module} />);

    expect(mockedSvg).toHaveBeenCalledTimes(3);

    expect(mockedSvg.mock.calls.map(([props]) => props.svg)).toEqual([
      module.cameras.icon,
      module.lenses.icon,
      module.location.icon,
    ]);
  });

  it("omits camera and lens groups when empty", () => {
    const module = createModule();

    const { container } = render(
      <MetadataBarModule
        module={{
          ...module,
          cameras: { ...module.cameras, entries: [] },
          lenses: { ...module.lenses, entries: [] },
        }}
      />,
    );

    expect(container.querySelectorAll(".m-metadata-bar__item")).toHaveLength(1);
    expect(mockedSvg).toHaveBeenCalledTimes(1);
    expect(mockedSvg.mock.calls[0]?.[0].svg).toBe(module.location.icon);
  });

  it("omits location when absent", () => {
    const module = createModule();

    render(
      <MetadataBarModule
        module={{
          ...module,
          location: { ...module.location, entries: null },
        }}
      />,
    );

    expect(screen.queryByText("Epping Forest, Essex")).toBeNull();
    expect(mockedSvg).toHaveBeenCalledTimes(2);
  });

  it("supports no equipment or location entries", () => {
    const module = createModule();

    const { container } = render(
      <MetadataBarModule
        module={{
          ...module,
          cameras: { ...module.cameras, entries: [] },
          lenses: { ...module.lenses, entries: [] },
          location: { ...module.location, entries: null },
        }}
      />,
    );

    expect(container.querySelectorAll(".m-metadata-bar__item")).toHaveLength(0);
    expect(mockedSvg).not.toHaveBeenCalled();
  });
});
