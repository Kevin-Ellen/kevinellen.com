// src/app/life-cycle/app-render/document/page/body/modules/editorial-split/editorial-split.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { EditorialSplitModule } from "./editorial-split.module.body.page.document.app-render";
import { ContentComponent } from "../../components/component.body.page.document.app-render";

jest.mock("../../components/component.body.page.document.app-render", () => ({
  ContentComponent: jest.fn(() => <div data-testid="split-component" />),
}));

const mockedContent = jest.mocked(ContentComponent);

type Module = Parameters<typeof EditorialSplitModule>[0]["module"];
type Content = Module["components"][number];

describe("EditorialSplitModule", () => {
  const createContent = (value: string): Content =>
    ({
      kind: "paragraph",
      content: [{ kind: "text", value }],
    }) as Content;

  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      id: "photographic-approach",
      reverse: false,
      eyebrow: "Approach",
      heading: {
        id: "approach-heading",
        text: "An observational approach",
      },
      components: [],
      media: {
        kind: "editorialPhoto",
        src: "/media/forest.webp",
        alt: "Forest",
        width: 1200,
        height: 800,
      },
      ...overrides,
    }) as Module;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a labelled split section", () => {
    const { container } = render(
      <EditorialSplitModule module={createModule()} />,
    );

    const section = container.querySelector("section");

    expect(section).toHaveAttribute("id", "photographic-approach");
    expect(section).toHaveClass("m-editorial-split", "l-frame");
    expect(section).toHaveAttribute("aria-labelledby", "approach-heading");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "An observational approach",
      }),
    ).toHaveAttribute("id", "approach-heading");

    expect(screen.getByText("Approach")).toHaveClass(
      "m-editorial-split__eyebrow",
    );
  });

  it("does not apply the reverse class by default", () => {
    const { container } = render(
      <EditorialSplitModule module={createModule()} />,
    );

    expect(container.querySelector("section")).not.toHaveClass(
      "m-editorial-split--reverse",
    );
  });

  it("applies the reverse class when requested", () => {
    const { container } = render(
      <EditorialSplitModule module={createModule({ reverse: true })} />,
    );

    expect(container.querySelector("section")).toHaveClass(
      "m-editorial-split--reverse",
    );
  });

  it("delegates body components in order", () => {
    const components = [createContent("First"), createContent("Second")];

    render(<EditorialSplitModule module={createModule({ components })} />);

    expect(mockedContent).toHaveBeenCalledTimes(3);

    components.forEach((component, index) => {
      expect(mockedContent.mock.calls[index]?.[0]).toEqual({
        component,
      });
    });
  });

  it("delegates the media with its dedicated class", () => {
    const module = createModule();

    render(<EditorialSplitModule module={module} />);

    expect(mockedContent).toHaveBeenCalledTimes(1);
    expect(mockedContent.mock.calls[0]?.[0]).toEqual({
      component: module.media,
      className: "m-editorial-split__media",
    });
  });

  it("renders body components before the media", () => {
    const components = [createContent("First"), createContent("Second")];
    const module = createModule({ components });

    render(<EditorialSplitModule module={module} />);

    expect(mockedContent.mock.calls[0]?.[0].component).toBe(components[0]);

    expect(mockedContent.mock.calls[1]?.[0].component).toBe(components[1]);

    expect(mockedContent.mock.calls[2]?.[0].component).toBe(module.media);
  });

  it("renders media even when the body is empty", () => {
    render(<EditorialSplitModule module={createModule()} />);

    expect(screen.getAllByTestId("split-component")).toHaveLength(1);
  });
});
