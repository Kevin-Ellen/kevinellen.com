// src/app/life-cycle/app-render/document/page/body/components/photo-object/photo-object.component.body.page.document.app-render.tsx

import { useId } from "react";

import type { PhotoAppRenderContext } from "../../../../../../../types/photo/photo.app-render-context.type";

import { Svg } from "../../../../../primitives/svg/svg.primitive.app-render";

type Props = Readonly<{
  photo: PhotoAppRenderContext;
  wide?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}>;

export const PhotoObject = ({
  photo,
  wide = false,
  priority = false,
  className,
  sizes,
}: Props) => {
  const id = useId();

  const settings = [
    {
      id: "shutter",
      label: "Shutter speed",
      value: photo.metadata.shutter,
      explanation: "How long the camera sensor was exposed to light.",
    },
    {
      id: "aperture",
      label: "Aperture",
      value: photo.metadata.aperture,
      explanation: "The size of the lens opening controlling light intake.",
    },
    {
      id: "focal-length",
      label: "Focal length",
      value: photo.metadata.focalLength,
      explanation:
        "The focal length of the lens when the photograph was taken.",
    },
    {
      id: "iso",
      label: "ISO",
      value: photo.metadata.iso,
      explanation: "The camera's sensitivity setting for light.",
    },
  ] as const;

  return (
    <figure
      className={["c-photo", wide && "c-photo--wide", className]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        className="c-photo__image"
        src={photo.image.src}
        srcSet={photo.image.srcSet}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />

      <figcaption
        className={["c-photo__caption", wide && "l-reading"]
          .filter(Boolean)
          .join(" ")}
      >
        {photo.commentary && (
          <p className="c-photo__description">{photo.commentary}</p>
        )}

        {photo && (
          <div className="c-photo__location">
            <Svg
              svg={{
                id: "icon-location-dot",
                width: 16,
                height: 16,
              }}
              className="c-photo__location-icon"
            />
            <span>{photo.location}</span>
          </div>
        )}

        <dl className="c-photo__metadata">
          {settings.map(({ id: settingId, label, value, explanation }) => {
            const popoverId = `${id}-${settingId}`;

            return (
              <div className="c-photo__metadata-item" key={settingId}>
                <dt className="c-photo__metadata-term">
                  <button
                    type="button"
                    className="c-photo__metadata-trigger"
                    popoverTarget={popoverId}
                    style={{ anchorName: `--${popoverId}` }}
                  >
                    {label}
                  </button>
                </dt>

                <dd className="c-photo__metadata-value">{value}</dd>

                <div
                  id={popoverId}
                  popover="auto"
                  className="c-photo__metadata-popover"
                  style={{ positionAnchor: `--${popoverId}` }}
                >
                  <p className="c-photo__metadata-explanation">{explanation}</p>
                </div>
              </div>
            );
          })}
        </dl>
      </figcaption>
    </figure>
  );
};
