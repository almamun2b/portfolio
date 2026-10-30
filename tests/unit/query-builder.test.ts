import { describe, expect, it, vi } from "vitest";
// db.ts configures the postgresql dialect beside the Prisma client; import it
// for the side effect so the builder under test is the configured one.
import "@/server/core/db";
import { QueryBuilder } from "query-builder-prisma";

// A stand-in for a Prisma delegate: the builder only needs findMany and count.
function delegate(rows: unknown[] = [], total = rows.length) {
  return {
    findMany: vi.fn((_args?: object) => Promise.resolve(rows)),
    count: vi.fn((_args?: object) => Promise.resolve(total)),
  };
}

// The package's own suite covers the builder internals; these tests pin what
// this project depends on: db.ts's postgresql dialect config and the basic
// list-query contract the admin services are built on.
describe("configured QueryBuilder", () => {
  it("searches case-insensitively (postgresql dialect) and skips empty text", () => {
    const some = new QueryBuilder(delegate())
      .search({ searchText: "jo", fields: ["name", "email"] as never })
      .buildArgs();
    expect(some).toMatchObject({
      where: {
        OR: [
          { name: { contains: "jo", mode: "insensitive" } },
          { email: { contains: "jo", mode: "insensitive" } },
        ],
      },
    });
    const none = new QueryBuilder(delegate())
      .search({ searchText: "", fields: ["name"] as never })
      .buildArgs();
    expect(none).toEqual({});
  });

  it("passes a multi-key orderBy through verbatim", () => {
    const args = new QueryBuilder(delegate())
      .orderBy([{ createdAt: "desc" }, { id: "asc" }] as never)
      .buildArgs();
    expect(args).toMatchObject({
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    });
  });

  it("returns rows and page meta, counting with the same filters", async () => {
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
    expect(source.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: "ACTIVE" } }),
    );
  });

  it("reports zero pages for an empty list", async () => {
    const { meta } = await new QueryBuilder(delegate([], 0))
      .paginate({ page: 1, limit: 10 })
      .executeWithMeta();
    // ceil(0 / limit) = 0; list pages guard redirects and pager links with
    // `total > 0`, so 0 pages never reaches a link.
    expect(meta).toEqual({ page: 1, limit: 10, total: 0, totalPage: 0 });
  });
});
