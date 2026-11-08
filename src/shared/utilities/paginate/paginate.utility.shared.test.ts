// src/shared/utilities/paginate/paginate.utility.shared.test.ts

import { paginate } from "./paginate.utility.shared";

describe("Pagination utility", () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  describe("Valid pagination", () => {
    it("returns the first page", () => {
      expect(
        paginate({
          items,
          requestedPage: 1,
          pageSize: 3,
        }),
      ).toEqual({
        items: [1, 2, 3],
        currentPage: 1,
        totalPages: 4,
        totalItems: 10,
        pageSize: 3,
      });
    });

    it("returns a middle page", () => {
      const result = paginate({
        items,
        requestedPage: 2,
        pageSize: 3,
      });

      expect(result?.items).toEqual([4, 5, 6]);
      expect(result?.currentPage).toBe(2);
    });

    it("returns the final partial page", () => {
      expect(
        paginate({
          items,
          requestedPage: 4,
          pageSize: 3,
        }),
      ).toEqual({
        items: [10],
        currentPage: 4,
        totalPages: 4,
        totalItems: 10,
        pageSize: 3,
      });
    });

    it("returns a full final page when items divide evenly", () => {
      const result = paginate({
        items,
        requestedPage: 2,
        pageSize: 5,
      });

      expect(result?.items).toEqual([6, 7, 8, 9, 10]);
      expect(result?.totalPages).toBe(2);
    });

    it("returns all items when the page size exceeds the collection", () => {
      const result = paginate({
        items,
        requestedPage: 1,
        pageSize: 20,
      });

      expect(result?.items).toEqual(items);
      expect(result?.totalPages).toBe(1);
    });

    it("supports a page size of one", () => {
      const result = paginate({
        items,
        requestedPage: 10,
        pageSize: 1,
      });

      expect(result).toEqual({
        items: [10],
        currentPage: 10,
        totalPages: 10,
        totalItems: 10,
        pageSize: 1,
      });
    });

    it("supports a single-item collection", () => {
      expect(
        paginate({
          items: ["fox"],
          requestedPage: 1,
          pageSize: 10,
        }),
      ).toEqual({
        items: ["fox"],
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        pageSize: 10,
      });
    });
  });

  describe("Empty collections", () => {
    it("returns an empty first page", () => {
      expect(
        paginate({
          items: [],
          requestedPage: 1,
          pageSize: 10,
        }),
      ).toEqual({
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 10,
      });
    });

    it("rejects page two of an empty collection", () => {
      expect(
        paginate({
          items: [],
          requestedPage: 2,
          pageSize: 10,
        }),
      ).toBeNull();
    });
  });

  describe("Invalid requested pages", () => {
    it.each([
      0,
      -1,
      -10,
      1.5,
      -0.5,
      NaN,
      Infinity,
      -Infinity,
      Number.MAX_SAFE_INTEGER + 1,
    ])("returns null for invalid requested page %s", (requestedPage) => {
      expect(
        paginate({
          items,
          requestedPage,
          pageSize: 3,
        }),
      ).toBeNull();
    });

    it("returns null when the requested page exceeds total pages", () => {
      expect(
        paginate({
          items,
          requestedPage: 5,
          pageSize: 3,
        }),
      ).toBeNull();
    });

    it("returns null for an excessively large valid page number", () => {
      expect(
        paginate({
          items,
          requestedPage: Number.MAX_SAFE_INTEGER,
          pageSize: 3,
        }),
      ).toBeNull();
    });
  });

  describe("Invalid page sizes", () => {
    it.each([
      0,
      -1,
      -10,
      1.5,
      -0.5,
      NaN,
      Infinity,
      -Infinity,
      Number.MAX_SAFE_INTEGER + 1,
    ])("throws for invalid page size %s", (pageSize) => {
      expect(() =>
        paginate({
          items,
          requestedPage: 1,
          pageSize,
        }),
      ).toThrow("Pagination pageSize must be a positive integer");
    });

    it("validates page size before requested page", () => {
      expect(() =>
        paginate({
          items,
          requestedPage: 0,
          pageSize: 0,
        }),
      ).toThrow("Pagination pageSize must be a positive integer");
    });
  });

  describe("Data integrity", () => {
    it("does not mutate the original collection", () => {
      const original = [...items];

      paginate({
        items,
        requestedPage: 2,
        pageSize: 3,
      });

      expect(items).toEqual(original);
    });

    it("returns a new array rather than the original reference", () => {
      const result = paginate({
        items,
        requestedPage: 1,
        pageSize: 20,
      });

      expect(result?.items).not.toBe(items);
      expect(result?.items).toEqual(items);
    });

    it("preserves object references within the returned page", () => {
      const photos = [
        { id: "fox", title: "Red fox" },
        { id: "deer", title: "Fallow deer" },
        { id: "owl", title: "Tawny owl" },
      ];

      const result = paginate({
        items: photos,
        requestedPage: 2,
        pageSize: 1,
      });

      expect(result?.items).toEqual([photos[1]]);
      expect(result?.items[0]).toBe(photos[1]);
    });

    it("preserves generic item types", () => {
      type Photo = Readonly<{
        id: string;
        title: string;
      }>;

      const photos: readonly Photo[] = [
        { id: "fox", title: "Red fox" },
        { id: "deer", title: "Fallow deer" },
      ];

      const result = paginate<Photo>({
        items: photos,
        requestedPage: 1,
        pageSize: 1,
      });

      expect(result?.items).toEqual([{ id: "fox", title: "Red fox" }]);
    });
  });
});
