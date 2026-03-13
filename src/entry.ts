import CSS from "./generated/styles.css?raw";

export default {
  async fetch(): Promise<Response> {
    const bundleName = "SASS/CSS - D";

    const html = `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${bundleName}</title>

    <style>
      ${CSS}
    </style>
  </head>
  <body>
    <main>
      <h1>${bundleName}</h1>
      <p>Hello from Cloudflare + GitHub + Spacelift + Terraform</p>
    </main>
  </body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "x-robots-tag": "noindex",
      },
    });
  },
};
