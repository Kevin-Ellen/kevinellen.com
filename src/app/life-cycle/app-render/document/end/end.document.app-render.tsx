// src/app/life-cycle/app-render/document/end/end.document.app-render.tsx

import type { EndDocumentAppRenderContext } from "../../../../types/document/end.document.app-render-context.type";
import type { MetadataAppRenderContext } from "../../../../types/document/metadata.document.app-render-context.type";

type Props = Readonly<{
  end: EndDocumentAppRenderContext;
  metadata: MetadataAppRenderContext;
}>;

export const DocumentEnd = ({ end, metadata }: Props) => (
  <>
    {end.scripts.map((script) =>
      script.kind === "inline" ? (
        <script
          key={script.id}
          type={script.scriptType}
          nonce={metadata.nonce}
          dangerouslySetInnerHTML={{
            __html: script.content.replace(/<\/script/gi, "<\\/script"),
          }}
        />
      ) : (
        <script
          key={script.id}
          type={script.scriptType}
          src={script.src}
          defer={script.loading === "defer"}
          async={script.loading === "async"}
        />
      ),
    )}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="u-hidden-svg-sprite"
    >
      <defs>
        {end.svg.map((svg) => (
          <symbol
            key={svg.id}
            id={svg.id}
            viewBox={svg.viewBox}
            dangerouslySetInnerHTML={{ __html: svg.content }}
          />
        ))}
      </defs>
    </svg>
  </>
);
