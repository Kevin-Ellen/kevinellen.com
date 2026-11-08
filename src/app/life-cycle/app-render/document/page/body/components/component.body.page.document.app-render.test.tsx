// src/app/life-cycle/app-render/document/page/body/components/component.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { ContentComponent } from "./component.body.page.document.app-render";

import { ParagraphComponent } from "./paragraph/paragraph.component.body.page.document.app-render";
import { ListComponent } from "./list/list.component.body.page.document.app-render";
import { PhotoObject } from "./photo-object/photo-object.component.body.page.document.app-render";
import { EditorialPhotoComponent } from "./editorial-photo/editorial-photo.component.body.page.document.app-render";
import { RichListComponent } from "./rich-list/rich-list.component.body.page.document.app-render";

jest.mock(
  "./paragraph/paragraph.component.body.page.document.app-render",
  () => ({
    ParagraphComponent: jest.fn(() => (
      <div data-testid="paragraph-component" />
    )),
  }),
);

jest.mock("./list/list.component.body.page.document.app-render", () => ({
  ListComponent: jest.fn(() => <div data-testid="list-component" />),
}));

jest.mock(
  "./photo-object/photo-object.component.body.page.document.app-render",
  () => ({
    PhotoObject: jest.fn(() => <div data-testid="photo-component" />),
  }),
);

jest.mock(
  "./editorial-photo/editorial-photo.component.body.page.document.app-render",
  () => ({
    EditorialPhotoComponent: jest.fn(() => (
      <div data-testid="editorial-photo-component" />
    )),
  }),
);

jest.mock(
  "./rich-list/rich-list.component.body.page.document.app-render",
  () => ({
    RichListComponent: jest.fn(() => <div data-testid="rich-list-component" />),
  }),
);

const mockedParagraph = jest.mocked(ParagraphComponent);
const mockedList = jest.mocked(ListComponent);
const mockedPhoto = jest.mocked(PhotoObject);
const mockedEditorialPhoto = jest.mocked(EditorialPhotoComponent);
const mockedRichList = jest.mocked(RichListComponent);

type Props = Parameters<typeof ContentComponent>[0];
type Content = Props["component"];
type Kind = Content["kind"];

type ParagraphContent = Extract<Content, { kind: "paragraph" }>;
type ListContent = Extract<Content, { kind: "list" }>;
type PhotoContent = Extract<Content, { kind: "photo" }>;
type EditorialPhotoContent = Extract<Content, { kind: "editorialPhoto" }>;
type RichListContent = Extract<Content, { kind: "richList" }>;

