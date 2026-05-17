// src/rendering/body-content/header.body-content.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

import { BodyContentHeaderTemplate } from "@rendering/body-content/header.body-content.template";

type Header = AppRenderContextBodyContent["header"];

const header = (
  overrides: Partial<NonNullable<Header>> = {},
): NonNullable<Header> => ({
  title: "Wildlife Journal",
  eyebrow: "Field Notes",
  intro: "Observations from marshes and forests.",
  showInBody: true,
  ...overrides,
});

describe("BodyContentHeaderTemplate", () => {
  it("renders the body content header", () => {
    expect(
      renderToStaticMarkup(<BodyContentHeaderTemplate header={header()} />),
    ).toBe(
      '<header class="m-heading l-content"><p class="m-heading__eyebrow">Field Notes</p><h1 class="m-heading__title">Wildlife Journal</h1><p class="m-heading__intro">Observations from marshes and forests.</p></header>',
    );
  });

  it("renders without optional fields", () => {
    expect(
      renderToStaticMarkup(
        <BodyContentHeaderTemplate
          header={header({
            eyebrow: null,
            intro: null,
          })}
        />,
      ),
    ).toBe(
      '<header class="m-heading l-content"><h1 class="m-heading__title">Wildlife Journal</h1></header>',
    );
  });

  it("renders nothing when header is null", () => {
    expect(
      renderToStaticMarkup(<BodyContentHeaderTemplate header={null} />),
    ).toBe("");
  });

  it("renders nothing when showInBody is false", () => {
    expect(
      renderToStaticMarkup(
        <BodyContentHeaderTemplate
          header={header({
            showInBody: false,
          })}
        />,
      ),
    ).toBe("");
  });

  it("escapes unsafe content", () => {
    const html = renderToStaticMarkup(
      <BodyContentHeaderTemplate
        header={header({
          title: '<script>alert("x")</script>',
        })}
      />,
    );

    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });
});
