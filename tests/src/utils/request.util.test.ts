// tests/src/app/request/request.util.test.ts

import { getRequestPath } from "@utils/request.util";

describe("getRequestPath", () => {
  const makeRequest = (url: string) => new Request(url, { method: "GET" });

  it("returns '/' for the root path", () => {
    const req = makeRequest("https://example.com/");

    expect(getRequestPath(req)).toBe("/");
  });

  it("removes trailing slash from non-root paths", () => {
    const req = makeRequest("https://example.com/about/");

    expect(getRequestPath(req)).toBe("/about");
  });

  it("keeps path unchanged when there is no trailing slash", () => {
    const req = makeRequest("https://example.com/about");

    expect(getRequestPath(req)).toBe("/about");
  });

  it("enforces lowercase paths", () => {
    const req = makeRequest("https://example.com/About/Team/");

    expect(getRequestPath(req)).toBe("/about/team");
  });

  it("ignores query strings when resolving the path", () => {
    const req = makeRequest("https://example.com/about/?ref=home");

    expect(getRequestPath(req)).toBe("/about");
  });

  it("handles paths with mixed casing and no trailing slash", () => {
    const req = makeRequest("https://example.com/Blog/Post-One");

    expect(getRequestPath(req)).toBe("/blog/post-one");
  });

  it("handles deeply nested paths", () => {
    const req = makeRequest("https://example.com/Journal/2026/April/Entry/");

    expect(getRequestPath(req)).toBe("/journal/2026/april/entry");
  });

  it("does not strip internal slashes", () => {
    const req = makeRequest("https://example.com/a/b/c/");

    expect(getRequestPath(req)).toBe("/a/b/c");
  });
});
