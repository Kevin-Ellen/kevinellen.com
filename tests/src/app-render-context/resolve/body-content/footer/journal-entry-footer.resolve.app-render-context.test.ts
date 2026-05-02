// tests/src/app-render-context/resolve/body-content/footer/journal-entry-footer.resolve.app-render-context.test.ts

import { resolveJournalEntryFooterAppRenderContext } from "@app-render-context/resolve/body-content/footer/journal-entry-footer.resolve.app-render-context";

describe("resolveJournalEntryFooterAppRenderContext", () => {
  it("formats publishedAt and updatedAt dates", () => {
    const module = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2025-05-27T10:30:00.000Z",
        updatedAt: ["2025-05-28T10:30:00.000Z", "2025-05-29T10:30:00.000Z"],
      },
      tags: ["Mallorca", "Birds"],
      equipment: {
        cameras: ["Canon EOS R7"],
        lenses: ["RF100-500mm F4.5-7.1 L IS USM"],
      },
    } as const;

    expect(
      resolveJournalEntryFooterAppRenderContext({} as never, module as never),
    ).toEqual({
      ...module,
      publication: {
        ...module.publication,
        publishedAt: "27 May 2025",
        updatedAt: ["28 May 2025", "29 May 2025"],
      },
    });
  });

  it("keeps publication author, tags, and equipment unchanged", () => {
    const module = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2025-05-27T10:30:00.000Z",
        updatedAt: [],
      },
      tags: ["Coots"],
      equipment: {
        cameras: ["Canon EOS R7"],
        lenses: [],
      },
    } as const;

    const result = resolveJournalEntryFooterAppRenderContext(
      {} as never,
      module as never,
    );

    expect(result.publication.author).toBe(module.publication.author);
    expect(result.tags).toBe(module.tags);
    expect(result.equipment).toBe(module.equipment);
  });

  it("throws when publishedAt cannot be formatted", () => {
    const module = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "not-a-date",
        updatedAt: [],
      },
      tags: [],
      equipment: {
        cameras: [],
        lenses: [],
      },
    };

    expect(() =>
      resolveJournalEntryFooterAppRenderContext({} as never, module as never),
    ).toThrow('Invalid date value: "not-a-date"');
  });

  it("throws when an updatedAt value cannot be formatted", () => {
    const module = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2025-05-27T10:30:00.000Z",
        updatedAt: ["not-a-date"],
      },
      tags: [],
      equipment: {
        cameras: [],
        lenses: [],
      },
    };

    expect(() =>
      resolveJournalEntryFooterAppRenderContext({} as never, module as never),
    ).toThrow('Invalid date value: "not-a-date"');
  });
});
