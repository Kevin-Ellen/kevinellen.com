// src/pages/public/static/about/authored.equipment.about.page.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";
import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredEquipmentAboutPage: AuthoredPublicPageDefinition =
  deepFreeze({
    id: "about-equipment",
    kind: "static",
    label: "Equipment",
    slug: "/about/equipment",

    metadata: {
      pageTitle: "Equipment",
      metaDescription:
        "The camera bodies, lenses, and field kit Kevin Ellen uses for wildlife, macro, and nature photography.",
    },

    breadcrumbs: ["home", "about", "about-equipment"],

    content: {
      head: {
        eyebrow: "About",
        title: "Equipment",
        intro:
          "This is the camera kit I use for wildlife, macro, and general nature photography. I prioritise equipment that helps me stay mobile, react quickly, and remain comfortable during long days in the field.",
      },

      body: [
        {
          kind: "contentSection",
          heading: {
            text: "Camera body",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "The Canon EOS R7 is my main camera body and a constant companion when travelling. Its size and weight make it ideal for long days outdoors, while the APS-C sensor provides additional reach without requiring excessively large lenses.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "It performs best in good light, but in return I gain significant reach. Combined with my telephoto setup, it allows me to photograph wildlife from a respectful distance while still filling the frame.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "Lenses",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "My kit is built around three lenses that each serve a distinct purpose. The RF 100–500mm is my primary wildlife lens, the RF 100mm F2.8 Macro allows me to focus on detail and close-up subjects, and the RF-S 18–150mm provides flexibility for travel and wider scenes.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "Together, they reflect how I approach photography: balancing patience and reach for wildlife with slower, more deliberate work when focusing on detail.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "In the field",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "Long days outdoors require more than just a camera and lens. Comfort, weight distribution, and accessibility all play a role in how effective I can be when photographing.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "Sling",
            level: 3,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "I use a Rapid sling, which distributes the weight of the camera across my shoulder and allows it to rest comfortably at my side. It makes a noticeable difference over longer periods and is one of the most valuable pieces of equipment I carry.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "For additional security and stability, I pair this with a Peak Design wrist strap. It helps reduce sway while walking and allows me to handle the camera more freely when shooting.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "Backpack",
            level: 3,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "My main bag is the Vanguard VEO Active 53 Trekking backpack. It is large enough for travel across different types of transport while still being manageable to carry over longer distances.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "The removable camera compartment is particularly useful, allowing me to separate my gear when needed while keeping space for food, water, and other essentials.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "Closing words",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "After time in the field, I enjoy printing my photographs and displaying them at home. Using the Canon imagePROGRAF PRO-300, I can produce prints up to A3+, giving the images a physical presence that goes beyond the screen.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "While my kit may seem extensive, it is built around reliability and comfort. Knowing my equipment can handle the conditions allows me to focus fully on the photography itself.",
                },
              ],
            },
          ],
        },
      ],
    },
  });
