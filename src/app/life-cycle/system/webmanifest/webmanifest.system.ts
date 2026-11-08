// src/app/life-cycle/system/webmanifest/webmanifest.system.ts

import type { AppInit } from "../../app-init/class.app-init";
import type { JsonResponseOutput } from "../../../types/response/response.shared.type";

type Input = Readonly<{
  appInit: AppInit;
}>;

export const resolveWebmanifestSystem = ({
  appInit,
}: Input): JsonResponseOutput => {
  const { name, description, language, themeColor, icons } = appInit.site;

  const manifest = {
    id: "/",
    name,
    short_name: name,
    description,
    lang: language,
    start_url: "/",
    scope: "/",
    display: "browser",
    theme_color: themeColor,
    background_color: themeColor,
    icons: [
      {
        src: icons.svg,
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: icons.appleTouch,
        type: "image/png",
        purpose: "any",
      },
      {
        src: icons.favicon,
        type: "image/x-icon",
        purpose: "any",
      },
    ],
  };

  return {
    kind: "json",
    status: 200,
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
    },
    body: JSON.stringify(manifest),
  };
};
