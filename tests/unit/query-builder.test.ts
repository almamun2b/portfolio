import { describe, expect, it, vi } from "vitest";
import { QueryBuilder } from "@/server/core/query-builder";

// A stand-in for a Prisma delegate: the builder only needs findMany and count.
function delegate(rows: unknown[] = [], total = rows.length) {
  return {
    findMany: vi.fn((_args?: object) => Promise.resolve(rows)),
    count: vi.fn((_args?: object) => Promise.resolve(total)),
  };
}

describe("QueryBuilder.buildArgs", () => {
  it("builds nothing when nothing is set", () => {
    expect(new QueryBuilder(delegate()).buildArgs()).toEqual({});
  });

  it("searches case-insensitively across fields, and skips empty text", () => {
    const some = new QueryBuilder(delegate())
      .search({ searchText: "jo", fields: ["name", "email"] as never })
      .buildArgs();
    expect(some).toEqual({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: "jo", mode: "insensitive" } },
              { email: { contains: "jo", mode: "insensitive" } },
            ],
          },
        ],
      },
    });
    const none = new QueryBuilder(delegate())
      .search({ searchText: "", fields: ["name"] as never })
      .buildArgs();
    expect(none).toEqual({});
  });

  it("drops undefined filters so optional params can be passed straight in", () => {
    const args = new QueryBuilder(delegate())
      .filter({ status: undefined })
      .filter({ status: "ACTIVE" })
      .buildArgs();
    expect(args).toEqual({ where: { AND: [{ status: "ACTIVE" }] } });
  });

  it("adds gte/lte for ranges, including dotted paths", () => {
    const from = new Date("2026-01-01");
    const args = new QueryBuilder(delegate())
      .range({ createdAt: { from }, "actor.age": { to: 9 } })
      .buildArgs();
    expect(args).toEqual({
      where: {
        AND: [{ createdAt: { gte: from } }, { actor: { age: { lte: 9 } } }],
      },
    });
  });

  it("turns page and limit into skip and take", () => {
    const args = new QueryBuilder(delegate())
      .paginate({ page: 3, limit: 25 })
      .buildArgs();
    expect(args).toMatchObject({ skip: 50, take: 25 });
  });

  it("keeps custom args, such as a stable secondary sort", () => {
    const args = new QueryBuilder(delegate())
      .custom({ orderBy: [{ createdAt: "desc" }, { id: "asc" }] })
      .buildArgs();
    expect(args).toMatchObject({
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    });
  });

  it("fetches one extra row for cursor pagination", () => {
    const args = new QueryBuilder(delegate())
      .cursorPaginate({ cursor: "abc", limit: 10 })
      .buildArgs();
    expect(args).toMatchObject({ take: 11, skip: 1, cursor: { id: "abc" } });
  });
});

describe("QueryBuilder.executeWithMeta", () => {
  it("returns rows and page meta, and counts with the same filters", async () => {
    const source = delegate([{ id: "1" }, { id: "2" }], 41);
    const result = await new QueryBuilder(source)
      .filter({ status: "ACTIVE" })
      .paginate({ page: 2, limit: 10 })
      .executeWithMeta();
    expect(result.meta).toEqual({
      page: 2,
      limit: 10,
      total: 41,
      totalPage: 5,
    });
    expect(result.data).toHaveLength(2);
    expect(source.count).toHaveBeenCalledWith({
      where: { AND: [{ status: "ACTIVE" }] },
    });
  });

  it("reports one page for an empty list", async () => {
    const { meta } = await new QueryBuilder(delegate([], 0))
      .paginate({ page: 1, limit: 10 })
      .executeWithMeta();
    expect(meta.totalPage).toBe(1);
  });
});
