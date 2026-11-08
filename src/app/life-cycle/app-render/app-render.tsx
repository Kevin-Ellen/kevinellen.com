// src/app/life-cycle/app-render/app-render.tsx

import { renderToString } from "react-dom/server";

import type { AppRenderContext } from "../app-render-context/class.app-render-context";
import type { HtmlResponseOutput } from "../../types/response/response.shared.type";

import { Document } from "./document/document.app-render";

export const appRender = (context: AppRenderContext): HtmlResponseOutput => ({
  kind: "html",
  status: context.metadata.status,
  body: `<!DOCTYPE html>${renderToString(
    <Document document={context.document} metadata={context.metadata} />,
  )}`,
  nonce: context.metadata.nonce,
});
