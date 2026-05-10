// packages/content-cli/src/cli/interactive/format.interactive.cli.test.ts

import { formatEnvironment } from "@content-cli/cli/interactive/format.interactive.cli";

describe("formatEnvironment", () => {
  it("returns 🚨 PROD for prod environment", () => {
    expect(formatEnvironment("prod")).toBe("🚨 PROD");
  });

  it("returns uppercase string for dev environment", () => {
    expect(formatEnvironment("dev")).toBe("DEV");
  });

  it("returns uppercase string for stg environment", () => {
    expect(formatEnvironment("stg")).toBe("STG");
  });
});
