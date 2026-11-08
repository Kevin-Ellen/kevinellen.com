// src/app/life-cycle/app-resolve/resolvers/structured-data/global/person/person.global.structured-data.resolver.app-resolve.test.ts

import { personConfigAuthored } from "../../../../../../../shared/config/person.config.shared.authored";

import { resolvePersonAppResolve } from "./person.global.structured-data.resolver.app-resolve";

type Person = Parameters<typeof resolvePersonAppResolve>[0]["person"];

describe("Person structured data AppResolve resolver", () => {
  const createPerson = (overrides: Partial<Person> = {}): Person => ({
    ...personConfigAuthored,
    website: "https://kevinellen.com",
    ...overrides,
  });

  const resolve = (person: Person = createPerson()) => {
    const result = resolvePersonAppResolve({ person });

    if (typeof result === "string") {
      throw new Error("Expected a Person structured-data object");
    }

    return result;
  };

  it("creates a Person schema entity", () => {
    const result = resolve();

    expect(result["@type"]).toBe("Person");
  });

  it("constructs the Person identifier from the website", () => {
    const result = resolve();

    expect(result["@id"]).toBe("https://kevinellen.com/#person");
  });

  it("uses the supplied website URL", () => {
    const result = resolve(
      createPerson({
        website: "https://example.com",
      }),
    );

    expect(result.url).toBe("https://example.com");
    expect(result["@id"]).toBe("https://example.com/#person");
  });

  it("maps name and description", () => {
    const person = createPerson({
      name: "Test Photographer",
      description: "Wildlife photographer in Essex",
    });

    const result = resolve(person);

    expect(result.name).toBe(person.name);
    expect(result.description).toBe(person.description);
  });

  it("resolves a root-relative image against the website", () => {
    const result = resolve(
      createPerson({
        image: "/images/portrait.jpg",
      }),
    );

    expect(result.image).toBe("https://kevinellen.com/images/portrait.jpg");
  });

  it("preserves an absolute image URL", () => {
    const result = resolve(
      createPerson({
        image: "https://cdn.example.com/portrait.jpg",
      }),
    );

    expect(result.image).toBe("https://cdn.example.com/portrait.jpg");
  });

  it("copies interests, job titles and languages", () => {
    const person = createPerson({
      knowsAbout: ["Wildlife photography", "Ecology"],
      jobTitles: ["Photographer"],
      knowsLanguage: ["English", "Dutch"],
    });

    const result = resolve(person);

    expect(result.knowsAbout).toEqual(person.knowsAbout);
    expect(result.jobTitle).toEqual(person.jobTitles);
    expect(result.knowsLanguage).toEqual(person.knowsLanguage);

    expect(result.knowsAbout).not.toBe(person.knowsAbout);
    expect(result.jobTitle).not.toBe(person.jobTitles);
    expect(result.knowsLanguage).not.toBe(person.knowsLanguage);
  });

  it("maps nationality and birth date", () => {
    const person = createPerson();

    const result = resolve(person);

    expect(result.nationality).toBe(person.nationality);
    expect(result.birthDate).toBe(person.birthDate);
  });

  it("builds a PostalAddress from the person's address", () => {
    const person = createPerson();

    const result = resolve(person);

    expect(result.address).toEqual({
      "@type": "PostalAddress",
      ...person.address,
    });
  });

  it("builds a Place containing a PostalAddress for birthPlace", () => {
    const person = createPerson();

    const result = resolve(person);

    expect(result.birthPlace).toEqual({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...person.birthPlace,
      },
    });
  });

  it("converts social profiles into sameAs URLs", () => {
    const person = createPerson({
      socialProfiles: {
        instagram: "https://instagram.com/example",
        linkedin: "https://linkedin.com/in/example",
      },
    });

    const result = resolve(person);

    expect(result.sameAs).toEqual([
      "https://instagram.com/example",
      "https://linkedin.com/in/example",
    ]);
  });

  it("supports an empty social profile registry", () => {
    const result = resolve(
      createPerson({
        socialProfiles: {},
      }),
    );

    expect(result.sameAs).toEqual([]);
  });

  it("does not mutate the supplied person configuration", () => {
    const person = Object.freeze(createPerson());

    const result = resolve(person);

    expect(person.website).toBe("https://kevinellen.com");
    expect(result.url).toBe(person.website);
    expect(result).not.toBe(person);
  });

  it("propagates invalid image URL errors", () => {
    expect(() =>
      resolve(
        createPerson({
          website: "invalid-domain",
          image: "/portrait.jpg",
        }),
      ),
    ).toThrow("Invalid URL");
  });
});
