// src/app/content/about/prints.about.content.authored copy.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";

export const printsAboutContentAuthored = {
  kind: "public",
  render: "static",
  pageType: "standard",
  id: "about-prints",
  slug: "/about/prints",
  label: "About Prints",
  breadcrumbs: ["home", "about", "about-prints"],
  dates: {
    created: "2026-11-17",
  },

  metadata: {
    title: "About Prints | Wildlife & Nature Photography",
    description:
      "Discover why Kevin Ellen enjoys printing wildlife and nature photography, from characterful animal encounters to the photographs hanging on his own walls.",
    sitemap: true,
    openGraph: {
      title: "Wildlife Has Character. So Should Your Walls.",
      description:
        "From curious wildlife encounters to photographs with a little personality. A look at why I enjoy seeing my nature photography in print.",
      image: "/assets/images/PRINTS-OG-IMAGE.jpg",
      width: 1200,
      height: 628,
    },
  },

  body: {
    modules: [
      {
        kind: "editorialIntro",
        eyebrow: "About prints",
        title: "Wildlife has character. So should your walls.",
        statement:
          "A little personality, a bit of nature, and something worth looking at.",
        description:
          "I've always enjoyed photographs that have something a little different about them. An unusual expression, a curious bit of behaviour, a moment of complete chaos, or simply a beautiful animal in the right light. Some make you smile, others make you stop and appreciate the detail. And occasionally, you capture something that looks rather spectacular printed and framed.",
        portrait: {
          kind: "editorialPhoto",
          src: "/assets/images/PRINTS-HERO.jpg",
          alt: "A large framed photograph of a red deer stag surrounded by golden autumn vegetation, hanging on a wall at home.",
          width: 500,
          height: 333,
          priority: true,
        },
      },

      {
        kind: "editorialSplit",
        id: "living-with-photography",
        eyebrow: "My own walls",
        reverse: true,
        heading: {
          id: "living-with-photography-heading",
          text: "A rather eclectic collection.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "My own walls are full of wildlife photographs I've taken over the years. Birds in flight, curious expressions, unexpected encounters and the occasional moment of complete absurdity. They're photographs I genuinely enjoy looking at, and that's reason enough to have them hanging around the house.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Not everything matches. The frames are different, the subjects vary, and there's no carefully coordinated theme. But that's rather the point. Each photograph has something about it that I appreciate, whether it's the character of the animal, the composition, or simply how good it looks on the wall.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/PRINTS-AT-HOME.jpg",
          alt: "A collection of Kevin Ellen's wildlife photographs displayed at home in different frames, featuring birds and other wildlife.",
          width: 800,
          height: 533,
          description:
            "A few of my own wildlife photographs, printed, framed and given a place on the wall.",
        },
      },

      {
        kind: "editorialSplit",
        id: "character-in-nature",
        eyebrow: "A bit of personality",
        heading: {
          id: "character-in-nature-heading",
          text: "Nature doesn't do ordinary.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Spend enough time watching wildlife and you quickly realise how much character there is in the natural world. Territorial disputes, elaborate courtship rituals, questionable decisions and moments of complete absurdity are all part of what makes it fascinating.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "There's nothing wrong with a beautiful landscape or a perfectly posed bird. I enjoy those too. But I'm particularly drawn to photographs that make you look twice, whether that's an unexpected expression, an unusual bit of behaviour or something wonderfully peculiar about the subject.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I don't think every photograph needs to be a masterpiece to deserve a place on the wall. Sometimes it's simply the personality of the subject, the atmosphere or a moment that makes you smile.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/PRINT-DETAIL.jpg",
          alt: "A framed wildlife photograph showing a colourful mandarin duck splashing in the water, displayed among other nature photographs.",
          width: 800,
          height: 533,
          description:
            "A little chaos among the collection. Wildlife doesn't always pose politely for a photograph.",
        },
      },

      {
        kind: "editorialFeature",
        id: "print-enquiries",
        eyebrow: "Print enquiries",
        heading: {
          id: "print-enquiries-heading",
          text: "Something caught your eye?",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Perhaps you've spotted a bird with a bit of attitude, an unusual wildlife encounter, or a landscape that you'd quite happily look at every day. If there's a photograph on my website you'd like to have on your own wall, you're welcome to get in touch.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I'm currently exploring print options, initially looking at A4 unframed photographs at around £35. I'm still evaluating paper finishes and production details, and I'd rather get those right before settling on the final options.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "If something takes your fancy, let me know which photograph you're interested in. We can have a chat about what's possible, without any complicated ordering process.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/PRINTS-CLOSING.jpg",
          alt: "A selection of framed wildlife and nature photographs displayed together on a wall at home.",
          width: 1400,
          height: 560,
        },
      },
    ],
  },
} as const satisfies PublicContentAuthored;
