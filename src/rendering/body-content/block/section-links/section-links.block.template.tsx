// src/rendering/body-content/block/section-links/section-links.block.template.tsx

import type { AppRenderContextSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-render-context.section-links.block.types";

import { HeadingTemplate } from "@rendering/shared/heading.shared.template";
import { SvgReferenceTemplate } from "@rendering/shared/svg-reference.shared.template";

type SectionLinksBlockTemplateProps = Readonly<{
  block: AppRenderContextSectionLinksBlock;
}>;

type SectionLinksItem = AppRenderContextSectionLinksBlock["sections"][number];

type SectionLinksItemTemplateProps = Readonly<{
  section: SectionLinksItem;
}>;

const SectionLinksIconTemplate = ({
  icon,
}: {
  icon: SectionLinksItem["icon"];
}) => {
  if (icon === null) {
    return null;
  }

  return <SvgReferenceTemplate svg={icon} className="m-section-links__icon" />;
};

const SectionLinksItemTemplate = ({
  section,
}: SectionLinksItemTemplateProps) => (
  <article className="m-section-links__item">
    <a className="m-section-links__link" href={section.link.href}>
      <SectionLinksIconTemplate icon={section.icon} />

      <div className="m-section-links__content">
        <HeadingTemplate
          heading={section.heading}
          className="m-section-links__heading"
        />

        {section.intro ? (
          <p className="m-section-links__text">{section.intro}</p>
        ) : null}

        <p className="m-section-links__action">{section.link.text}</p>
      </div>
    </a>
  </article>
);

export const SectionLinksBlockTemplate = ({
  block,
}: SectionLinksBlockTemplateProps) => (
  <section className="m-section-links l-content">
    <div className="m-section-links__grid">
      {block.sections.map((section, index) => (
        <SectionLinksItemTemplate
          key={`section-link:${index}`}
          section={section}
        />
      ))}
    </div>
  </section>
);
