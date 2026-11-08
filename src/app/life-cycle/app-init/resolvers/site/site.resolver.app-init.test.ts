// src/app/life-cycle/app-init/resolvers/site/site.resolver.app-init.test.ts

import { resolveSiteConfigAppInit } from "./site.resolver.app-init";

type Input = Parameters<typeof resolveSiteConfigAppInit>[0];
type Authored = Input["authored"];

describe("Site config AppInit resolver", () => {
  const createAuthored = (): Authored =>
    ({
      name: "Wildlife Photography",
    }) as unknown as Authored;

  const createEnv = (domain: string): Input["env"] =>
    ({
      DOMAIN: domain,
    }) as Input["env"];

  const resolve = (authored: Authored, domain = "https://kevinellen.com") =>
    resolveSiteConfigAppInit({
      authored,
      env: createEnv(domain),
    });

  it("uses the environment canonical domain", () => {
    const result = resolve(createAuthored());

    expect(result.canonicalDomain).toBe("https://kevinellen.com");
  });

  it("supports a staging domain", () => {
    const result = resolve(createAuthored(), "https://staging.kevinellen.com");

    expect(result.canonicalDomain).toBe("https://staging.kevinellen.com");
  });

  it("overrides an existing canonical domain", () => {
    const authored = {
      ...createAuthored(),
      canonicalDomain: "https://old.example.com",
    };

    const result = resolve(authored);

    expect(result.canonicalDomain).toBe("https://kevinellen.com");

    expect(authored.canonicalDomain).toBe("https://old.example.com");
  });

  it("preserves unrelated authored properties", () => {
    const authored = {
      ...createAuthored(),
      customProperty: "preserved",
    };

    const result = resolve(authored);

    expect(result).toMatchObject({
      customProperty: "preserved",
    });
  });

  it("preserves nested authored references", () => {
    const metadata = {
      environment: "production",
    };

    const authored = {
      ...createAuthored(),
      metadata,
    };

    const result = resolve(authored);

    expect(
      (
        result as typeof result & {
          metadata: typeof metadata;
        }
      ).metadata,
    ).toBe(metadata);
  });

  it("does not mutate authored configuration", () => {
    const authored = createAuthored();
    const original = { ...authored };

    resolve(authored);

    expect(authored).toEqual(original);
  });

  it("returns a new configuration object", () => {
    const authored = createAuthored();

    const result = resolve(authored);

    expect(result).not.toBe(authored);
  });

  it("supports frozen authored configuration", () => {
    const authored = Object.freeze(createAuthored());

    const result = resolve(authored);

    expect(result.canonicalDomain).toBe("https://kevinellen.com");
  });
});