describe("ContentComponent AppRender dispatcher", () => {
  const createParagraph = (): ParagraphContent =>
    ({
      kind: "paragraph",
      content: [
        {
          kind: "text",
          value: "Wildlife photography",
        },
      ],
    }) as ParagraphContent;

  const createList = (): ListContent =>
    ({
      kind: "list",
      items: [
        {
          content: [
            {
              kind: "text",
              value: "Epping Forest",
            },
          ],
        },
      ],
    }) as ListContent;

  const createPhoto = (): PhotoContent =>
    ({
      kind: "photo",
      wide: true,
      photo: {
        id: "woodpecker",
        alt: "Woodpecker perched on a tree",
      },
    }) as unknown as PhotoContent;

  const createEditorialPhoto = (): EditorialPhotoContent =>
    ({
      kind: "editorialPhoto",
      src: "/media/forest.webp",
      alt: "Forest in morning light",
      width: 1200,
      height: 800,
    }) as EditorialPhotoContent;

  const createRichList = (): RichListContent =>
    ({
      kind: "richList",
      items: [
        {
          label: "Camera",
          values: ["Canon EOS R7"],
          icon: {
            id: "icon-camera",
            width: 24,
            height: 24,
          },
        },
      ],
    }) as unknown as RichListContent;

  const renderers = {
    paragraph: mockedParagraph,
    list: mockedList,
    photo: mockedPhoto,
    editorialPhoto: mockedEditorialPhoto,
    richList: mockedRichList,
  };

  const testIds: Record<Kind, string> = {
    paragraph: "paragraph-component",
    list: "list-component",
    photo: "photo-component",
    editorialPhoto: "editorial-photo-component",
    richList: "rich-list-component",
  };

  const contents: Record<Kind, Content> = {
    paragraph: createParagraph(),
    list: createList(),
    photo: createPhoto(),
    editorialPhoto: createEditorialPhoto(),
    richList: createRichList(),
  };

  const kinds = Object.keys(renderers) as Kind[];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Dispatch", () => {
    it.each(kinds)("dispatches %s content to its renderer", (kind) => {
      const component = contents[kind];

      render(<ContentComponent component={component} />);

      expect(screen.getByTestId(testIds[kind])).toBeInTheDocument();
      expect(renderers[kind]).toHaveBeenCalledTimes(1);

      for (const otherKind of kinds) {
        if (otherKind !== kind) {
          expect(renderers[otherKind]).not.toHaveBeenCalled();
        }
      }
    });

    it.each(kinds)(
      "does not introduce an additional DOM wrapper for %s",
      (kind) => {
        const { container } = render(
          <ContentComponent component={contents[kind]} />,
        );

        expect(container.children).toHaveLength(1);
        expect(container.firstElementChild).toHaveAttribute(
          "data-testid",
          testIds[kind],
        );
      },
    );

    it("switches renderers when the component kind changes", () => {
      const { rerender } = render(
        <ContentComponent component={createParagraph()} />,
      );

      expect(screen.getByTestId("paragraph-component")).toBeInTheDocument();

      rerender(<ContentComponent component={createRichList()} />);

      expect(screen.queryByTestId("paragraph-component")).toBeNull();
      expect(screen.getByTestId("rich-list-component")).toBeInTheDocument();

      expect(mockedParagraph).toHaveBeenCalledTimes(1);
      expect(mockedRichList).toHaveBeenCalledTimes(1);
    });

    it("updates the selected renderer when content changes", () => {
      const first = createParagraph();

      const second = {
        ...createParagraph(),
        content: [
          {
            kind: "text",
            value: "Updated observation",
          },
        ],
      } as ParagraphContent;

      const { rerender } = render(<ContentComponent component={first} />);

      rerender(<ContentComponent component={second} />);

      expect(mockedParagraph).toHaveBeenCalledTimes(2);
      expect(mockedParagraph.mock.calls[0]?.[0].paragraph).toBe(first);
      expect(mockedParagraph.mock.calls[1]?.[0].paragraph).toBe(second);
    });
  });

  describe("Paragraph", () => {
    it("forwards the original paragraph and className", () => {
      const component = createParagraph();

      render(
        <ContentComponent component={component} className="m-article__intro" />,
      );

      expect(mockedParagraph.mock.calls[0]?.[0]).toEqual({
        paragraph: component,
        className: "m-article__intro",
      });
    });

    it("does not transform paragraph content", () => {
      const component = createParagraph();

      render(<ContentComponent component={component} />);

      expect(mockedParagraph.mock.calls[0]?.[0].paragraph).toBe(component);
      expect(component.content).toHaveLength(1);
    });
  });

  describe("List", () => {
    it("forwards the original list reference", () => {
      const component = createList();

      render(<ContentComponent component={component} />);

      expect(mockedList.mock.calls[0]?.[0]).toEqual({
        list: component,
      });

      expect(mockedList.mock.calls[0]?.[0].list).toBe(component);
    });

    it("does not forward className to ListComponent", () => {
      const component = createList();

      render(
        <ContentComponent component={component} className="m-article__list" />,
      );

      expect(mockedList.mock.calls[0]?.[0]).toEqual({
        list: component,
      });
    });
  });

  describe("Photo", () => {
    it("forwards the nested photo object", () => {
      const component = createPhoto();

      render(<ContentComponent component={component} />);

      expect(mockedPhoto.mock.calls[0]?.[0].photo).toBe(component.photo);
    });

    it("forwards the wide flag", () => {
      const component = createPhoto();

      render(<ContentComponent component={component} />);

      expect(mockedPhoto.mock.calls[0]?.[0].wide).toBe(component.wide);
    });

    it("forwards the custom className", () => {
      const component = createPhoto();

      render(
        <ContentComponent component={component} className="m-gallery__photo" />,
      );

      expect(mockedPhoto.mock.calls[0]?.[0]).toEqual({
        photo: component.photo,
        wide: component.wide,
        className: "m-gallery__photo",
      });
    });

    it("does not supply unrelated PhotoObject props", () => {
      const component = createPhoto();

      render(<ContentComponent component={component} />);

      const props = mockedPhoto.mock.calls[0]?.[0];

      expect(props).not.toHaveProperty("priority");
      expect(props).not.toHaveProperty("sizes");
    });
  });

  describe("Editorial photo", () => {
    it("forwards the original editorial photo reference", () => {
      const component = createEditorialPhoto();

      render(<ContentComponent component={component} />);

      expect(mockedEditorialPhoto.mock.calls[0]?.[0].photo).toBe(component);
    });

    it("forwards the custom className", () => {
      const component = createEditorialPhoto();

      render(
        <ContentComponent component={component} className="m-feature__image" />,
      );

      expect(mockedEditorialPhoto.mock.calls[0]?.[0]).toEqual({
        photo: component,
        className: "m-feature__image",
      });
    });

    it("does not supply wide automatically", () => {
      render(<ContentComponent component={createEditorialPhoto()} />);

      expect(mockedEditorialPhoto.mock.calls[0]?.[0]).not.toHaveProperty(
        "wide",
      );
    });
  });

  describe("Rich list", () => {
    it("forwards the original rich-list reference", () => {
      const component = createRichList();

      render(<ContentComponent component={component} />);

      expect(mockedRichList.mock.calls[0]?.[0].list).toBe(component);
    });

    it("forwards the custom className", () => {
      const component = createRichList();

      render(
        <ContentComponent
          component={component}
          className="m-article__metadata"
        />,
      );

      expect(mockedRichList.mock.calls[0]?.[0]).toEqual({
        list: component,
        className: "m-article__metadata",
      });
    });
  });

  describe("Error propagation", () => {
    it.each(kinds)("propagates errors from the %s renderer", (kind) => {
      const error = new Error(`${kind} rendering failed`);

      renderers[kind].mockImplementation(() => {
        throw error;
      });

      expect(() =>
        render(<ContentComponent component={contents[kind]} />),
      ).toThrow(error);

      for (const otherKind of kinds) {
        if (otherKind !== kind) {
          expect(renderers[otherKind]).not.toHaveBeenCalled();
        }
      }
    });
  });
});
