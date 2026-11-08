// src/app/life-cycle/app-render/document/page/body/modules/editorial-feature/editorial-feature.module.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { EditorialFeatureModule } from "./editorial-feature.module.body.page.document.app-render";
import { ContentComponent } from "../../components/component.body.page.document.app-render";
import { EditorialPhotoComponent } from "../../components/editorial-photo/editorial-photo.component.body.page.document.app-render";

jest.mock("../../components/component.body.page.document.app-render", () => ({
  ContentComponent: jest.fn(() => <div data-testid="feature-content" />),
}));

jest.mock(
  "../../components/editorial-photo/editorial-photo.component.body.page.document.app-render",
  () => ({
    EditorialPhotoComponent: jest.fn(() => <div data-testid="feature-photo" />),
  }),
);

const mockedContent = jest.mocked(ContentComponent);
const mockedPhoto = jest.mocked(EditorialPhotoComponent);

type Module = Parameters<typeof EditorialFeatureModule>[0]["module"];
type Content = Module["components"][number];

describe("EditorialFeatureModule", () => {
  const createContent = (value: string): Content =>
    ({
      kind: "paragraph",
      content: [{ kind: "text", value }],
    }) as Content;

  const createModule = (overrides: Partial<Module> = {}): Module =>
    ({
      id: "local-wildlife",
      eyebrow: "In the field",
      heading: {
        id: "local-wildlife-heading",
        text: "Wildlife close to home",
      },
      components: [],
      media: {
        kind: "editorialPhoto",
        src: "/media/epping.webp",
        alt: "Epping Forest",
        width: 1200,
        height: 800,
        priority: false,
      },
      ...overrides,
    }) as Module;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the labelled feature section", () => {
    const { container } = render(
      <EditorialFeatureModule module={createModule()} />,
    );

    const section = container.querySelector("section");

    expect(section).toHaveAttribute("id", "local-wildlife");
    expect(section).toHaveClass("m-editorial-feature");
    expect(section).toHaveAttribute(
      "aria-labelledby",
      "local-wildlife-heading",
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Wildlife close to home",
      }),
    ).toHaveAttribute("id", "local-wildlife-heading");

    expect(screen.getByText("In the field")).toHaveClass(
      "m-editorial-feature__eyebrow",
    );
  });

  it("renders the content in the reading layout", () => {
    const { container } = render(
      <EditorialFeatureModule module={createModule()} />,
    );

    expect(
      container.querySelector(".m-editorial-feature__content.l-reading"),
    ).toBeInTheDocument();
  });

  it("delegates body components in order", () => {
    const components = [
      createContent("First observation"),
      createContent("Second observation"),
    ];

    render(<EditorialFeatureModule module={createModule({ components })} />);

    expect(mockedContent).toHaveBeenCalledTimes(2);

    components.forEach((component, index) => {
      expect(mockedContent.mock.calls[index]?.[0]).toEqual({
        component,
      });
    });
  });

  it("passes the editorial photograph with wide enabled", () => {
    const module = createModule();

    render(<EditorialFeatureModule module={module} />);

    expect(mockedPhoto).toHaveBeenCalledTimes(1);
    expect(mockedPhoto.mock.calls[0]?.[0]).toEqual({
      photo: module.media,
      wide: true,
    });
  });

  it("supports an empty body while retaining the photograph", () => {
    render(<EditorialFeatureModule module={createModule()} />);

    expect(screen.queryAllByTestId("feature-content")).toHaveLength(0);
    expect(screen.getByTestId("feature-photo")).toBeInTheDocument();
  });
});
