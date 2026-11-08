// src/app/life-cycle/inspect/inspect.test.ts

import { inspectLifeCycle, resolveInspectStage } from "./inspect";

describe("Lifecycle inspection", () => {
  const origin = "https://kevinellen.com";

  const createUrl = (query = ""): URL => new URL(`${origin}/${query}`);

  describe("Inspection stage resolution", () => {
    it.each(["app-init", "routing", "app-resolve", "app-render-context"])(
      "recognises the %s stage",
      (stage) => {
        const url = createUrl(`?__inspect=${stage}`);

        expect(
          resolveInspectStage({
            url,
            enabled: true,
          }),
        ).toBe(stage);
      },
    );

    it("returns null when inspection is disabled", () => {
      const url = createUrl("?__inspect=routing");

      expect(
        resolveInspectStage({
          url,
          enabled: false,
        }),
      ).toBeNull();
    });

    it("returns null when the inspection parameter is absent", () => {
      expect(
        resolveInspectStage({
          url: createUrl(),
          enabled: true,
        }),
      ).toBeNull();
    });

    it.each(["", "unknown", "APP-INIT", "app_init", "render"])(
      "rejects unsupported stage %s",
      (stage) => {
        const url = createUrl(`?__inspect=${stage}`);

        expect(
          resolveInspectStage({
            url,
            enabled: true,
          }),
        ).toBeNull();
      },
    );

    it("ignores unrelated query parameters", () => {
      const url = createUrl("?utm_source=test&__inspect=app-resolve&page=2");

      expect(
        resolveInspectStage({
          url,
          enabled: true,
        }),
      ).toBe("app-resolve");
    });

    it("uses the first inspection parameter when duplicated", () => {
      const url = createUrl("?__inspect=routing&__inspect=app-init");

      expect(
        resolveInspectStage({
          url,
          enabled: true,
        }),
      ).toBe("routing");
    });

    it("does not modify the input URL", () => {
      const url = createUrl("?__inspect=routing");
      const original = url.href;

      resolveInspectStage({
        url,
        enabled: true,
      });

      expect(url.href).toBe(original);
    });
  });

  describe("Lifecycle inspection output", () => {
    it.each([
      "app-init",
      "routing",
      "app-resolve",
      "app-render-context",
    ] as const)("serialises the %s stage", (stage) => {
      const data = { example: true };

      const result = inspectLifeCycle({
        stage,
        data,
      });

      expect(result).toEqual({
        kind: "json",
        status: 200,
        body: JSON.stringify({ stage, data }, null, 2),
      });
    });

    it("preserves nested inspection data", () => {
      const data = {
        site: {
          name: "Kevin Ellen Photography",
        },
        routing: {
          pathname: "/journal/example",
          source: "published",
        },
        entries: ["one", "two"],
      };

      const result = inspectLifeCycle({
        stage: "app-resolve",
        data,
      });

      expect(JSON.parse(result.body)).toEqual({
        stage: "app-resolve",
        data,
      });
    });

    it("uses two-space JSON indentation", () => {
      const result = inspectLifeCycle({
        stage: "routing",
        data: { pathname: "/about" },
      });

      expect(result.body).toBe(
        [
          "{",
          '  "stage": "routing",',
          '  "data": {',
          '    "pathname": "/about"',
          "  }",
          "}",
        ].join("\n"),
      );
    });

    it("supports null inspection data", () => {
      const result = inspectLifeCycle({
        stage: "app-init",
        data: null,
      });

      expect(JSON.parse(result.body)).toEqual({
        stage: "app-init",
        data: null,
      });
    });

    it("preserves empty objects and arrays", () => {
      const result = inspectLifeCycle({
        stage: "app-render-context",
        data: {
          objects: {},
          arrays: [],
        },
      });

      expect(JSON.parse(result.body)).toEqual({
        stage: "app-render-context",
        data: {
          objects: {},
          arrays: [],
        },
      });
    });

    it("omits undefined values during JSON serialisation", () => {
      const result = inspectLifeCycle({
        stage: "routing",
        data: {
          pathname: "/about",
          missing: undefined,
        },
      });

      expect(JSON.parse(result.body)).toEqual({
        stage: "routing",
        data: {
          pathname: "/about",
        },
      });
    });
  });
});
