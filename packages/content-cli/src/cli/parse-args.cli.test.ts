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
      args: ["photo", "publish", "--bucket", "uploaded", "--slug", "abc123"],
      expected: {
        mode: "direct",
        entity: "photo",
        action: "publish",
        bucket: "uploaded",
        slug: "abc123",
      },
    },
    {
      args: ["photo", "read", "--photo-id", "abc123"],
      expected: {
        mode: "direct",
        entity: "photo",
        action: "read",
        bucket: "drafts",
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
      args: [
        "note",
        "publish",
        "--env",
        "stg",
        "--bucket",
        "edits",
        "--slug",
        "my-note",
      ],
      expected: {
        mode: "direct",
        env: "stg",
        entity: "note",
        action: "publish",
        bucket: "edits",
        slug: "my-note",
        from: undefined,
        to: undefined,
      },
    },
    {
      args: ["note", "validate"],
      expected: {
        mode: "direct",
        entity: "note",
        action: "validate",
        bucket: "drafts",
      },
    },
    {
      args: ["note", "promote", "--from", "dev", "--to", "stg"],
      expected: {
        mode: "direct",
        entity: "note",
        action: "promote",
        from: "dev",
        to: "stg",
      },
    },
  ])("parses note commands %#", ({ args, expected }) => {
    expect(parseCliArgs(args)).toMatchObject(expected);
  });

  it.each([
    {
      args: ["photo", "create"],
      expected: {
        mode: "direct",
        env: "prod",
        entity: "photo",
        action: "create",
        bucket: "drafts",
      },
    },
    {
      args: ["photo", "publish", "--bucket", "uploaded", "--slug", "abc123"],
      expected: {
        mode: "direct",
        entity: "photo",
        action: "publish",
        bucket: "uploaded",
        slug: "abc123",
      },
    },
    {
      args: ["photo", "read", "--photo-id", "abc123"],
      expected: {
        mode: "direct",
        entity: "photo",
        action: "read",
        bucket: "drafts",
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
      args: ["photo", "list"],
      expected: {
        mode: "direct",
        env: "prod",
        entity: "photo",
        action: "list",
        bucket: "drafts",
      },
    },
    {
      args: ["photo", "status"],
      expected: {
        mode: "direct",
        env: "prod",
        entity: "photo",
        action: "status",
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
    {
      args: ["note", "homepageStripRebuild"],
      error: /Invalid CLI command: entity="note" action="homepageStripRebuild"/,
    },
  ])("throws for invalid commands %#", ({ args, error }) => {
    expect(() => parseCliArgs(args)).toThrow(error);
  });
});
