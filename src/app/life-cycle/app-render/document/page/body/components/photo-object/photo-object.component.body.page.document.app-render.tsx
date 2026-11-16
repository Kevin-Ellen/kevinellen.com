// src/app/life-cycle/app-render/document/page/body/components/photo-object/photo-object.component.body.page.document.app-render.tsx

import { useId } from "react";

import type { PhotoAppRenderContext } from "../../../../../../../types/photo/photo.app-render-context.type";

import { Svg } from "../../../../../primitives/svg/svg.primitive.app-render";

type PhotoPresentation = Readonly<{
  wide?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  expandable?: boolean;
}>;

type Props = Readonly<{
  photo: PhotoAppRenderContext;
  presentation?: PhotoPresentation;
}>;

export const PhotoObject = ({ photo, presentation = {} }: Props) => {
  const {
    wide = false,
    priority = false,
    className,
    sizes,
    expandable = false,
  } = presentation;

  const id = useId();
  const dialogId = `${id}-viewer`;
  const dialogTitleId = `${id}-viewer-title`;

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

  const renderIdentity = (titleId?: string) => (
    <div className="c-photo__identity">
      <p className="c-photo__title" id={titleId}>
        {photo.title}
      </p>

      {photo.species.length > 0 && (
        <div className="c-photo__species">
          {photo.species.map(({ name, scientificName, taxonRank }) => (
            <span
              className="c-photo__species-item"
              key={`${scientificName}-${taxonRank}`}
            >
              {name}
              {scientificName && (
                <>
                  {" · "}
                  <em>{scientificName}</em>
                </>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderLocation = () =>
    photo.location ? (
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
    ) : null;

  const renderMetadata = (scope: "inline" | "viewer") => (
    <dl className="c-photo__metadata">
      {settings.map(({ id: settingId, label, value, explanation }) => {
        const popoverId = `${id}-${scope}-${settingId}`;

        return (
          <div className="c-photo__metadata-item" key={settingId}>
            <dt className="c-photo__metadata-term">
              <button
                type="button"
                className="c-photo__metadata-trigger"
                popoverTarget={popoverId}
              >
                {label}
              </button>
            </dt>

            <dd className="c-photo__metadata-value">{value}</dd>

            <div
              id={popoverId}
              popover="auto"
              className="c-photo__metadata-popover"
            >
              <p className="c-photo__metadata-explanation">{explanation}</p>
            </div>
          </div>
        );
      })}
    </dl>
  );

  const renderImage = (expanded = false) => (
    <img
      className={expanded ? "c-photo__viewer-image" : "c-photo__image"}
      src={expanded ? undefined : photo.image.src}
      srcSet={expanded ? undefined : photo.image.srcSet}
      sizes={expanded ? undefined : sizes}
      data-photo-viewer-src={expanded ? photo.image.viewerSrc : undefined}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading={expanded || priority ? "eager" : "lazy"}
      fetchPriority={!expanded && priority ? "high" : undefined}
      decoding="async"
    />
  );

  return (
    <figure
      className={["c-photo", wide && "c-photo--wide", className]
        .filter(Boolean)
        .join(" ")}
    >
      {expandable ? (
        <button
          type="button"
          className="c-photo__expand-trigger"
          aria-label={`Expand photograph: ${photo.title}. View description and camera settings.`}
          aria-haspopup="dialog"
          aria-controls={dialogId}
          data-photo-expand
        >
          {renderImage()}

          <span className="c-photo__expand-icon" aria-hidden="true">
            <Svg
              svg={{
                id: "icon-expand",
                width: 20,
                height: 20,
              }}
            />
          </span>
        </button>
      ) : (
        renderImage()
      )}

      <figcaption
        className={["c-photo__caption", wide && "l-reading"]
          .filter(Boolean)
          .join(" ")}
      >
        {renderIdentity()}
        {renderLocation()}

        {!expandable && (
          <>
            {photo.commentary && (
              <p className="c-photo__description">{photo.commentary}</p>
            )}

            {renderMetadata("inline")}
          </>
        )}
      </figcaption>

      {expandable && (
        <dialog
          id={dialogId}
          className="c-photo__viewer"
          aria-labelledby={dialogTitleId}
        >
          <div className="c-photo__viewer-content">
            <div className="c-photo__viewer-toolbar">
              <button
                type="button"
                className="c-photo__viewer-close"
                aria-label="Close photograph viewer"
                data-photo-close
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="c-photo__viewer-image-container">
              {renderImage(true)}
            </div>

            <div className="c-photo__viewer-details">
              {renderIdentity(dialogTitleId)}
              {renderLocation()}

              {photo.commentary && (
                <p className="c-photo__description">{photo.commentary}</p>
              )}

              {renderMetadata("viewer")}
            </div>
          </div>
        </dialog>
      )}
    </figure>
  );
};
