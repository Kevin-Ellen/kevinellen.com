// tests/src/app/appContext/resolvers/content.resolve.appContext.test.ts

import { resolveContentAppContext } from "@app/appContext/resolvers/content.resolve.appContext";
import { createAppState } from "@app/appState/create.appState";

import type { PageContent } from "@shared-types/pages/content/content.page.types";

describe("resolveContentAppContext", () => {
  const appState = createAppState();

  it("passes through text inlines unchanged", () => {
    const content: PageContent = {
      head: {
        eyebrow: "Test",
        title: "Text content",
        intro: "Testing text content resolution.",
      },
      body: [
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "text",
              text: "Hello world.",
            },
          ],
        },
      ],
      footer: ["Footer text."],
    };

    const result = resolveContentAppContext(content, appState);

    expect(result).toEqual({
      head: {
        eyebrow: "Test",
        title: "Text content",
        intro: "Testing text content resolution.",
      },
      body: [
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "text",
              text: "Hello world.",
            },
          ],
        },
      ],
      footer: ["Footer text."],
    });
  });

  it("passes through external-link inlines unchanged", () => {
    const content: PageContent = {
      head: {
        eyebrow: "Test",
        title: "External link content",
        intro: "Testing external link resolution.",
      },
      body: [
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "text",
              text: "Visit ",
            },
            {
              kind: "external-link",
              href: "https://example.com",
              label: "Example",
            },
            {
              kind: "text",
              text: " for more.",
            },
          ],
        },
      ],
      footer: [],
    };

    const result = resolveContentAppContext(content, appState);

    expect(result).toEqual({
      head: {
        eyebrow: "Test",
        title: "External link content",
        intro: "Testing external link resolution.",
      },
      body: [
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "text",
              text: "Visit ",
            },
            {
              kind: "external-link",
              href: "https://example.com",
              label: "Example",
            },
            {
              kind: "text",
              text: " for more.",
            },
          ],
        },
      ],
      footer: [],
    });
  });

  it("resolves internal-link inlines into hrefs", () => {
    const content: PageContent = {
      head: {
        eyebrow: "Test",
        title: "Link content",
        intro: "Testing internal link resolution.",
      },
      body: [
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "text",
              text: "Go back to ",
            },
            {
              kind: "internal-link",
              pageId: "home",
              label: "homepage",
            },
            {
              kind: "text",
              text: ".",
            },
          ],
        },
      ],
      footer: [],
    };

    const result = resolveContentAppContext(content, appState);

    expect(result).toEqual({
      head: {
        eyebrow: "Test",
        title: "Link content",
        intro: "Testing internal link resolution.",
      },
      body: [
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "text",
              text: "Go back to ",
            },
            {
              kind: "internal-link",
              pageId: "home",
              label: "homepage",
              href: "/",
            },
            {
              kind: "text",
              text: ".",
            },
          ],
        },
      ],
      footer: [],
    });
  });

  it("resolves multiple paragraphs in order", () => {
    const content: PageContent = {
      head: {
        eyebrow: "Test",
        title: "Multi paragraph content",
        intro: "Testing paragraph ordering.",
      },
      body: [
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "text",
              text: "First paragraph.",
            },
          ],
        },
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "internal-link",
              pageId: "journal",
              label: "Journal",
            },
          ],
        },
      ],
      footer: ["Footer text."],
    };

    const result = resolveContentAppContext(content, appState);

    expect(result).toEqual({
      head: {
        eyebrow: "Test",
        title: "Multi paragraph content",
        intro: "Testing paragraph ordering.",
      },
      body: [
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "text",
              text: "First paragraph.",
            },
          ],
        },
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "internal-link",
              pageId: "journal",
              label: "Journal",
              href: "/journal",
            },
          ],
        },
      ],
      footer: ["Footer text."],
    });
  });

  it("returns empty body and footer unchanged when content is empty", () => {
    const content: PageContent = {
      head: {
        eyebrow: "Test",
        title: "Empty content",
        intro: "Testing empty content resolution.",
      },
      body: [],
      footer: [],
    };

    const result = resolveContentAppContext(content, appState);

    expect(result).toEqual({
      head: {
        eyebrow: "Test",
        title: "Empty content",
        intro: "Testing empty content resolution.",
      },
      body: [],
      footer: [],
    });
  });

  it("throws when an internal-link page id cannot be resolved", () => {
    const content: PageContent = {
      head: {
        eyebrow: "Test",
        title: "Broken content",
        intro: "Testing invalid page resolution.",
      },
      body: [
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "internal-link",
              pageId: "does-not-exist",
              label: "Broken link",
            },
          ],
        },
      ],
      footer: [],
    };

    expect(() => resolveContentAppContext(content, appState)).toThrow(
      "Missing content page for id: does-not-exist",
    );
  });
});
