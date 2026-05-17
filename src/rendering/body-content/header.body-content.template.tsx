// src/rendering/body-content/header.body-content.template.tsx

import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

type Header = AppRenderContextBodyContent["header"];

type BodyContentHeaderTemplateProps = Readonly<{
  header: Header;
}>;

export const BodyContentHeaderTemplate = ({
  header,
}: BodyContentHeaderTemplateProps) => {
  if (header === null || header.showInBody === false) {
    return null;
  }

  return (
    <header className="m-heading l-content">
      {header.eyebrow ? (
        <p className="m-heading__eyebrow">{header.eyebrow}</p>
      ) : null}

      <h1 className="m-heading__title">{header.title}</h1>

      {header.intro ? <p className="m-heading__intro">{header.intro}</p> : null}
    </header>
  );
};
