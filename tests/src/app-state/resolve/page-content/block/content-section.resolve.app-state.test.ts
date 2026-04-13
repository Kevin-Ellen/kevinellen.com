// tests/src/app-state/resolve/page-content/block/content-section.resolve.app-state.test.ts

jest.mock(
  "@app-state/resolve/page-content/block/block.page-content.resolve.app-state",
  () => ({
    appStateResolveBlockContentModule: jest.fn(),
  }),
);

import { appStateResolveBlockContentModule } from "@app-state/resolve/page-content/block/block.page-content.resolve.app-state";
import {
  appStateResolveContentSectionHeadingBlockContentModule,
  appStateResolveContentSectionBlockContentModule,
} from "@app-state/resolve/page-content/block/content-section.resolve.app-state";

import type {
  AuthoredContentSectionHeadingBlockContentModule,
  AuthoredContentSectionBlockContentModule,
} from "@shared-types/page-content/block/content-section/authored.content-section.block.page-content.types";
import type {
  AppStateContentSectionHeadingBlockContentModule,
  AppStateContentSectionBlockContentModule,
} from "@shared-types/page-content/block/content-section/app-state.content-section.block.page-content.types";

const mockedAppStateResolveBlockContentModule =
  appStateResolveBlockContentModule as jest.MockedFunction<
    typeof appStateResolveBlockContentModule
  >;

describe("content-section AppState resolvers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("appStateResolveContentSectionHeadingBlockContentModule", () => {
    it("defaults visuallyHidden to false when omitted", () => {
      const heading: AuthoredContentSectionHeadingBlockContentModule = {
        text: "Section heading",
        level: 2,
      };

      const result =
        appStateResolveContentSectionHeadingBlockContentModule(heading);

      const expected: AppStateContentSectionHeadingBlockContentModule = {
        text: "Section heading",
        level: 2,
        visuallyHidden: false,
      };

      expect(result).toEqual(expected);
    });

    it("preserves visuallyHidden when provided", () => {
      const heading: AuthoredContentSectionHeadingBlockContentModule = {
        text: "Accessible heading",
        level: 3,
        visuallyHidden: true,
      };

      const result =
        appStateResolveContentSectionHeadingBlockContentModule(heading);

      const expected: AppStateContentSectionHeadingBlockContentModule = {
        text: "Accessible heading",
        level: 3,
        visuallyHidden: true,
      };

      expect(result).toEqual(expected);
    });
  });

  describe("appStateResolveContentSectionBlockContentModule", () => {
    it("defaults heading to null when omitted", () => {
      const module: AuthoredContentSectionBlockContentModule = {
        kind: "contentSection",
        modules: [],
      };

      const result = appStateResolveContentSectionBlockContentModule(module);

      const expected: AppStateContentSectionBlockContentModule = {
        kind: "contentSection",
        heading: null,
        modules: [],
      };

      expect(result).toEqual(expected);
      expect(mockedAppStateResolveBlockContentModule).not.toHaveBeenCalled();
    });

    it("resolves heading with deterministic visuallyHidden defaulting", () => {
      const module: AuthoredContentSectionBlockContentModule = {
        kind: "contentSection",
        heading: {
          text: "Section heading",
          level: 2,
        },
        modules: [],
      };

      const result = appStateResolveContentSectionBlockContentModule(module);

      expect(result.heading).toEqual({
        text: "Section heading",
        level: 2,
        visuallyHidden: false,
      });
    });

    it("maps nested modules through the shared block resolver", () => {
      const firstModule = { kind: "paragraph" } as never;
      const secondModule = { kind: "quote" } as never;

      const module: AuthoredContentSectionBlockContentModule = {
        kind: "contentSection",
        modules: [firstModule, secondModule],
      };

      const resolvedFirstModule = { kind: "resolved-paragraph" } as never;
      const resolvedSecondModule = { kind: "resolved-quote" } as never;

      mockedAppStateResolveBlockContentModule
        .mockReturnValueOnce(resolvedFirstModule)
        .mockReturnValueOnce(resolvedSecondModule);

      const result = appStateResolveContentSectionBlockContentModule(module);

      expect(mockedAppStateResolveBlockContentModule).toHaveBeenCalledTimes(2);
      expect(mockedAppStateResolveBlockContentModule.mock.calls[0]?.[0]).toBe(
        firstModule,
      );
      expect(mockedAppStateResolveBlockContentModule.mock.calls[1]?.[0]).toBe(
        secondModule,
      );

      expect(result.modules).toEqual([
        resolvedFirstModule,
        resolvedSecondModule,
      ]);
    });

    it("preserves nested module ordering after resolution", () => {
      const firstModule = { kind: "paragraph" } as never;
      const secondModule = { kind: "quote" } as never;

      const module: AuthoredContentSectionBlockContentModule = {
        kind: "contentSection",
        modules: [firstModule, secondModule],
      };

      const resolvedFirst = { kind: "resolved-first" } as never;
      const resolvedSecond = { kind: "resolved-second" } as never;

      mockedAppStateResolveBlockContentModule
        .mockReturnValueOnce(resolvedFirst)
        .mockReturnValueOnce(resolvedSecond);

      const result = appStateResolveContentSectionBlockContentModule(module);

      expect(result.modules).toEqual([resolvedFirst, resolvedSecond]);
    });

    it("returns the expected AppState content section shape", () => {
      const childModule = { kind: "paragraph" } as never;

      const module: AuthoredContentSectionBlockContentModule = {
        kind: "contentSection",
        heading: {
          text: "Section heading",
          level: 3,
          visuallyHidden: true,
        },
        modules: [childModule],
      };

      const resolvedChildModule = { kind: "resolved-child" } as never;

      mockedAppStateResolveBlockContentModule.mockReturnValue(
        resolvedChildModule,
      );

      const result = appStateResolveContentSectionBlockContentModule(module);

      const expected: AppStateContentSectionBlockContentModule = {
        kind: "contentSection",
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
