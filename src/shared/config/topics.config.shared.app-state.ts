// src/shared/config/topics.config.shared.app-state.ts

import type { TopicsConfigAuthored } from "../../app/types/config/topics/topics.config.authored.type";

export const topicsConfigAuthored = {
  essex: {
    label: "Essex",
    description:
      "Wildlife, woodlands and wild places closer to home, from Epping Forest to the Essex coast.",
    introduction:
      "Field notes and photographs documenting wildlife encounters across Essex, from the ancient woodlands of Epping Forest to wetlands, nature reserves and coastal habitats.",
    image: {
      kind: "editorialPhoto",
      src: "/assets/images/female-mallard-landing-in-an-essex-lake.jpg",
      alt: "Female mallard coming in to land on a lake in Essex, with wings spread and feet extended above the green water.",
      width: 3,
      height: 2,
    },
    dates: {
      created: "2026-10-30",
    },
  },

  raptors: {
    label: "Raptors",
    description:
      "Birds of prey, their behaviour and the encounters that make them such fascinating subjects.",
    introduction:
      "Field notes and photographs documenting encounters with raptors, from familiar kestrels to unexpected moments in the wild.",
    image: {
      kind: "editorialPhoto",
      src: "/assets/images/common-kestrel-in-a-tree-in-richmond-park.jpg",
      alt: "Common kestrel perched among the rough branches of a large tree in Richmond Park, its warm brown plumage marked with dark spots.",
      width: 3,
      height: 2,
    },
    dates: {
      created: "2026-10-30",
    },
  },

  "nature-reserves": {
    label: "Nature Reserves",
    description:
      "Exploring protected habitats, observing their wildlife and discovering what makes each place special.",
    introduction:
      "Field notes and photographs from nature reserves and protected landscapes, exploring the habitats, species and encounters that make each visit distinctive.",
    image: {
      kind: "editorialPhoto",
      src: "/assets/images/mute-swan-on-water-in-bieschbosch-netherlands.jpg",
      alt: "Mute swan swimming on a calm lake in De Biesbosch National Park, Netherlands, with wooded banks reflected in the water.",
      width: 3,
      height: 2,
    },
    dates: {
      created: "2026-10-30",
    },
  },

  travel: {
    label: "Travel",
    description:
      "Wildlife and landscapes encountered further afield, from familiar species to entirely new surroundings.",
    introduction:
      "Field notes and photographs from journeys beyond Essex, exploring unfamiliar habitats, landscapes and wildlife along the way.",
    image: {
      kind: "editorialPhoto",
      src: "/assets/images/viru-bog-in-estonia.jpg",
      alt: "View through pine and birch trees across the waterlogged landscape of Viru Bog in Estonia, with autumn-coloured vegetation and pools of water.",
      width: 3,
      height: 2,
    },
    dates: {
      created: "2026-10-30",
    },
  },
  "wildlife-behaviour": {
    label: "Wildlife Behaviour",
    description:
      "Observations of wildlife behaviour, from feeding and hunting to parenting, movement and the unexpected moments in between.",
    introduction:
      "Field notes and photographs exploring how animals behave in their natural environments. Understanding their habits, interactions and movements reveals fascinating details and often makes the difference between simply seeing wildlife and truly observing it.",
    image: {
      kind: "editorialPhoto",
      src: "/assets/images/kingfisher-flying-with-snack-rye-meads-rspb.jpg",
      alt: "A kingfisher flying low over water with a small fish in its beak, against dense green reeds at Rye Meads RSPB.",
      width: 3,
      height: 2,
    },
    dates: {
      created: "2026-11-04",
    },
  },
} as const satisfies TopicsConfigAuthored;
