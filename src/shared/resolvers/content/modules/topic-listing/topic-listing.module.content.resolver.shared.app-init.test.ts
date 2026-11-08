// src/shared/resolvers/content/modules/topic-listing/topic-listing.module.content.resolver.shared.app-init.test.ts

import { resolveTopicListingModuleAppInit } from "./topic-listing.module.content.resolver.shared.app-init";

type Input = Parameters<typeof resolveTopicListingModuleAppInit>[0];
type Authored = Input["authored"];
type Topics = Input["topics"];
type Topic = Topics[keyof Topics];

describe("Topic listing module AppInit resolver", () => {
  const createTopic = (label: string): Topic =>
    ({
      label,
      description: `${label} photography`,
      image: {
        kind: "editorialPhoto",
        src: "/images/topic.jpg",
        alt: `${label} photograph`,
        width: 1200,
        height: 800,
      },
    }) as unknown as Topic;

  const createTopics = (entries: Partial<Topics> = {}): Topics =>
    entries as Topics;

  const createAuthored = (): Authored =>
    ({
      kind: "topicListing",
    }) as unknown as Authored;

  const resolve = (topics: Topics, authored: Authored = createAuthored()) =>
    resolveTopicListingModuleAppInit({
      authored,
      topics,
    });

  it("returns an empty items array when no topics exist", () => {
    const result = resolve(createTopics());

    expect(result.items).toEqual([]);
  });

  it("maps a single topic", () => {
    const topic = createTopic("Essex");

    const result = resolve(createTopics({ essex: topic }));

    expect(result.items).toEqual([
      {
        id: "essex",
        label: "Essex",
        description: "Essex photography",
        href: "/topics/essex",
        image: topic.image,
      },
    ]);
  });

  it("maps all topics in registry insertion order", () => {
    const result = resolve(
      createTopics({
        raptors: createTopic("Raptors"),
        travel: createTopic("Travel"),
        "wildlife-behaviour": createTopic("Wildlife behaviour"),
      }),
    );

    expect(result.items.map((item) => item.id)).toEqual([
      "raptors",
      "travel",
      "wildlife-behaviour",
    ]);
  });

  it("constructs correct URLs for hyphenated topic IDs", () => {
    const result = resolve(
      createTopics({
        "nature-reserves": createTopic("Nature reserves"),
        "wildlife-behaviour": createTopic("Wildlife behaviour"),
      }),
    );

    expect(result.items.map((item) => item.href)).toEqual([
      "/topics/nature-reserves",
      "/topics/wildlife-behaviour",
    ]);
  });

  it("preserves the resolved topic image references", () => {
    const topic = createTopic("Raptors");

    const result = resolve(createTopics({ raptors: topic }));

    expect(result.items[0]?.image).toBe(topic.image);
  });

  it("preserves unrelated authored properties", () => {
    const authored = {
      ...createAuthored(),
      identifier: "topic-index",
    };

    expect(resolve(createTopics(), authored)).toMatchObject({
      identifier: "topic-index",
    });
  });

  it("does not mutate the topics registry", () => {
    const topic = createTopic("Essex");
    const topics = createTopics({ essex: topic });

    resolve(topics);

    expect(topics.essex).toBe(topic);
  });

  it("returns a new module, items array and item objects", () => {
    const topics = createTopics({
      essex: createTopic("Essex"),
    });

    const first = resolve(topics);
    const second = resolve(topics);

    expect(first).not.toBe(second);
    expect(first.items).not.toBe(second.items);
    expect(first.items[0]).not.toBe(second.items[0]);
  });

  it("maps all topics in alphabetical topic ID order", () => {
    const result = resolve(
      createTopics({
        raptors: createTopic("Raptors"),
        travel: createTopic("Travel"),
        "wildlife-behaviour": createTopic("Wildlife behaviour"),
      }),
    );

    expect(result.items.map((item) => item.id)).toEqual([
      "raptors",
      "travel",
      "wildlife-behaviour",
    ]);
  });

  it("produces identical output regardless of registry insertion order", () => {
    const raptors = createTopic("Raptors");
    const travel = createTopic("Travel");
    const wildlife = createTopic("Wildlife behaviour");

    const first = resolve(
      createTopics({
        travel,
        raptors,
        "wildlife-behaviour": wildlife,
      }),
    );

    const second = resolve(
      createTopics({
        "wildlife-behaviour": wildlife,
        raptors,
        travel,
      }),
    );

    expect(first).toEqual(second);
    expect(first.items.map((item) => item.id)).toEqual([
      "raptors",
      "travel",
      "wildlife-behaviour",
    ]);
  });
});
