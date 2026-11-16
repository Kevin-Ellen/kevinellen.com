// src/app/life-cycle/app-render/document/page/body/journal-navigation/journal-navigation.body.page.document.app-render.tsx

import type { JournalNavigationAppRenderContext } from "../../../../../../types/document/page/content/journal-navigation.content.page.document.app-render-context.type";

type Props = Readonly<{
  navigation: JournalNavigationAppRenderContext | null;
}>;

export const JournalNavigationBodyPageDocumentAppRender = ({
  navigation,
}: Props) => {
  if (!navigation?.previous && !navigation?.next) {
    return null;
  }

  return (
    <nav
      className="c-journal-navigation l-reading"
      aria-label="Journal navigation"
    >
      {navigation.previous && (
        <a
          className="c-journal-navigation__link"
          href={navigation.previous.slug}
          rel="prev"
        >
          <span className="c-journal-navigation__label">
            <span aria-hidden="true">← </span> Previous
          </span>
          <span className="c-journal-navigation__title">
            {navigation.previous.title}
          </span>
        </a>
      )}

      {navigation.next && (
        <a
          className="c-journal-navigation__link"
          href={navigation.next.slug}
          rel="next"
        >
          <span className="c-journal-navigation__label">
            Next <span aria-hidden="true"> →</span>
          </span>
          <span className="c-journal-navigation__title">
            {navigation.next.title}
          </span>
        </a>
      )}
    </nav>
  );
};
