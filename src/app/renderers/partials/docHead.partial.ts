// src/app/renderers/partials/docHead.partial.ts
import CSS from "@generated/styles.css?raw";

// import type { AppPage } from "@types-src/appPage.types";

const renderDocHead = (): string => {
  return `
<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Journal Template</title>
    <style>
      ${CSS}
    </style>
  </head>
  <body class="l-page">`;
};
export default renderDocHead;
