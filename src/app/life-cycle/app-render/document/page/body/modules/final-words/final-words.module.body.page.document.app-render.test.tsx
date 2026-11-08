// src/app/life-cycle/app-render/document/page/body/modules/final-words/final-words.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { FinalWordsModule } from "./final-words.module.body.page.document.app-render";
import { ContentComponent } from "../../components/component.body.page.document.app-render";

jest.mock("../../components/component.body.page.document.app-render", () => ({
  ContentComponent: jest.fn(() => <div data-testid="final-words-content" />),
}));

const mockedContent = jest.mocked(ContentComponent);

type Module = Parameters<typeof FinalWordsModule>[0]["module"];
type Content = Module["components"][number];

describe("FinalWordsModule", () => {
  const createContent = (value: string): Content =>
    ({
      kind: "paragraph",
      content: [{ kind: "text", value }],
    }) as Content;

  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      eyebrow: "Final thoughts",
      heading: {
        id: "final-words-heading",
        text: "Until next time",
      },
      components: [],
      ...overrides,
    }) as Module;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a labelled final words section", () => {
    const { container } = render(<FinalWordsModule module={createModule()} />);

    const section = container.querySelector("section");

    expect(section).toHaveClass("m-final-words", "l-reading");
    expect(section).toHaveAttribute("aria-labelledby", "final-words-heading");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Until next time",
      }),
    ).toHaveAttribute("id", "final-words-heading");
  });

  it("renders the eyebrow text", () => {
    render(<FinalWordsModule module={createModule()} />);

    expect(screen.getByText("Final thoughts")).toHaveClass(
      "m-final-words__eyebrow",
    );
  });

  it("delegates components in their original order", () => {
    const components = [
      createContent("First reflection"),
      createContent("Second reflection"),
    ];

    render(<FinalWordsModule module={createModule({ components })} />);

    expect(mockedContent).toHaveBeenCalledTimes(2);

    components.forEach((component, index) => {
      expect(mockedContent.mock.calls[index]?.[0]).toEqual({
        component,
      });
    });
  });

  it("renders components inside the content container", () => {
    const { container } = render(
      <FinalWordsModule
        module={createModule({
          components: [createContent("Closing thought")],
        })}
      />,
    );

    expect(
      container.querySelector(
        ".m-final-words__content > [data-testid='final-words-content']",
      ),
    ).toBeInTheDocument();
  });

  it("supports an empty component collection", () => {
    render(<FinalWordsModule module={createModule()} />);

    expect(screen.queryAllByTestId("final-words-content")).toHaveLength(0);

    expect(mockedContent).not.toHaveBeenCalled();
  });
});
