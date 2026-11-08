// src/app/life-cycle/app-render/document/page/body/modules/banner/banner.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { BannerModule } from "./banner.module.body.page.document.app-render";
import { ContentComponent } from "../../components/component.body.page.document.app-render";

jest.mock("../../components/component.body.page.document.app-render", () => ({
  ContentComponent: jest.fn(() => <div data-testid="banner-component" />),
}));

const mockedContentComponent = jest.mocked(ContentComponent);

type Module = Parameters<typeof BannerModule>[0]["module"];
type Content = Module["components"][number];

describe("BannerModule", () => {
  const createContent = (value: string): Content =>
    ({
      kind: "paragraph",
      content: [{ kind: "text", value }],
    }) as Content;

  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      heading: {
        id: "banner-heading",
        text: "Wildlife photography",
      },
      media: {
        src: "/media/banner.webp",
        width: 1600,
        height: 900,
        alt: "Forest canopy",
        priority: false,
      },
      components: [],
      ...overrides,
    }) as Module;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a labelled banner section", () => {
    const { container } = render(<BannerModule module={createModule()} />);

    expect(container.querySelector("section")).toHaveClass("m-banner");

    expect(container.querySelector("section")).toHaveAttribute(
      "aria-labelledby",
      "banner-heading",
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Wildlife photography",
      }),
    ).toHaveAttribute("id", "banner-heading");
  });

  it("renders the banner image and picture element", () => {
    const { container } = render(<BannerModule module={createModule()} />);

    const image = screen.getByRole("img", {
      name: "Forest canopy",
    });

    expect(container.querySelector("picture")).toHaveClass("m-banner__media");
    expect(image).toHaveAttribute("src", "/media/banner.webp");
    expect(image).toHaveAttribute("width", "1600");
    expect(image).toHaveAttribute("height", "900");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("defaults to lazy image loading", () => {
    render(<BannerModule module={createModule()} />);

    expect(screen.getByRole("img")).toHaveAttribute("loading", "lazy");
    expect(screen.getByRole("img")).not.toHaveAttribute("fetchpriority");
  });

  it("supports priority image loading", () => {
    const module = createModule();

    render(
      <BannerModule
        module={{
          ...module,
          media: { ...module.media, priority: true },
        }}
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute("loading", "eager");

    expect(screen.getByRole("img")).toHaveAttribute("fetchpriority", "high");
  });

  it("delegates each component with the banner description class", () => {
    const components = [createContent("First"), createContent("Second")];

    render(<BannerModule module={createModule({ components })} />);

    expect(mockedContentComponent).toHaveBeenCalledTimes(2);

    components.forEach((component, index) => {
      expect(mockedContentComponent.mock.calls[index]?.[0]).toEqual({
        component,
        className: "m-banner__description",
      });
    });
  });

  it("supports an empty component collection", () => {
    render(<BannerModule module={createModule()} />);

    expect(screen.queryAllByTestId("banner-component")).toHaveLength(0);
    expect(mockedContentComponent).not.toHaveBeenCalled();
  });
});
