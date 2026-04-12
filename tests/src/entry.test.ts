// src/entry.test.ts

import { onRequest, default as entryModule } from "../../src/entry";

jest.mock("@request/request", () => ({
  orchestrateRequest: jest.fn(),
}));

describe("entry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exports fetch as onRequest", () => {
    expect(entryModule.fetch).toBe(onRequest);
  });
});
