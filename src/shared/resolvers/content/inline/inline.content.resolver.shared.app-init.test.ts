// src/shared/resolvers/content/inline/inline.content.resolver.shared.app-init.test.ts

import { resolveTextInlineContentAppInit } from "./text/text.inline.content.resolver.shared.app-init";
import { resolveLinkInlineContentAppInit } from "./link/link.inline.content.resolver.shared.app-init";

import { resolveInlineContentAppInit } from "./inline.content.resolver.shared.app-init";

jest.mock("./text/text.inline.content.resolver.shared.app-init", () => ({
  resolveTextInlineContentAppInit: jest.fn(),
}));

jest.mock("./link/link.inline.content.resolver.shared.app-init", () => ({
  resolveLinkInlineContentAppInit: jest.fn(),
}));

const mockedTextResolver = jest.mocked(resolveTextInlineContentAppInit);
const mockedLinkResolver = jest.mocked(resolveLinkInlineContentAppInit);

type Input = Parameters<typeof resolveInlineContentAppInit>[0];
type AuthoredInline = Input["authored"];
type ResolvedInline = ReturnType<typeof resolveInlineContentAppInit>;

describe("Inline content AppInit dispatcher", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];

  const createInline = (kind: AuthoredInline["kind"]): AuthoredInline =>
    ({
      kind,
    }) as unknown as AuthoredInline;

  const resolve = (authored: AuthoredInline) =>
    resolveInlineContentAppInit({
      authored,
      svgAssets,
      socialProfiles,
    });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Text dispatch", () => {
    it("dispatches text content to the text resolver", () => {
      const authored = createInline("text");

      const resolved = {
        kind: "text",
        value: "Epping Forest",
      } as unknown as ResolvedInline;

      mockedTextResolver.mockReturnValue(
        resolved as ReturnType<typeof resolveTextInlineContentAppInit>,
      );

      expect(resolve(authored)).toBe(resolved);

      expect(mockedTextResolver).toHaveBeenCalledWith(authored);
      expect(mockedTextResolver).toHaveBeenCalledTimes(1);

      expect(mockedLinkResolver).not.toHaveBeenCalled();
    });

    it("does not forward unrelated dependencies to the text resolver", () => {
      const authored = createInline("text");

      resolve(authored);

      expect(mockedTextResolver.mock.calls[0]).toEqual([authored]);
    });

    it("propagates text resolution failures", () => {
      const error = new Error("Text resolution failed");

      mockedTextResolver.mockImplementation(() => {
        throw error;
      });

      expect(() => resolve(createInline("text"))).toThrow(error);

      expect(mockedLinkResolver).not.toHaveBeenCalled();
    });
  });

  describe("Link dispatch", () => {
    it("dispatches links with all required dependencies", () => {
      const authored = createInline("link");

      const resolved = {
        kind: "link",
      } as unknown as ResolvedInline;

      mockedLinkResolver.mockReturnValue(
        resolved as ReturnType<typeof resolveLinkInlineContentAppInit>,
      );

      expect(resolve(authored)).toBe(resolved);

      expect(mockedLinkResolver).toHaveBeenCalledWith({
        authored,
        svgAssets,
        socialProfiles,
      });

      expect(mockedLinkResolver).toHaveBeenCalledTimes(1);
      expect(mockedTextResolver).not.toHaveBeenCalled();
    });

    it("preserves dependency references", () => {
      const authored = createInline("link");

      resolve(authored);

      const input = mockedLinkResolver.mock.calls[0]?.[0];

      expect(input?.authored).toBe(authored);
      expect(input?.svgAssets).toBe(svgAssets);
      expect(input?.socialProfiles).toBe(socialProfiles);
    });

    it("propagates link resolution failures", () => {
      const error = new Error("Link resolution failed");

      mockedLinkResolver.mockImplementation(() => {
        throw error;
      });

      expect(() => resolve(createInline("link"))).toThrow(error);

      expect(mockedTextResolver).not.toHaveBeenCalled();
    });
  });

  describe("Unsupported inline kinds", () => {
    it("rejects unsupported inline content", () => {
      const authored = {
        kind: "unknown",
      } as unknown as AuthoredInline;

      expect(() => resolve(authored)).toThrow(
        "Unsupported inline kind: unknown",
      );

      expect(mockedTextResolver).not.toHaveBeenCalled();
      expect(mockedLinkResolver).not.toHaveBeenCalled();
    });

    it("rejects an undefined kind", () => {
      const authored = {} as AuthoredInline;

      expect(() => resolve(authored)).toThrow(
        "Unsupported inline kind: undefined",
      );
    });

    it("does not resolve unsupported content", () => {
      const authored = {
        kind: "unsupported",
      } as unknown as AuthoredInline;

      expect(() => resolve(authored)).toThrow();

      expect(mockedTextResolver).not.toHaveBeenCalled();
      expect(mockedLinkResolver).not.toHaveBeenCalled();
    });
  });

  describe("Resolver isolation", () => {
    it("selects only the resolver matching the inline kind", () => {
      resolve(createInline("text"));

      expect(mockedTextResolver).toHaveBeenCalledTimes(1);
      expect(mockedLinkResolver).not.toHaveBeenCalled();

      jest.clearAllMocks();

      resolve(createInline("link"));

      expect(mockedLinkResolver).toHaveBeenCalledTimes(1);
      expect(mockedTextResolver).not.toHaveBeenCalled();
    });
  });
});
