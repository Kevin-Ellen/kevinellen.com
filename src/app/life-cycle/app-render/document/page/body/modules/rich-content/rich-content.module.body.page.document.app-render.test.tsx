// src/app/life-cycle/app-render/document/page/body/modules/rich-content/rich-content.module.body.page.document.app-render.test.tsx

import { render } from "@testing-library/react";

import { RichContentModule } from "./rich-content.module.body.page.document.app-render";
import { ContentComponent } from "../../components/component.body.page.document.app-render";

jest.mock("../../components/component.body.page.document.app-render", () => ({
  ContentComponent: jest.fn(() => <div data-testid="rich-content-component" />),
}));

const mockedContent = jest.mocked(ContentComponent);

type Module = Parameters<typeof RichContentModule>[0]["module"];
type Content = Module["components"][number];

describe("RichContentModule", () => {
  const createContent = (value: string): Content =>
    ({
      kind: "paragraph",
      content: [{ kind: "text", value }],
    }) as Content;

  const createModule = (components: Content[] = []): Module => ({
    kind: "richContent",
    components,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses the reading container by default", () => {
    const { container } = render(
      <RichContentModule
        module={createModule([createContent("Observation")])}
      />,
    );

    expect(
      container.querySelector(
        ".l-reading > [data-testid='rich-content-component']",
      ),
    ).toBeInTheDocument();
  });

  it("uses the reading container when contained is true", () => {
    const { container } = render(
      <RichContentModule
        module={createModule([createContent("Observation")])}
        contained
      />,
    );

    expect(container.firstElementChild).toHaveClass("l-reading");
  });

  it("renders child components directly when uncontained", () => {
    const { container } = render(
      <RichContentModule
        module={createModule([createContent("First"), createContent("Second")])}
        contained={false}
      />,
    );

    expect(container.querySelector(".l-reading")).toBeNull();
    expect(container.children).toHaveLength(2);

    expect(
      Array.from(container.children).map((element) =>
        element.getAttribute("data-testid"),
      ),
    ).toEqual(["rich-content-component", "rich-content-component"]);
  });

  it("forwards each component reference in order", () => {
    const first = createContent("First");
    const second = createContent("Second");

    render(<RichContentModule module={createModule([first, second])} />);

    expect(mockedContent).toHaveBeenCalledTimes(2);
    expect(mockedContent.mock.calls[0]?.[0]).toEqual({
      component: first,
    });
    expect(mockedContent.mock.calls[1]?.[0]).toEqual({
      component: second,
    });
  });

  it("supports empty content with containment", () => {
    const { container } = render(<RichContentModule module={createModule()} />);

    expect(container.firstElementChild).toHaveClass("l-reading");
    expect(mockedContent).not.toHaveBeenCalled();
  });

  it("supports empty content without containment", () => {
    const { container } = render(
      <RichContentModule module={createModule()} contained={false} />,
    );

    expect(container).toBeEmptyDOMElement();
    expect(mockedContent).not.toHaveBeenCalled();
  });
});
