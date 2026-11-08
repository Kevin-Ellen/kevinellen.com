// src/app/content/about/equipment.about.content.authored.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";

export const equipmentAboutContentAuthored = {
  kind: "public",
  render: "static",
  pageType: "standard",
  id: "equipment",
  slug: "/about/equipment",
  label: "Equipment",
  breadcrumbs: ["home", "about", "equipment"],
  dates: {
    created: "2026-10-28",
  },

  metadata: {
    title: "Photography Equipment",
    description:
      "Explore the cameras, lenses and equipment Kevin Ellen uses for wildlife and nature photography, both locally in Essex and further afield.",
    sitemap: true,
  },

  body: {
    modules: [
      {
        kind: "editorialIntro",
        eyebrow: "Equipment",
        title: "What comes along.",
        statement:
          "A camera, a rather large lens, and usually a coffee somewhere along the way.",
        description:
          "I keep my photography equipment relatively straightforward. Most of the time, it's the same camera, telephoto lens and a few things that make spending hours outdoors more comfortable. Nothing particularly elaborate, just equipment that works for the way I photograph wildlife.",
        portrait: {
          kind: "editorialPhoto",
          src: "/assets/images/photography-equipment-in-the-field.jpg",
          alt: "Canon camera with a large telephoto lens, camouflage cover, BlackRapid strap, cap and coffee on a red picnic table",
          width: 800,
          height: 600,
          priority: true,
        },
      },

      {
        kind: "editorialSplit",
        id: "camera-and-optics",
        eyebrow: "Camera & optics",
        heading: {
          id: "camera-and-optics-heading",
          text: "The usual suspects.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "My main setup is the Canon EOS R7 paired with the RF 100–500mm L-series telephoto lens. It's relatively lightweight and mobile, with an excellent range for wildlife photography and performance I can rely on. The combination feels sturdy, and its weather resistance provides some reassurance when conditions are less than ideal, although there are limits to what I'm prepared to expose it to.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "The camouflage covering the lens is primarily there for protection rather than concealment. As you can probably tell from the photograph, it's seen its fair share of outings and is looking rather weathered itself. I'd much rather the cover take the punishment than the lens underneath.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I also carry the RF 1.4× Extender for situations where the light and conditions allow it. Combined with the R7's APS-C crop sensor, it gives me considerable additional reach, particularly useful when photographing distant wildlife. There are trade-offs in maximum aperture and light gathering, so it's something I use when the circumstances suit it rather than leaving it permanently attached.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value: "Official equipment information: ",
              },
              {
                kind: "link",
                link: {
                  kind: "external",
                  href: "https://www.canon.co.uk/store/canon-eos-r7-mirrorless-camera-body/5137C025/",
                  label: "Canon EOS R7",
                  target: "_blank",
                  rel: ["noopener"],
                },
              },
              {
                kind: "text",
                value: " · ",
              },
              {
                kind: "link",
                link: {
                  kind: "external",
                  href: "https://www.canon.co.uk/store/canon-rf-100-500mm-f4-5-7-1l-is-usm-lens/4112C005/",
                  label: "RF 100–500mm",
                  target: "_blank",
                  rel: ["noopener"],
                },
              },
              {
                kind: "text",
                value: " · ",
              },
              {
                kind: "link",
                link: {
                  kind: "external",
                  href: "https://www.canon.co.uk/store/canon-extender-rf-1-4x/4113C005/",
                  label: "RF 1.4× Extender",
                  target: "_blank",
                  rel: ["noopener"],
                },
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/canon-r7-wildlife-photography-equipment.jpg",
          alt: "Canon EOS R7 with a camouflage-covered RF 100–500mm telephoto lens and a detached RF 1.4× Extender on a weathered wooden bench",
          width: 800,
          height: 1084,
          description:
            "My Canon EOS R7, RF 100–500mm L-series lens and RF 1.4× Extender. The camouflage has certainly seen better days, but that's rather the point.",
        },
      },

      {
        kind: "editorialSplit",
        id: "carrying-the-kit",
        reverse: true,
        eyebrow: "The bag of goodies",
        heading: {
          id: "carrying-the-kit-heading",
          text: "Getting it all there.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "My Vanguard VEO Active 53 backpack goes pretty much everywhere I take the camera. It's large enough to accommodate my photography equipment alongside the various essentials that make spending a full day outdoors a little easier. Over time, it's become something of a travelling collection of useful odds and ends.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "There's always basic cleaning equipment, spare batteries, a charging pack and protective covers, including a heavy-duty rain cover for when the weather turns particularly unpleasant. Drinks and snacks have their place too, along with personal essentials such as a EpiPen. Some things are considerably more important than getting the photograph.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "It's a bag that's accompanied me through woodlands, wetlands, mountains and plenty of less-than-ideal weather. The contents change a little depending on where I'm heading, but the principle stays the same: carry what I might need, without turning every outing into an expedition.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "When I'm actually walking with the camera, the BlackRapid Curve Breathe sling keeps it comfortably at my side rather than hanging around my neck. It leaves my hands free and means I can bring the camera up quickly when something catches my attention. A small detail, but one that makes a real difference over a long day.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value: "Manufacturer information: ",
              },
              {
                kind: "link",
                link: {
                  kind: "external",
                  href: "https://www.vanguardworld.co.uk/products/veo-active-53-gy",
                  label: "Vanguard VEO Active 53",
                  target: "_blank",
                  rel: ["noopener", "noreferrer"],
                },
              },
              {
                kind: "text",
                value: " · ",
              },
              {
                kind: "link",
                link: {
                  kind: "external",
                  href: "https://www.blackrapid.com/shotkit-review-of-blackrapid-curve-breathe/",
                  label: "BlackRapid Curve Breathe",
                  target: "_blank",
                  rel: ["noopener"],
                },
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/vanguard-veo-active-53-field-equipment.jpg",
          alt: "Open Vanguard VEO Active 53 backpack showing its orange padded compartments, camera accessories, cleaning supplies and carrying straps",
          width: 1080,
          height: 1440,
          description:
            "Inside my Vanguard VEO Active 53. Cleaning equipment, spare supplies, protective covers and assorted essentials. Everything has a place, even if it's not always immediately obvious where.",
        },
      },
    ],
  },

  structuredData: {
    "@graph": [
      {
        "@type": "Person",
        "@id": "/#person",
        owns: [
          { "@id": "/about/equipment#canon-eos-r7" },
          { "@id": "/about/equipment#canon-rf-100-500mm" },
          { "@id": "/about/equipment#canon-rf-14x-extender" },
          { "@id": "/about/equipment#vanguard-veo-active-53" },
          { "@id": "/about/equipment#blackrapid-curve-breathe" },
        ],
      },
      {
        "@type": "WebPage",
        "@id": "/about/equipment#webpage",
        url: "/about/equipment",
        name: "Equipment",
        description:
          "The camera, lenses and field equipment Kevin Ellen uses for wildlife and nature photography.",
        inLanguage: "en-GB",
        isPartOf: {
          "@id": "/#website",
        },
        author: {
          "@id": "/#person",
        },
        mainEntity: {
          "@id": "/#person",
        },
        about: [
          { "@id": "/#person" },
          { "@id": "/about/equipment#canon-eos-r7" },
          { "@id": "/about/equipment#canon-rf-100-500mm" },
          { "@id": "/about/equipment#canon-rf-14x-extender" },
          { "@id": "/about/equipment#vanguard-veo-active-53" },
          { "@id": "/about/equipment#blackrapid-curve-breathe" },
        ],
      },
      {
        "@type": "Product",
        "@id": "/about/equipment#canon-eos-r7",
        name: "Canon EOS R7",
        brand: {
          "@type": "Brand",
          name: "Canon",
        },
        category: "Mirrorless digital camera",
        mpn: "5137C025",
        description:
          "The APS-C mirrorless camera Kevin Ellen uses for wildlife photography.",
        sameAs:
          "https://www.canon.co.uk/store/canon-eos-r7-mirrorless-camera-body/5137C025/",
      },
      {
        "@type": "Product",
        "@id": "/about/equipment#canon-rf-100-500mm",
        name: "Canon RF 100–500mm f/4.5–7.1 L IS USM",
        brand: {
          "@type": "Brand",
          name: "Canon",
        },
        mpn: "4112C005",
        category: "Telephoto zoom lens",
        description:
          "Kevin Ellen's principal telephoto lens for wildlife photography.",
        sameAs:
          "https://www.canon.co.uk/store/canon-rf-100-500mm-f4-5-7-1l-is-usm-lens/4112C005/",
      },
      {
        "@type": "Product",
        "@id": "/about/equipment#canon-rf-14x-extender",
        name: "Canon RF 1.4× Extender",
        brand: {
          "@type": "Brand",
          name: "Canon",
        },
        mpn: "4113C005",
        category: "Teleconverter",
        description:
          "A 1.4× teleconverter used selectively when additional focal length is needed.",
        sameAs:
          "https://www.canon.co.uk/store/canon-extender-rf-1-4x/4113C005/",
      },
      {
        "@type": "Product",
        "@id": "/about/equipment#vanguard-veo-active-53",
        name: "Vanguard VEO Active 53",
        brand: {
          "@type": "Brand",
          name: "Vanguard",
        },
        mpn: "VEO ACTIVE53 GY",
        category: "Camera backpack",
        description:
          "Kevin Ellen's camera backpack for carrying photography equipment and field essentials.",
        sameAs: "https://www.vanguardworld.co.uk/products/veo-active-53-gy",
      },
      {
        "@type": "Product",
        "@id": "/about/equipment#blackrapid-curve-breathe",
        name: "BlackRapid Curve Breathe",
        brand: {
          "@type": "Brand",
          name: "BlackRapid",
        },
        mpn: "361007",
        category: "Camera sling strap",
        description:
          "A camera sling used to carry photography equipment comfortably and keep it accessible while walking.",
      },
    ],
  },
} as const satisfies PublicContentAuthored;
