// tests/src/rendering/body-content/block/hero.body-content.renderer.test.ts

import type { AppRenderContextHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-render-context.hero.block.page-content.types";

import { renderHeroBlockContentModule } from "@rendering/body-content/block/hero.body-content.renderer";

const createHeroModule = (
  overrides: Partial<AppRenderContextHeroBlockContentModule> = {},
): AppRenderContextHeroBlockContentModule => ({
  kind: "hero",
  immersive: true,
  flow: "breakout",
  photo: {
    id: "coot-nest-handover",
    title: "Coot nest handover",
    readableLocation: "Walthamstow Wetlands",
    capturedAt: "27 May 2025",
    src: "/media/photo/coot-nest-handover",
    srcset: [
      "/media/photo/coot-nest-handover/400/267 400w",
      "/media/photo/coot-nest-handover/800/533 800w",
    ],
    sizes: "(min-width: 960px) 80vw, 100vw",
    width: 3000,
    height: 2000,
    ratio: {
      height: 100,
      width: 100,
    },
    alt: "A coot carrying nesting material.",
    commentary: "A coot passes nesting material through the reeds.",
    attribution: null,
    meta: [],
  },
  ...overrides,
});

describe("renderHeroBlockContentModule", () => {
  it("renders the hero photo figure", () => {
    const html = renderHeroBlockContentModule(createHeroModule());

    expect(html).toContain(`<figure class="m-contentBlock m-photo`);
    expect(html).toContain(`data-photo-id="coot-nest-handover"`);
    expect(html).toContain(`class="m-photo__object"`);
    expect(html).toContain(`src="/media/photo/coot-nest-handover"`);
    expect(html).toContain(
      `srcset="/media/photo/coot-nest-handover/400/267 400w, /media/photo/coot-nest-handover/800/533 800w"`,
    );
    expect(html).toContain(`sizes="(min-width: 960px) 80vw, 100vw"`);
    expect(html).toContain(`width="3000"`);
    expect(html).toContain(`height="2000"`);
    expect(html).toContain(`alt="A coot carrying nesting material."`);
  });

  it("adds immersive class and eager loading for immersive heroes", () => {
    const html = renderHeroBlockContentModule(
      createHeroModule({
        immersive: true,
      }),
    );

    expect(html).toContain(`m-photo--immersive`);
    expect(html).toContain(`loading="eager"`);
  });

  it("uses lazy loading and omits immersive class for non-immersive heroes", () => {
    const html = renderHeroBlockContentModule(
      createHeroModule({
        immersive: false,
      }),
    );

    expect(html).not.toContain(`m-photo--immersive`);
    expect(html).toContain(`loading="lazy"`);
  });

  it("renders caption commentary", () => {
    const html = renderHeroBlockContentModule(createHeroModule());

    expect(html).toContain(`<figcaption class="m-photo__annotation">`);
    expect(html).toContain(
      `<p class="m-photo__caption">A coot passes nesting material through the reeds.</p>`,
    );
  });

  it("renders context and settings metadata groups", () => {
    const baseModule = createHeroModule();

    const html = renderHeroBlockContentModule(
      createHeroModule({
        photo: {
          ...baseModule.photo,
          srcset: [],
          sizes: "100vw",
          meta: [
            {
              kind: "context",
              items: [
                {
                  id: "location",
                  label: "Location",
                  description: null,
                  value: "Walthamstow Wetlands",
                },
              ],
            },
            {
              kind: "settings",
              items: [
                {
                  id: "shutterSpeed",
                  label: "Shutter speed",
                  description:
                    "How long the camera sensor was exposed to light.",
                  value: "1/3200 sec",
                },
              ],
            },
          ],
        },
      }),
    );

    expect(html).toContain(`class="m-photo__meta-group"`);
    expect(html).toContain(`<dl class="m-photo__meta">`);
    expect(html).toContain(
      `<dl class="m-photo__meta m-photo__meta--settings">`,
    );
    expect(html).toContain(`<dt class="m-photo__meta-term">Location</dt>`);
    expect(html).toContain(
      `<dd class="m-photo__meta-detail">Walthamstow Wetlands</dd>`,
    );
    expect(html).toContain(
      `<abbr title="How long the camera sensor was exposed to light.">Shutter speed</abbr>`,
    );
  });

  it("does not render metadata wrapper when metadata is empty", () => {
    const baseModule = createHeroModule();

    const html = renderHeroBlockContentModule(
      createHeroModule({
        photo: {
          ...baseModule.photo,
          meta: [],
        },
      }),
    );

    expect(html).not.toContain(`m-photo__meta-group`);
  });

  it("escapes photo values before rendering", () => {
    const baseModule = createHeroModule();

    const html = renderHeroBlockContentModule(
      createHeroModule({
        photo: {
          ...baseModule.photo,
          id: `photo-"bad"`,
          src: `/media/photo/"bad"`,
          srcset: [`/media/photo/"bad"/400/267 400w`],
          sizes: `"100vw"`,
          alt: `A "bad" <photo>`,
          commentary: `Caption with <strong>HTML</strong> & friends.`,
          meta: [
            {
              kind: "context",
              items: [
                {
                  id: "location",
                  label: `Location <bad>`,
                  description: null,
                  value: `Wetlands & reeds`,
                },
              ],
            },
          ],
        },
      }),
    );

    expect(html).toContain(`data-photo-id="photo-&quot;bad&quot;"`);
    expect(html).toContain(`src="/media/photo/&quot;bad&quot;"`);
    expect(html).toContain(`alt="A &quot;bad&quot; &lt;photo&gt;"`);
    expect(html).toContain(
      `Caption with &lt;strong&gt;HTML&lt;/strong&gt; &amp; friends.`,
    );
    expect(html).toContain(`Location &lt;bad&gt;`);
    expect(html).toContain(`Wetlands &amp; reeds`);
  });
});
