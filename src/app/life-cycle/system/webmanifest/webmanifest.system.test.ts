// src/app/life-cycle/system/webmanifest/webmanifest.system.test.ts

import type { AppInit } from "../../app-init/class.app-init";

import { resolveWebmanifestSystem } from "./webmanifest.system";

describe("Webmanifest system", () => {
  const site = {
    name: "Kevin Ellen Photography",
    description: "Wildlife and nature photography.",
    language: "en-GB",
    themeColor: "#192b24",
    icons: {
      svg: "/icons/icon.svg",
      appleTouch: "/icons/apple-touch-icon.png",
      favicon: "/favicon.ico",
    },
  };

  const resolve = (siteOverrides: Partial<typeof site> = {}) => {
    const appInit = {
      site: {
        ...site,
        ...siteOverrides,
      },
    } as AppInit;

    return resolveWebmanifestSystem({ appInit });
  };

  it("returns a JSON response with the correct content type", () => {
    const response = resolve();

    expect(response.kind).toBe("json");
    expect(response.status).toBe(200);
    expect(response.headers).toEqual({
      "Content-Type": "application/manifest+json; charset=utf-8",
    });
  });

  it("renders the expected manifest properties", () => {
    const response = resolve();

    expect(JSON.parse(response.body)).toEqual({
      id: "/",
      name: site.name,
      short_name: site.name,
      description: site.description,
      lang: site.language,
      start_url: "/",
      scope: "/",
      display: "browser",
      theme_color: site.themeColor,
      background_color: site.themeColor,
      icons: [
        {
          src: site.icons.svg,
          type: "image/svg+xml",
          purpose: "any",
        },
        {
          src: site.icons.appleTouch,
          type: "image/png",
          purpose: "any",
        },
        {
          src: site.icons.favicon,
          type: "image/x-icon",
          purpose: "any",
        },
      ],
    });
  });

  it("uses the site name for both name and short_name", () => {
    const response = resolve({
      name: "Epping Forest Photography",
    });

    const manifest: unknown = JSON.parse(response.body);

    expect(manifest).toEqual(
      expect.objectContaining({
        name: "Epping Forest Photography",
        short_name: "Epping Forest Photography",
      }),
    );
  });

  it("uses the theme colour for both theme and background", () => {
    const response = resolve({
      themeColor: "#ffffff",
    });

    const manifest: unknown = JSON.parse(response.body);

    expect(manifest).toEqual(
      expect.objectContaining({
        theme_color: "#ffffff",
        background_color: "#ffffff",
      }),
    );
  });

  it("preserves icon order and MIME types", () => {
    const response = resolve();

    const manifest: {
      icons: Array<{
        src: string;
        type: string;
        purpose: string;
      }>;
    } = JSON.parse(response.body) as {
      icons: Array<{
        src: string;
        type: string;
        purpose: string;
      }>;
    };

    expect(manifest.icons.map((icon) => icon.type)).toEqual([
      "image/svg+xml",
      "image/png",
      "image/x-icon",
    ]);

    expect(manifest.icons.map((icon) => icon.src)).toEqual([
      site.icons.svg,
      site.icons.appleTouch,
      site.icons.favicon,
    ]);
  });

  it("produces valid JSON containing escaped text", () => {
    const description = 'Wildlife "photography" & field notes';

    const response = resolve({ description });

    const manifest: unknown = JSON.parse(response.body);

    expect(manifest).toEqual(
      expect.objectContaining({
        description,
      }),
    );
  });
});
