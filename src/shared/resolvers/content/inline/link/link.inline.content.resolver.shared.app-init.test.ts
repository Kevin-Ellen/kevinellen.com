// src/shared/resolvers/content/inline/link/link.inline.content.resolver.shared.app-init.test.ts

import type { LinkInlineContentAuthored } from "../../../../../content-schema/content/inline/link.inline.content.content-schema.authored.type";

import { resolveLinkAppInit } from "../../primitives/link/link.primitive.content.resolver.shared.app-init";

import { resolveLinkInlineContentAppInit } from "./link.inline.content.resolver.shared.app-init";

jest.mock(
  "../../primitives/link/link.primitive.content.resolver.shared.app-init",
  () => ({
    resolveLinkAppInit: jest.fn(),
  }),
);

const mockedLinkResolver = jest.mocked(resolveLinkAppInit);

type Input = Parameters<typeof resolveLinkInlineContentAppInit>[0];
type AuthoredLink = Input["authored"]["link"];
type ResolvedLink = ReturnType<typeof resolveLinkAppInit>;

describe("Link inline content AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];

  const authoredLink = {
    href: "/journals",
  } as unknown as AuthoredLink;

  const createAuthored = (
    overrides: Record<string, unknown> = {},
  ): LinkInlineContentAuthored =>
    ({
      kind: "link",
      link: authoredLink,
      ...overrides,
    }) as unknown as LinkInlineContentAuthored;

  const resolve = (authored: Input["authored"]) =>
    resolveLinkInlineContentAppInit({
      authored,
      svgAssets,
      socialProfiles,
    });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("passes the authored link and dependencies to the link resolver", () => {
    const authored = createAuthored();

    resolve(authored);

    expect(mockedLinkResolver).toHaveBeenCalledWith({
      authored: authoredLink,
      svgAssets,
      socialProfiles,
    });

    expect(mockedLinkResolver).toHaveBeenCalledTimes(1);
  });

  it("replaces the authored link with the resolved link", () => {
    const resolvedLink = {
      href: "/journals",
      target: "_self",
    } as unknown as ResolvedLink;

    mockedLinkResolver.mockReturnValue(resolvedLink);

    const result = resolve(createAuthored());

    expect(result.link).toBe(resolvedLink);
  });

  it("preserves other authored properties", () => {
    const authored = createAuthored({
      label: "Read the journal",
      identifier: "journal-link",
    });

    const result = resolve(authored);

    expect(result).toMatchObject({
      kind: "link",
      label: "Read the journal",
      identifier: "journal-link",
    });
  });

  it("returns a new inline component object", () => {
    const authored = createAuthored();

    const result = resolve(authored);

    expect(result).not.toBe(authored);
  });

  it("does not mutate the authored link", () => {
    const authored = createAuthored();
    const original = { ...authored };

    const resolvedLink = {
      href: "/resolved-journals",
    } as unknown as ResolvedLink;

    mockedLinkResolver.mockReturnValue(resolvedLink);

    resolve(authored);

    expect(authored).toEqual(original);
    expect(authored.link).toBe(authoredLink);
  });

  it("preserves unrelated nested references", () => {
    const metadata = {
      category: "navigation",
    };

    const authored = createAuthored({ metadata });

    const result = resolve(authored) as unknown as {
      metadata: typeof metadata;
    };

    expect(result.metadata).toBe(metadata);
  });

  it("propagates link resolution failures", () => {
    const error = new Error("Invalid link reference");

    mockedLinkResolver.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve(createAuthored())).toThrow(error);

    expect(mockedLinkResolver).toHaveBeenCalledTimes(1);
  });

  it("returns a fresh object on every invocation", () => {
    const authored = createAuthored();

    const first = resolve(authored);
    const second = resolve(authored);

    expect(first).not.toBe(second);
  });
});
