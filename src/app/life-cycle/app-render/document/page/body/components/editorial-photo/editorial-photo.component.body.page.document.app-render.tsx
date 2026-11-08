// src/app/life-cycle/app-render/document/page/body/components/editorial-photo/editorial-photo.component.body.page.document.app-render.tsx

import type { EditorialPhotoComponentContentAppRenderContext } from "../../../../../../../types/document/page/content/components/editorial-photo/editorial-photo.component.content.page.document.app-render-context.type";

type Props = Readonly<{
  photo: EditorialPhotoComponentContentAppRenderContext;
  className?: string;
  wide?: boolean;
}>;

export const EditorialPhotoComponent = ({
  photo,
  className,
  wide = false,
}: Props) => {
  const image = (
    <img
      className="c-photo__image"
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={photo.priority ? "eager" : "lazy"}
      fetchPriority={photo.priority ? "high" : undefined}
      decoding="async"
    />
  );

  return (
    <figure
      className={["c-photo", wide && "c-photo--wide", className]
        .filter(Boolean)
        .join(" ")}
    >
      {wide ? <div className="l-frame">{image}</div> : image}

      {photo.description && (
        <figcaption
          className={["c-photo__caption", wide && "l-reading"]
            .filter(Boolean)
            .join(" ")}
        >
          <p className="c-photo__description">{photo.description}</p>
        </figcaption>
      )}
    </figure>
  );
};
