// packages/content-cli/src/cli/parse-args.cli.test.ts

import { parseCliArgs } from "@content-cli/cli/parse-args.cli";

describe("parseCliArgs", () => {
  it.each([
    { args: ["--env", "dev"], expected: { mode: "interactive", env: "dev" } },
    { args: [], expected: { mode: "interactive", env: "prod" } },
  ])("parses interactive mode %#", ({ args, expected }) => {
    expect(parseCliArgs(args)).toEqual(expected);
  });

  it.each([
    {
      args: [
        "journal",
        "publish",
        "--env",
        "stg",
        "--bucket",
        "edits",
        "--slug",
        "my-entry",
      ],
      expected: {
        mode: "direct",
        env: "stg",
        entity: "journal",
        action: "publish",
        bucket: "edits",
        slug: "my-entry",
        from: undefined,
        to: undefined,
      },
    },
    {
      args: ["journal", "validate"],
      expected: {
        mode: "direct",
        entity: "journal",
        action: "validate",
        bucket: "drafts",
      },
    },
    {
      args: ["journal", "promote", "--from", "dev", "--to", "stg"],
      expected: {
        mode: "direct",
        entity: "journal",
        action: "promote",
        from: "dev",
        to: "stg",
      },
    },
  ])("parses journal commands %#", ({ args, expected }) => {
    expect(parseCliArgs(args)).toMatchObject(expected);
  });

  it.each([
    {
      args: [
        "photo",
        "publish",
        "--bucket",
        "uploaded",
        "--photo-id",
        "abc123",
      ],
      expected: {
        mode: "direct",
        entity: "photo",
        action: "publish",
        bucket: "uploaded",
        photoId: "abc123",
      },
    },
    {
      args: ["photo", "validate"],
      expected: {
        mode: "direct",
        entity: "photo",
        action: "validate",
        bucket: "drafts",
      },
    },
    {
      args: ["photo", "homepageStripRebuild"],
      expected: {
        mode: "direct",
        env: "prod",
        entity: "photo",
        action: "homepageStripRebuild",
      },
    },
  ])("parses photo commands %#", ({ args, expected }) => {
    expect(parseCliArgs(args)).toMatchObject(expected);
  });

  it.each([
    {
      args: ["article", "publish"],
      error: /Invalid CLI command: entity="article" action="publish"/,
    },
    {
      args: ["journal", "homepageStripRebuild"],
      error:
        /Invalid CLI command: entity="journal" action="homepageStripRebuild"/,
    },
    {
      args: ["photo", "nonexistent-action"],
      error: /Invalid CLI command: entity="photo" action="nonexistent-action"/,
    },
  ])("throws for invalid commands %#", ({ args, error }) => {
    expect(() => parseCliArgs(args)).toThrow(error);
  });
});
