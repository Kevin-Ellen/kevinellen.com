// src/tests/integration/http.life-cycle.integration.test.ts

import { handleLifeCycle } from "../../app/life-cycle/life-cycle";

import type { ValidatedEnv } from "../../app/entry.type";
import type { JournalLedgerAppInit } from "../../shared/types/content/kv-ledger.content.shared.type";

import { createPublishedContentFixture } from "../fixtures/content.published.integration.fixture";

describe("HTTP lifecycle integration", () => {
  const createKv = (records: ReadonlyMap<string, unknown>): KVNamespace => {
    const get = jest.fn(async (key: string) => {
      if (!records.has(key)) {
        return null;
      }

      return structuredClone(records.get(key));
    });

    return {
      get,
    } as unknown as KVNamespace;
  };

  const createEnv = (
    contentKv: KVNamespace,
    photoKv: KVNamespace = createKv(new Map()),
  ): ValidatedEnv =>
    ({
      DOMAIN: "https://kevinellen.com",
      CONTENT_KV: contentKv,
      PHOTO_KV: photoKv,
      INSPECT_ENABLED: "false",
    }) as ValidatedEnv;

  const createLedger = (): JournalLedgerAppInit => ({
    version: 1,
    entries: [],
  });

  const execute = (pathname: string, env: ValidatedEnv): Promise<Response> =>
    handleLifeCycle({
      request: new Request(`https://kevinellen.com${pathname}`),
      env,
    });

  describe("Unknown routes", () => {
    it("returns a rendered 404 response", async () => {
      const contentKv = createKv(
        new Map<string, unknown>([["ledger:appInit:journal", createLedger()]]),
      );

      const response = await execute(
        "/integration-test-nonexistent-page",
        createEnv(contentKv),
      );

      expect(response.status).toBe(404);

      expect(response.headers.get("content-type")).toContain("text/html");

      const html = await response.text();

      expect(html).toMatch(/^<!DOCTYPE html>/);
      expect(html).toContain("<html");
      expect(html).toContain("</html>");
      expect(html).toContain('id="main-content"');
    });

    it("does not retrieve missing published content", async () => {
      const contentKv = createKv(
        new Map<string, unknown>([["ledger:appInit:journal", createLedger()]]),
      );

      await execute("/integration-test-nonexistent-page", createEnv(contentKv));

      expect(contentKv.get).toHaveBeenCalledWith(
        "ledger:appInit:journal",
        "json",
      );

      expect(contentKv.get).not.toHaveBeenCalledWith(
        expect.stringMatching(/^journal:appInit:/),
        "json",
      );
    });
  });

  describe("Missing journal ledger", () => {
    it("rejects a request when the required ledger is absent", async () => {
      const contentKv = createKv(new Map());

      await expect(
        execute("/integration-test-nonexistent-page", createEnv(contentKv)),
      ).rejects.toThrow("Published journal AppInit ledger not found");

      expect(contentKv.get).toHaveBeenCalledWith(
        "ledger:appInit:journal",
        "json",
      );
    });

    describe("Published journal", () => {
      it("renders a published journal through the complete HTTP lifecycle", async () => {
        const fixture = createPublishedContentFixture();

        const journal = fixture.journal;

        // Find all photo references in the published journal.
        const photoIds = new Set<string>();

        const collectPhotoIds = (value: unknown): void => {
          if (Array.isArray(value)) {
            value.forEach(collectPhotoIds);
            return;
          }

          if (typeof value !== "object" || value === null) {
            return;
          }

          for (const [key, child] of Object.entries(value)) {
            if (key === "photoId" && typeof child === "string") {
              photoIds.add(child);
            }

            collectPhotoIds(child);
          }
        };

        collectPhotoIds(journal.body);

        const ledger: JournalLedgerAppInit = {
          version: 1,
          entries: [
            {
              ...fixture.entry,
              photos: [...photoIds],
            },
          ],
        };

        const contentKv = createKv(
          new Map<string, unknown>([
            ["ledger:appInit:journal", ledger],
            [`journal:appInit:${fixture.entry.id}`, journal],
          ]),
        );

        // Use the real photograph as a metadata template.
        // These additional records are synthetic test data.
        const photoKv = createKv(
          new Map<string, unknown>(
            [...photoIds].map((id) => [
              `photo:${id}`,
              {
                ...fixture.photo,
                id,
                cloudflareImageId: id,
                title: id,
                alt: id,
                species: fixture.photo.species ?? null,
                dimensions: {
                  width: fixture.photo.width,
                  height: fixture.photo.height,
                },
              },
            ]),
          ),
        );

        const response = await execute(
          fixture.entry.slug,
          createEnv(contentKv, photoKv),
        );

        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toContain("text/html");

        const html = await response.text();

        expect(html).toMatch(/^<!DOCTYPE html>/);
        expect(html).toContain('<html lang="en-GB"');
        expect(html).toContain("<article");
        expect(html).toContain('id="main-content"');

        expect(html).toContain("Escape in Amager Fælled");

        expect(html).toContain('rel="canonical"');
        expect(html).toContain('type="application/ld+json"');

        expect(contentKv.get).toHaveBeenCalledWith(
          "ledger:appInit:journal",
          "json",
        );

        expect(contentKv.get).toHaveBeenCalledWith(
          `journal:appInit:${fixture.entry.id}`,
          "json",
        );

        for (const id of photoIds) {
          expect(photoKv.get).toHaveBeenCalledWith(`photo:${id}`, "json");
        }
      });
    });
  });
});
