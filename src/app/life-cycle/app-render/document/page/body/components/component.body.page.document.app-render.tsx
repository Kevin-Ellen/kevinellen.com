// src/app/life-cycle/app-render/document/page/body/components/component.body.page.document.app-render.tsx

import type { ReactNode } from "react";

import type { ComponentContentAppRenderContext } from "../../../../../../types/document/page/content/components/component.content.page.document.app-render-context.type";

import { ParagraphComponent } from "./paragraph/paragraph.component.body.page.document.app-render";
import { ListComponent } from "./list/list.component.body.page.document.app-render";
import { PhotoObject } from "./photo-object/photo-object.component.body.page.document.app-render";
import { EditorialPhotoComponent } from "./editorial-photo/editorial-photo.component.body.page.document.app-render";
import { RichListComponent } from "./rich-list/rich-list.component.body.page.document.app-render";

type Props = Readonly<{
  component: ComponentContentAppRenderContext;
  className?: string;
}>;

type ComponentKind = ComponentContentAppRenderContext["kind"];

type ComponentRenderer<K extends ComponentKind> = (
  props: Readonly<{
    component: Extract<ComponentContentAppRenderContext, { kind: K }>;
    className?: string;
  }>,
) => ReactNode;

const componentLibrary = {
  paragraph: ({ component, className }) => (
    <ParagraphComponent paragraph={component} className={className} />
  ),

  list: ({ component }) => <ListComponent list={component} />,

  photo: ({ component, className }) => (
    <PhotoObject
      photo={component.photo}
      wide={component.wide}
      className={className}
    />
  ),

  editorialPhoto: ({ component, className }) => (
    <EditorialPhotoComponent photo={component} className={className} />
  ),

  richList: ({ component, className }) => (
    <RichListComponent list={component} className={className} />
  ),
} satisfies {
  [K in ComponentKind]: ComponentRenderer<K>;
};

export const ContentComponent = ({ component, className }: Props) => {
  const Renderer = componentLibrary[
    component.kind
  ] as ComponentRenderer<ComponentKind>;

  return <Renderer component={component} className={className} />;
};
