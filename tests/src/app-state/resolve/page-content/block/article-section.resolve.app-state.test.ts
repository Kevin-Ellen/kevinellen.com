// tests/src/app-state/resolve/page-content/block/article-section.resolve.app-state.test.ts

jest.mock(
  "@app-state/resolve/page-content/block/block.page-content.resolve.app-state",
  () => ({
    appStateResolveBlockContentModule: jest.fn(),
  }),
);

import { appStateResolveBlockContentModule } from "@app-state/resolve/page-content/block/block.page-content.resolve.app-state";
import {
  appStateResolveArticleSectionBlockContentModule,
  appStateResolveArticleSectionHeadingBlockContentModule,
} from "@app-state/resolve/page-content/block/article-section.resolve.app-state";

import type {
  AuthoredArticleSectionBlockContentModule,
  AuthoredArticleSectionHeadingBlockContentModule,
} from "@shared-types/page-content/block/article-section/authored.article-section.block.page-content.types";
import type {
  AppStateArticleSectionBlockContentModule,
  AppStateArticleSectionHeadingBlockContentModule,
} from "@shared-types/page-content/block/article-section/app-state.article-section.block.page-content.types";

const mockedAppStateResolveBlockContentModule = jest.mocked(
  appStateResolveBlockContentModule,
);

describe("article-section AppState resolvers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("appStateResolveArticleSectionHeadingBlockContentModule", () => {
    it("defaults visuallyHidden to false when omitted", () => {
      const heading: AuthoredArticleSectionHeadingBlockContentModule = {
        text: "Section heading",
        level: 2,
      };

      const result =
        appStateResolveArticleSectionHeadingBlockContentModule(heading);

      const expected: AppStateArticleSectionHeadingBlockContentModule = {
        text: "Section heading",
        level: 2,
        visuallyHidden: false,
      };

      expect(result).toEqual(expected);
    });

    it("preserves visuallyHidden when provided", () => {
      const heading: AuthoredArticleSectionHeadingBlockContentModule = {
        text: "Accessible heading",
        level: 3,
        visuallyHidden: true,
      };

      const result =
        appStateResolveArticleSectionHeadingBlockContentModule(heading);

      const expected: AppStateArticleSectionHeadingBlockContentModule = {
        text: "Accessible heading",
        level: 3,
        visuallyHidden: true,
      };

      expect(result).toEqual(expected);
    });
  });

  describe("appStateResolveArticleSectionBlockContentModule", () => {
    it("resolves heading with deterministic visuallyHidden defaulting", () => {
      const module: AuthoredArticleSectionBlockContentModule = {
        kind: "articleSection",
        heading: {
          text: "Section heading",
          level: 2,
        },
        modules: [],
      };

      const result = appStateResolveArticleSectionBlockContentModule(module);

      expect(result.heading).toEqual({
        text: "Section heading",
        level: 2,
        visuallyHidden: false,
      });
    });

    it("maps nested modules through the shared block resolver", () => {
      const firstModule = { kind: "paragraph", content: [] } as never;
      const secondModule = {
        kind: "quote",
        id: "quote-1",
        text: "Quote",
      } as never;

      const module: AuthoredArticleSectionBlockContentModule = {
        kind: "articleSection",
        heading: {
          text: "Section heading",
          level: 2,
        },
        modules: [firstModule, secondModule],
      };

      const resolvedFirstModule = {
        kind: "paragraph",
        flow: "content",
        content: [],
      } as never;

      const resolvedSecondModule = {
        kind: "quote",
        id: "quote-1",
        text: "Quote",
        attribution: null,
        flow: "content",
      } as never;

      mockedAppStateResolveBlockContentModule
        .mockReturnValueOnce(resolvedFirstModule)
        .mockReturnValueOnce(resolvedSecondModule);

      const result = appStateResolveArticleSectionBlockContentModule(module);

      expect(mockedAppStateResolveBlockContentModule).toHaveBeenCalledTimes(2);
      expect(mockedAppStateResolveBlockContentModule).toHaveBeenNthCalledWith(
        1,
        firstModule,
      );
      expect(mockedAppStateResolveBlockContentModule).toHaveBeenNthCalledWith(
        2,
        secondModule,
      );

      expect(result.modules).toEqual([
        resolvedFirstModule,
        resolvedSecondModule,
      ]);
    });

    it("preserves nested module ordering after resolution", () => {
      const firstModule = { kind: "paragraph", content: [] } as never;
      const secondModule = {
        kind: "quote",
        id: "quote-1",
        text: "Quote",
      } as never;

      const module: AuthoredArticleSectionBlockContentModule = {
        kind: "articleSection",
        heading: {
          text: "Section heading",
          level: 2,
        },
        modules: [firstModule, secondModule],
      };

      const resolvedFirstModule = {
        kind: "paragraph",
        flow: "content",
        content: [],
      } as never;

      const resolvedSecondModule = {
        kind: "quote",
        id: "quote-1",
        text: "Quote",
        attribution: null,
        flow: "content",
      } as never;

      mockedAppStateResolveBlockContentModule
        .mockReturnValueOnce(resolvedFirstModule)
        .mockReturnValueOnce(resolvedSecondModule);

      const result = appStateResolveArticleSectionBlockContentModule(module);

      expect(result.modules).toEqual([
        resolvedFirstModule,
        resolvedSecondModule,
      ]);
    });

    it("returns the expected AppState article section shape", () => {
      const childModule = { kind: "paragraph", content: [] } as never;

      const module: AuthoredArticleSectionBlockContentModule = {
        kind: "articleSection",
        heading: {
          text: "Section heading",
          level: 3,
          visuallyHidden: true,
        },
        modules: [childModule],
      };

      const resolvedChildModule = {
        kind: "paragraph",
        flow: "content",
        content: [],
      } as never;

      mockedAppStateResolveBlockContentModule.mockReturnValue(
        resolvedChildModule,
      );

      const result = appStateResolveArticleSectionBlockContentModule(module);

      const expected: AppStateArticleSectionBlockContentModule = {
        kind: "articleSection",
        heading: {
          text: "Section heading",
          level: 3,
          visuallyHidden: true,
        },
        modules: [resolvedChildModule],
      };

      expect(result).toEqual(expected);
    });
  });
});
