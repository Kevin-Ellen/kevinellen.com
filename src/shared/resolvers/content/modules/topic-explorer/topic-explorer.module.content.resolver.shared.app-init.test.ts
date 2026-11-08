// src/shared/resolvers/content/modules/topic-explorer/topic-explorer.module.content.resolver.shared.app-init.test.ts

import { resolveTopicExplorerModuleAppInit } from "./topic-explorer.module.content.resolver.shared.app-init";

type Input = Parameters<typeof resolveTopicExplorerModuleAppInit>[0];
type Authored = Input["authored"];
type Topics = Input["topics"];
type Topic = Topics[keyof Topics];

describe("Topic explorer module AppInit resolver", () => {
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
      kind: "topicExplorer",
    }) as unknown as Authored;

  const resolve = (topics: Topics, authored: Authored = createAuthored()) =>
    resolveTopicExplorerModuleAppInit({
      authored,
      topics,
    });

  it("returns an empty list when there are no topics", () => {
    const result = resolve(createTopics());

    expect(result.unrankedItems).toEqual([]);
  });

  it("maps a single topic into a listing item", () => {
    const topic = createTopic("Essex");

    const result = resolve(createTopics({ essex: topic }));

    expect(result.unrankedItems).toEqual([
      {
        id: "essex",
        label: "Essex",
        description: "Essex photography",
        href: "/topics/essex",
        image: topic.image,
      },
    ]);
  });

  it("maps multiple topics in registry order", () => {
    const result = resolve(
      createTopics({
        raptors: createTopic("Raptors"),
        essex: createTopic("Essex"),
        "nature-reserves": createTopic("Nature reserves"),
      }),
    );

    expect(result.unrankedItems.map((item) => item.id)).toEqual([
      "raptors",
      "essex",
      "nature-reserves",
    ]);
  });

  it("constructs the correct topic URLs", () => {
    const result = resolve(
      createTopics({
        "wildlife-behaviour": createTopic("Wildlife behaviour"),
        travel: createTopic("Travel"),
      }),
    );

    expect(result.unrankedItems.map((item) => item.href)).toEqual([
      "/topics/wildlife-behaviour",
      "/topics/travel",
    ]);
  });

  it("preserves the original topic image reference", () => {
    const topic = createTopic("Raptors");

    const result = resolve(createTopics({ raptors: topic }));

    expect(result.unrankedItems[0]?.image).toBe(topic.image);
  });

  it("preserves unrelated authored properties", () => {
    const authored = {
      ...createAuthored(),
      identifier: "topic-explorer",
    };

    expect(resolve(createTopics(), authored)).toMatchObject({
      identifier: "topic-explorer",
    });
  });

  it("does not mutate the authored topics", () => {
    const topic = createTopic("Essex");
    const topics = createTopics({ essex: topic });
    const original = { ...topics };

    resolve(topics);

    expect(topics).toEqual(original);
    expect(topics.essex).toBe(topic);
  });

  it("returns fresh result objects and arrays", () => {
    const topics = createTopics({
      essex: createTopic("Essex"),
    });

    const first = resolve(topics);
    const second = resolve(topics);

    expect(first).not.toBe(second);
    expect(first.unrankedItems).not.toBe(second.unrankedItems);
    expect(first.unrankedItems[0]).not.toBe(second.unrankedItems[0]);
  });
});
