// src/app/life-cycle/app-render/document/page/page.document.app-render.tsx

import type { PageDocumentAppRenderContext } from "../../../../types/document/page/page.document.app-render-context.type";
import type { ContentPageType } from "../../../../../content-schema/content/content.content-schema.type";

import { PageHeader } from "./header/header.page.document.app-render";
import { PageFooter } from "./footer/footer.page.document.app-render";
import { ContentBody } from "./body/body.page.document.app-render";
import { Breadcrumbs } from "./body/breadcrumbs/breadcrumbs.body.page.document.app-render";

const pageElementRegistry = {
  standard: null,
  journalEntry: "article",
} as const satisfies Record<ContentPageType, "article" | "section" | null>;

type Props = Readonly<{
  page: PageDocumentAppRenderContext;
}>;

export const Page = ({ page }: Props) => {
  const Element = pageElementRegistry[page.pageType];

  const content = <ContentBody body={page.body} />;

  return (
    <>
      <PageHeader header={page.header} />
      <main id="main-content">
        {page.breadcrumbs.length > 1 && (
          <Breadcrumbs breadcrumbs={page.breadcrumbs} />
        )}

        {Element ? <Element>{content}</Element> : content}
      </main>
      <PageFooter footer={page.footer} />
    </>
  );
};
