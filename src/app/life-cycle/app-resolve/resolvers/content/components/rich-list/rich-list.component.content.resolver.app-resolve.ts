// src/app/life-cycle/app-resolve/resolvers/content/components/rich-list/rich-list.component.content.resolver.app-resolve.ts

import type { RichListComponentContentAppInit } from "../../../../../../../shared/types/content/components/rich-list.component.content.shared.app-init.type";
import type { RichListComponentContentAppResolve } from "../../../../../../types/document/page/content/components/rich-list/rich-list.component.content.page.document.app-resolve.type";

type Input = Readonly<{
  content: RichListComponentContentAppInit;
}>;

export const resolveRichListComponentContentAppResolve = ({
  content,
}: Input): RichListComponentContentAppResolve => ({
  ...content,
});
