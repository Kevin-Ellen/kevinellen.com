// src/rendering/doc-head/social-preview.doc-head.template.tsx

import type { AppRenderContextSocialPreview } from "@shared-types/page-definitions/social-preview/app-render-context.social-preview.page-definition.types";

type SocialMetaProps = Readonly<{
  socialPreview: AppRenderContextSocialPreview | null;
}>;

export const SocialMeta = ({ socialPreview }: SocialMetaProps) => {
  if (!socialPreview) return null;

  return (
    <>
      <meta property="og:type" content={socialPreview.openGraphType} />
      <meta property="og:title" content={socialPreview.title} />
      <meta property="og:description" content={socialPreview.description} />

      {socialPreview.url ? (
        <meta property="og:url" content={socialPreview.url} />
      ) : null}

      {socialPreview.image ? (
        <meta property="og:image" content={socialPreview.image} />
      ) : null}

      <meta name="twitter:card" content={socialPreview.twitterCard} />
      <meta name="twitter:title" content={socialPreview.title} />
      <meta name="twitter:description" content={socialPreview.description} />

      {socialPreview.image ? (
        <meta name="twitter:image" content={socialPreview.image} />
      ) : null}
    </>
  );
};
