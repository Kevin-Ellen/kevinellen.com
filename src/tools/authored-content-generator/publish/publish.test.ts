// src/tools/authored-content-generator/publish/publish.test.ts

import type { mkdir, readFile, rename } from "node:fs/promises";
import { resolve } from "node:path";
import type { publishPhoto } from "./photo/photo.publish";
import type { publishJournal } from "./journal/journal.publish";
import type { publishJournalLedger } from "./ledger/ledger.publish";
import type { publishWorkspace } from "./publish";
jest.mock("node:process", () => ({
  ...jest.requireActual("node:process"),
  loadEnvFile: jest.fn(),
}));
jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
  mkdir: jest.fn(),
  rename: jest.fn(),
}));
jest.mock("./photo/photo.publish", () => ({ publishPhoto: jest.fn() }));
jest.mock("./journal/journal.publish", () => ({ publishJournal: jest.fn() }));
jest.mock("./ledger/ledger.publish", () => ({
  publishJournalLedger: jest.fn(),
}));
// Capture Wrangler's arguments without starting a subprocess.
const mockWrangler = jest.fn<Promise<string>, [string[]]>();
jest.mock("node:util", () => ({
  ...jest.requireActual("node:util"),
  promisify: jest.fn(() => async (_executable: string, args: string[]) => ({
    stdout: await mockWrangler(args.slice(4)),
    stderr: "",
  })),
}));
type PhotoPublisher = Parameters<typeof publishPhoto>[0]["publisher"];
type JournalPublisher = Parameters<typeof publishJournal>[0]["publisher"];
type PublishWorkspace = typeof publishWorkspace;
type Dependencies = {
  readFile: jest.MockedFunction<typeof readFile>;
  mkdir: jest.MockedFunction<typeof mkdir>;
  rename: jest.MockedFunction<typeof rename>;
  publishPhoto: jest.MockedFunction<typeof publishPhoto>;
  publishJournal: jest.MockedFunction<typeof publishJournal>;
  publishJournalLedger: jest.MockedFunction<typeof publishJournalLedger>;
};
type Loaded = {
  mocks: Dependencies;
  publishWorkspace: PublishWorkspace;
};
describe("content publisher", () => {
  const workspace = "forest-journal";
  const directory = resolve(
    process.cwd(),
    "authored-content",
    "journals",
    workspace,
  );
  const inventoryPath = resolve(
    directory,
    "artifacts",
    "journal.authored.json",
  );
  const destination = resolve(
    process.cwd(),
    "authored-content",
    "uploaded",
    "journals",
    workspace,
  );
  const journal = {
    id: workspace,
    kind: "public",
    pageType: "journalEntry",
    photos: ["fox", "wood-pigeon"],
  };
  const savedArgv = process.argv;
  const savedExitCode = process.exitCode;
  const savedEnv = {
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_IMAGES_API_TOKEN: process.env.CLOUDFLARE_IMAGES_API_TOKEN,
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_API_KEY: process.env.CLOUDFLARE_API_KEY,
    CLOUDFLARE_EMAIL: process.env.CLOUDFLARE_EMAIL,
  };
  let logSpy: jest.SpiedFunction<typeof console.log>;
  let errorSpy: jest.SpiedFunction<typeof console.error>;
  let fetchSpy: jest.SpiedFunction<typeof fetch>;
  beforeEach(() => {
    jest.clearAllMocks();
    mockWrangler.mockReset();
    mockWrangler.mockResolvedValue("[]");
    process.exitCode = 0;
    process.env.CLOUDFLARE_ACCOUNT_ID = "test-account";
    process.env.CLOUDFLARE_IMAGES_API_TOKEN = "test-images-token";
    process.env.CLOUDFLARE_API_TOKEN = "should-not-reach-wrangler";
    process.env.CLOUDFLARE_API_KEY = "should-not-reach-wrangler";
    process.env.CLOUDFLARE_EMAIL = "should-not-reach-wrangler";
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    fetchSpy = jest.spyOn(globalThis, "fetch").mockImplementation(async () => {
      throw new Error("Unexpected network request");
    });
  });
  afterEach(() => {
    process.argv = savedArgv;
    process.exitCode = savedExitCode;
    for (const [name, value] of Object.entries(savedEnv)) {
      if (value === undefined) {
        Reflect.deleteProperty(process.env, name);
      } else {
        process.env[name] = value;
      }
    }
    fetchSpy.mockRestore();
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });
  // publish.ts intentionally runs main() when imported. Wait for its terminal
  // success/error signal before making assertions about the CLI invocation.
  const runCli = async (
    args: string[] = [workspace, "--local"],
    configure?: (mocks: Dependencies) => void,
  ): Promise<Loaded> => {
    process.argv = [process.execPath, "publish.ts", ...args];
    let finish!: () => void;
    const finished = new Promise<void>((resolveFinished) => {
      finish = resolveFinished;
    });
    logSpy.mockImplementation((message: unknown) => {
      if (
        message === "↷ Local publication: workspace retained" ||
        (typeof message === "string" &&
          message.startsWith("✓ Workspace archived:"))
      ) {
        finish();
      }
    });
    errorSpy.mockImplementation(() => finish());
    const state: { loaded?: Loaded } = {};
    await jest.isolateModulesAsync(async () => {
      const fs = jest.mocked(await import("node:fs/promises"));
      const photoModule = jest.mocked(await import("./photo/photo.publish"));
      const journalModule = jest.mocked(
        await import("./journal/journal.publish"),
      );
      const ledgerModule = jest.mocked(await import("./ledger/ledger.publish"));
      const mocks: Dependencies = {
        readFile: fs.readFile,
        mkdir: fs.mkdir,
        rename: fs.rename,
        publishPhoto: photoModule.publishPhoto,
        publishJournal: journalModule.publishJournal,
        publishJournalLedger: ledgerModule.publishJournalLedger,
      };
      mocks.readFile.mockResolvedValue(JSON.stringify(journal));
      mocks.mkdir.mockResolvedValue(undefined);
      mocks.rename.mockResolvedValue(undefined);
      mocks.publishPhoto.mockResolvedValue({ id: "fox" } as Awaited<
        ReturnType<typeof publishPhoto>
      >);
      mocks.publishJournal.mockResolvedValue(undefined);
      mocks.publishJournalLedger.mockResolvedValue(undefined);
      configure?.(mocks);
      const module = await import("./publish");
      state.loaded = { mocks, publishWorkspace: module.publishWorkspace };
      await finished;
    });
    if (!state.loaded) throw new Error("Publisher module did not load");
    return state.loaded;
  };
  const photoAdapter = (mocks: Dependencies): PhotoPublisher => {
    const call = mocks.publishPhoto.mock.calls[0]?.[0];
    if (!call) throw new Error("Missing photo publisher");
    return call.publisher;
  };
  const journalAdapter = (mocks: Dependencies): JournalPublisher => {
    const call = mocks.publishJournal.mock.calls[0]?.[0];
    if (!call) throw new Error("Missing journal publisher");
    return call.publisher;
  };
  describe("CLI argument validation", () => {
    it.each<{ args: string[] }>([
      { args: [] },
      { args: [".", "--local"] },
      { args: ["..", "--local"] },
      { args: ["nested/journal", "--local"] },
      { args: ["../journal", "--local"] },
      { args: ["/tmp/journal", "--local"] },
    ])("rejects invalid workspace $args", async ({ args }) => {
      const { mocks } = await runCli(args);
      expect(errorSpy).toHaveBeenCalledWith(
        new Error("Valid journal workspace argument required"),
      );
      expect(process.exitCode).toBe(1);
      expect(mocks.readFile).not.toHaveBeenCalled();
    });
    it.each<{ args: string[] }>([
      { args: [workspace] },
      { args: [workspace, "--replace-image"] },
      { args: [workspace, "--local", "--remote"] },
      { args: [workspace, "--local", "--local"] },
      { args: [workspace, "--unknown"] },
      { args: [workspace, "--local", "--unknown"] },
    ])("rejects invalid options $args", async ({ args }) => {
      const { mocks } = await runCli(args);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Usage: content:publish"),
        }),
      );
      expect(process.exitCode).toBe(1);
      expect(mocks.publishPhoto).not.toHaveBeenCalled();
    });
    it("parses --replace-image", async () => {
      const { mocks } = await runCli([workspace, "--local", "--replace-image"]);
      expect(mocks.publishPhoto).toHaveBeenCalledWith(
        expect.objectContaining({ photoId: "fox", replaceImage: true }),
      );
    });
    it("passes false when --replace-image is absent", async () => {
      const { mocks } = await runCli();
      expect(mocks.publishPhoto).toHaveBeenCalledWith(
        expect.objectContaining({ photoId: "fox", replaceImage: false }),
      );
    });
  });

  describe("inventory and orchestration", () => {
    it("reads the inventory and publishes photos before journal and ledger", async () => {
      const { mocks } = await runCli();
      expect(mocks.readFile).toHaveBeenCalledWith(inventoryPath, "utf8");
      expect(mocks.publishPhoto).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          directory,
          photoId: "fox",
          replaceImage: false,
        }),
      );
      expect(mocks.publishPhoto).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          directory,
          photoId: "wood-pigeon",
          replaceImage: false,
        }),
      );
      expect(mocks.publishJournal).toHaveBeenCalledWith({
        directory,
        publisher: expect.any(Object),
      });
      expect(mocks.publishJournalLedger).toHaveBeenCalledWith({
        directory,
        mode: "--local",
      });
      expect(mocks.publishPhoto.mock.invocationCallOrder[1]).toBeLessThan(
        mocks.publishJournal.mock.invocationCallOrder[0],
      );
      expect(mocks.publishJournal.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.publishJournalLedger.mock.invocationCallOrder[0],
      );
      expect(logSpy).toHaveBeenCalledWith(
        "✓ Publication complete: forest-journal",
      );
      expect(errorSpy).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(0);
    });
    it("uses the direct publishWorkspace default for replaceImage", async () => {
      const { mocks, publishWorkspace: directPublish } = await runCli();
      mocks.publishPhoto.mockClear();
      mocks.publishJournal.mockClear();
      mocks.publishJournalLedger.mockClear();
      await directPublish({ directory, mode: "--local" });
      expect(mocks.publishPhoto).toHaveBeenCalledWith(
        expect.objectContaining({ photoId: "fox", replaceImage: false }),
      );
    });
    it.each([
      { kind: "private", pageType: "journalEntry" },
      { kind: "public", pageType: "page" },
    ])("rejects non-public or non-journal inventory %#", async (fields) => {
      const { mocks } = await runCli(undefined, ({ readFile }) => {
        readFile.mockResolvedValue(JSON.stringify({ ...journal, ...fields }));
      });
      expect(errorSpy).toHaveBeenCalledWith(
        new Error("Expected a validated public journal entry"),
      );
      expect(mocks.publishPhoto).not.toHaveBeenCalled();
    });
    it.each([
      ["null", null],
      ["array", []],
      ["string", "invalid"],
      ["missing ID", { ...journal, id: undefined }],
      ["numeric ID", { ...journal, id: 123 }],
      ["empty ID", { ...journal, id: "" }],
    ])("rejects invalid journal identity: %s", async (_scenario, value) => {
      const { mocks } = await runCli(undefined, ({ readFile }) => {
        readFile.mockResolvedValue(JSON.stringify(value));
      });
      expect(errorSpy).toHaveBeenCalledWith(
        new Error("Expected a validated public journal entry"),
      );
      expect(mocks.publishPhoto).not.toHaveBeenCalled();
      expect(mocks.publishJournal).not.toHaveBeenCalled();
      expect(mocks.publishJournalLedger).not.toHaveBeenCalled();
    });

    it.each([undefined, []])(
      "rejects missing or empty photos %#",
      async (photos) => {
        const { mocks } = await runCli(undefined, ({ readFile }) => {
          readFile.mockResolvedValue(JSON.stringify({ ...journal, photos }));
        });
        expect(errorSpy).toHaveBeenCalledWith(
          new Error('Journal "forest-journal" has no photograph inventory'),
        );
        expect(mocks.publishPhoto).not.toHaveBeenCalled();
      },
    );
    it.each([
      ["numeric ID", ["fox", 123]],
      ["null ID", ["fox", null]],
      ["empty ID", ["fox", ""]],
      ["object ID", ["fox", {}]],
      ["non-array inventory", "fox"],
    ])(
      "rejects invalid photograph inventory: %s",
      async (_scenario, photos) => {
        const { mocks } = await runCli(undefined, ({ readFile }) => {
          readFile.mockResolvedValue(JSON.stringify({ ...journal, photos }));
        });
        expect(errorSpy).toHaveBeenCalledWith(
          new Error('Journal "forest-journal" has no photograph inventory'),
        );
        expect(mocks.publishPhoto).not.toHaveBeenCalled();
        expect(mocks.publishJournal).not.toHaveBeenCalled();
      },
    );

    it("rejects duplicate photograph IDs", async () => {
      const { mocks } = await runCli(undefined, ({ readFile }) => {
        readFile.mockResolvedValue(
          JSON.stringify({ ...journal, photos: ["fox", "fox"] }),
        );
      });
      expect(errorSpy).toHaveBeenCalledWith(
        new Error('Journal "forest-journal" contains duplicate photographs'),
      );
      expect(mocks.publishPhoto).not.toHaveBeenCalled();
    });
    it("propagates inventory read failures", async () => {
      const failure = new Error("Cannot read artifact");
      await runCli(undefined, ({ readFile }) =>
        readFile.mockRejectedValue(failure),
      );
      expect(errorSpy).toHaveBeenCalledWith(failure);
    });
    it("rejects malformed inventory JSON", async () => {
      await runCli(undefined, ({ readFile }) =>
        readFile.mockResolvedValue("{bad"),
      );
      expect(errorSpy).toHaveBeenCalledWith(expect.any(SyntaxError));
    });
    it.each([
      "publishPhoto",
      "publishJournal",
      "publishJournalLedger",
    ] as const)("stops on %s failures", async (stage) => {
      const failure = new Error(`${stage} failed`);
      const { mocks } = await runCli(
        [workspace, "--remote"],
        (dependencies) => {
          dependencies[stage].mockRejectedValue(failure);
        },
      );
      expect(errorSpy).toHaveBeenCalledWith(failure);
      expect(process.exitCode).toBe(1);
      expect(mocks.rename).not.toHaveBeenCalled();
      if (stage === "publishPhoto") {
        expect(mocks.publishJournal).not.toHaveBeenCalled();
        expect(mocks.publishJournalLedger).not.toHaveBeenCalled();
      }
      if (stage === "publishJournal") {
        expect(mocks.publishJournalLedger).not.toHaveBeenCalled();
      }
    });
  });

  describe("workspace archiving", () => {
    it("retains local workspaces", async () => {
      const { mocks } = await runCli();
      expect(mocks.mkdir).not.toHaveBeenCalled();
      expect(mocks.rename).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(
        "↷ Local publication: workspace retained",
      );
    });
    it("archives only after successful remote publication", async () => {
      const { mocks } = await runCli([workspace, "--remote"]);
      expect(mocks.mkdir).toHaveBeenCalledWith(resolve(destination, ".."), {
        recursive: true,
      });
      expect(mocks.rename).toHaveBeenCalledWith(directory, destination);
      expect(
        mocks.publishJournalLedger.mock.invocationCallOrder[0],
      ).toBeLessThan(mocks.rename.mock.invocationCallOrder[0]);
      expect(logSpy).toHaveBeenCalledWith(
        `✓ Workspace archived: ${destination}`,
      );
    });
    it("does not rename if archive directory creation fails", async () => {
      const failure = new Error("mkdir failed");
      const { mocks } = await runCli([workspace, "--remote"], ({ mkdir }) => {
        mkdir.mockRejectedValue(failure);
      });
      expect(errorSpy).toHaveBeenCalledWith(failure);
      expect(mocks.rename).not.toHaveBeenCalled();
    });
    it("propagates archive rename failure", async () => {
      const failure = new Error("rename failed");
      const { mocks } = await runCli([workspace, "--remote"], ({ rename }) => {
        rename.mockRejectedValue(failure);
      });
      expect(errorSpy).toHaveBeenCalledWith(failure);
      expect(mocks.publishJournalLedger).toHaveBeenCalledTimes(1);
    });
  });

  describe("Wrangler KV adapters", () => {
    it.each([
      ["null response", null],
      ["object response", {}],
      ["string response", "invalid"],
      ["null entry", [null]],
      ["primitive entry", ["invalid"]],
      ["array entry", [[]]],
      ["missing name", [{}]],
      ["numeric name", [{ name: 123 }]],
      ["null name", [{ name: null }]],
    ])("rejects invalid KV key list: %s", async (_scenario, keys) => {
      const { mocks } = await runCli();
      mockWrangler.mockResolvedValue(JSON.stringify(keys));
      await expect(photoAdapter(mocks).getPhoto("fox")).rejects.toThrow(
        "Invalid KV key list",
      );
      expect(mockWrangler).toHaveBeenCalledWith([
        "list",
        "--prefix",
        "photo:fox",
        "--binding",
        "PHOTO_KV",
        "--local",
      ]);
      expect(mockWrangler.mock.calls.some(([args]) => args[0] === "get")).toBe(
        false,
      );
    });

    it("returns null when the exact photo key is absent", async () => {
      const { mocks } = await runCli();
      mockWrangler.mockResolvedValue(
        JSON.stringify([{ name: "photo:fox-other" }]),
      );
      expect(await photoAdapter(mocks).getPhoto("fox")).toBeNull();
      expect(mockWrangler).toHaveBeenCalledWith([
        "list",
        "--prefix",
        "photo:fox",
        "--binding",
        "PHOTO_KV",
        "--local",
      ]);
    });
    it("gets a photo from PHOTO_KV", async () => {
      const { mocks } = await runCli([workspace, "--remote"]);
      const expected = { id: "fox", cloudflareImageId: "image-id" };
      mockWrangler.mockResolvedValueOnce('[{"name":"photo:fox"}]');
      mockWrangler.mockResolvedValueOnce(JSON.stringify(expected));
      expect(await photoAdapter(mocks).getPhoto("fox")).toEqual(expected);
      expect(mockWrangler).toHaveBeenCalledWith([
        "get",
        "photo:fox",
        "--binding",
        "PHOTO_KV",
        "--remote",
        "--text",
      ]);
    });
    it("puts a photo and strips legacy Cloudflare credentials from Wrangler env", async () => {
      const { mocks } = await runCli();
      const adapter = photoAdapter(mocks);
      const input = { id: "fox" } as Parameters<PhotoPublisher["putPhoto"]>[0];
      await adapter.putPhoto(input);
      expect(mockWrangler).toHaveBeenCalledWith([
        "put",
        "photo:fox",
        JSON.stringify(input),
        "--binding",
        "PHOTO_KV",
        "--local",
      ]);
    });
    it("gets both journal representations", async () => {
      const { mocks } = await runCli();
      const adapter = journalAdapter(mocks);
      for (const [method, key] of [
        ["getAuthored", "journal:authored:forest-journal"],
        ["getAppInit", "journal:appInit:forest-journal"],
      ] as const) {
        mockWrangler.mockResolvedValueOnce(JSON.stringify([{ name: key }]));
        mockWrangler.mockResolvedValueOnce('{"id":"forest-journal"}');
        expect(await adapter[method](workspace)).toEqual({ id: workspace });
        expect(mockWrangler).toHaveBeenCalledWith([
          "get",
          key,
          "--binding",
          "CONTENT_KV",
          "--local",
          "--text",
        ]);
      }
    });
    it("puts both journal representations", async () => {
      const { mocks } = await runCli();
      const adapter = journalAdapter(mocks);
      const authored = { id: workspace } as Parameters<
        JournalPublisher["putAuthored"]
      >[0];
      const appInit = { id: workspace } as Parameters<
        JournalPublisher["putAppInit"]
      >[0];
      await adapter.putAuthored(authored);
      await adapter.putAppInit(appInit);
      expect(mockWrangler).toHaveBeenCalledWith([
        "put",
        `journal:authored:${workspace}`,
        JSON.stringify(authored),
        "--binding",
        "CONTENT_KV",
        "--local",
      ]);
      expect(mockWrangler).toHaveBeenCalledWith([
        "put",
        `journal:appInit:${workspace}`,
        JSON.stringify(appInit),
        "--binding",
        "CONTENT_KV",
        "--local",
      ]);
    });
    it("propagates Wrangler failures", async () => {
      const { mocks } = await runCli();
      const failure = new Error("Wrangler failed");
      mockWrangler.mockRejectedValue(failure);
      await expect(photoAdapter(mocks).getPhoto("fox")).rejects.toBe(failure);
    });
    it("propagates malformed Wrangler JSON", async () => {
      const { mocks } = await runCli();
      mockWrangler.mockResolvedValue("not-json");
      await expect(photoAdapter(mocks).getPhoto("fox")).rejects.toThrow(
        SyntaxError,
      );
    });
  });

  describe("Cloudflare Images upload adapter", () => {
    const photo = {
      id: "fox",
      photographer: "Test photographer",
      sourceFileName: "fox.jpg",
    } as Parameters<PhotoPublisher["uploadImage"]>[0];
    const image = Buffer.from("jpeg-data");
    const response = (data: unknown, status = 200, statusText = ""): Response =>
      new Response(JSON.stringify(data), { status, statusText });
    it("uploads image bytes with correct multipart fields", async () => {
      const { mocks } = await runCli();
      fetchSpy.mockResolvedValue(
        response({
          success: true,
          result: { id: "cf-image", uploaded: "2026-11-04T12:00:00Z" },
        }),
      );
      expect(await photoAdapter(mocks).uploadImage(photo, image)).toEqual({
        id: "cf-image",
        uploadedAt: "2026-11-04T12:00:00Z",
      });
      const [url, options] = fetchSpy.mock.calls[0];
      expect(url).toBe(
        "https://api.cloudflare.com/client/v4/accounts/test-account/images/v1",
      );
      expect(options).toMatchObject({
        method: "POST",
        headers: { Authorization: "Bearer test-images-token" },
      });
      const form = options?.body;
      expect(form).toBeInstanceOf(FormData);
      if (!(form instanceof FormData))
        throw new Error("Missing multipart form");
      expect(form.get("id")).toBe("fox");
      expect(form.get("creator")).toBe("Test photographer");
      expect(form.get("requireSignedURLs")).toBe("false");
      expect(JSON.parse(String(form.get("metadata")))).toEqual({
        source: "content-cli",
        photoId: "fox",
      });
      const file = form.get("file");
      expect(file).toBeInstanceOf(Blob);
      if (!(file instanceof Blob)) throw new Error("Missing file Blob");
      expect(file.type).toBe("image/jpeg");
      expect(file.size).toBe(image.byteLength);
    });
    it.each(["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_IMAGES_API_TOKEN"] as const)(
      "rejects missing %s",
      async (name) => {
        const { mocks } = await runCli();
        Reflect.deleteProperty(process.env, name);
        await expect(
          photoAdapter(mocks).uploadImage(photo, image),
        ).rejects.toThrow(
          "CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_IMAGES_API_TOKEN are required",
        );
        expect(fetchSpy).not.toHaveBeenCalled();
      },
    );
    it.each([
      {
        status: 400,
        body: { success: true, result: { id: "a", uploaded: "now" } },
      },
      { status: 200, body: { success: false } },
      { status: 200, body: { success: true } },
      {
        status: 200,
        body: { success: true, result: { id: "", uploaded: "now" } },
      },
      {
        status: 200,
        body: { success: true, result: { id: "a", uploaded: "" } },
      },
    ])("rejects invalid upload response %#", async ({ status, body }) => {
      const { mocks } = await runCli();
      fetchSpy.mockResolvedValue(response(body, status, "Bad Request"));
      await expect(
        photoAdapter(mocks).uploadImage(photo, image),
      ).rejects.toThrow('Cloudflare Images upload failed for "fox"');
    });
    it("reports Cloudflare error messages", async () => {
      const { mocks } = await runCli();
      fetchSpy.mockResolvedValue(
        response(
          {
            success: false,
            errors: [
              { message: "Invalid image" },
              { message: "Upload rejected" },
            ],
          },
          400,
        ),
      );
      await expect(
        photoAdapter(mocks).uploadImage(photo, image),
      ).rejects.toThrow(
        'Cloudflare Images upload failed for "fox": Invalid image, Upload rejected',
      );
    });
    it("falls back to HTTP status text when errors are missing", async () => {
      const { mocks } = await runCli();
      fetchSpy.mockResolvedValue(
        response({ success: false }, 400, "Bad Request"),
      );
      await expect(
        photoAdapter(mocks).uploadImage(photo, image),
      ).rejects.toThrow(
        'Cloudflare Images upload failed for "fox": Bad Request',
      );
    });
    it("propagates fetch failures", async () => {
      const { mocks } = await runCli();
      const failure = new Error("Network unavailable");
      fetchSpy.mockRejectedValue(failure);
      await expect(photoAdapter(mocks).uploadImage(photo, image)).rejects.toBe(
        failure,
      );
    });
    it("propagates invalid JSON responses", async () => {
      const { mocks } = await runCli();
      fetchSpy.mockResolvedValue(new Response("not-json", { status: 200 }));
      await expect(
        photoAdapter(mocks).uploadImage(photo, image),
      ).rejects.toMatchObject({
        name: "SyntaxError",
      });
    });
  });
});
