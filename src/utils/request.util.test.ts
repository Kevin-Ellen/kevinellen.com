// src/app/request/request.util.test.ts

import { getRequestPath } from "./request.util";

describe("getRequestPath", () => {
  it("returns the root path unchanged", () => {
    const req = new Request("https://example.com/");

    expect(getRequestPath(req)).toBe("/");
  });

  it("removes trailing slashes", () => {
    const req = new Request("https://example.com/journal/");

    expect(getRequestPath(req)).toBe("/journal");
  });

  it("preserves paths without trailing slashes", () => {
    const req = new Request("https://example.com/journal");

    expect(getRequestPath(req)).toBe("/journal");
  });

  it("normalises paths to lowercase", () => {
    const req = new Request("https://example.com/JOURNAL/Latest");

    expect(getRequestPath(req)).toBe("/journal/latest");
  });

  it("handles nested paths with trailing slashes", () => {
    const req = new Request("https://example.com/JOURNAL/Page-2/");

    expect(getRequestPath(req)).toBe("/journal/page-2");
  });

  it("ignores query strings", () => {
    const req = new Request("https://example.com/journal/?page=2");

    expect(getRequestPath(req)).toBe("/journal");
  });
});
