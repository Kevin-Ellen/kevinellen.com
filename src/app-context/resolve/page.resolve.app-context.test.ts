// src/app-context/resolve/page.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { RoutingResult } from "@request/types/request.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

import { appContextResolvePage } from "@app-context/resolve/page.resolve.app-context";

import { appContextResolvePageContent } from "@app-context/resolve/page-content/content.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/content.resolve.app-context",
  () => ({
    appContextResolvePageContent: jest.fn(),
  }),
);

describe("appContextResolvePage", () => {
  const mockedAppContextResolvePageContent = jest.mocked(
    appContextResolvePageContent,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves an AppContext page definition", () => {
    const context = {} as AppContextPageContentResolverContext;

    const routing = {
      kind: "found",
      publicPageId: "journal",
      pagination: null,
    } as RoutingResult;

    const page = {
      id: "journal",
      kind: "listing",
      slug: "/journal",
      label: "Journal",
      status: null,
      content: {
        head: {
          title: "Journal",
          eyebrow: null,
          intro: null,
          showInBody: true,
        },
        content: [],
        footer: [],
      },
    } as unknown as AppStatePageDefinition;

    const resolvedContent = {
      head: {
        title: "Resolved Journal",
        eyebrow: null,
        intro: null,
        showInBody: true,
      },
      content: [],
      footer: [],
    };

    mockedAppContextResolvePageContent.mockReturnValue(
      resolvedContent as never,
    );

    const result = appContextResolvePage(page, routing, context);

    expect(result).toEqual({
      id: "journal",
      kind: "listing",
      slug: "/journal",
      label: "Journal",
      status: null,
      content: resolvedContent,
    });

    expect(mockedAppContextResolvePageContent).toHaveBeenCalledTimes(1);
    expect(mockedAppContextResolvePageContent).toHaveBeenCalledWith(
      page.content,
      context,
    );
  });
});
