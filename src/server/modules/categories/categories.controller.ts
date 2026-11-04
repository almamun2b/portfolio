import "server-only";
import {
  categoryBodySchema,
  categoryIdSchema,
  categoryListParamsSchema,
} from "@/lib/schemas/categories";
import { AppError } from "@/server/core/errors/app-error";
import { apiRoute } from "@/server/core/http/route";
import { categoryTags } from "./categories.constants";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from "./categories.service";

export const listCategoriesRoute = apiRoute(
  { name: "categories.list", auth: "admin", query: categoryListParamsSchema },
  ({ query }) => listCategories(query),
);

export const createCategoryRoute = apiRoute(
  {
    name: "categories.create",
    auth: "admin",
    body: categoryBodySchema,
    status: 201,
    message: "Category created.",
    tags: () => categoryTags.create(),
  },
  ({ body }) => createCategory(body),
);

export const getCategoryRoute = apiRoute(
  { name: "categories.get", auth: "admin", params: categoryIdSchema },
  async ({ params }) => {
    const category = await getCategoryById(params.id);
    if (!category) throw AppError.notFound("That category no longer exists.");
    return category;
  },
);

export const updateCategoryRoute = apiRoute(
  {
    name: "categories.update",
    auth: "admin",
    params: categoryIdSchema,
    body: categoryBodySchema,
    message: "Category updated.",
    tags: ({ params }) => categoryTags.update(params),
  },
  ({ params, body }) => updateCategory({ id: params.id, ...body }),
);

export const deleteCategoryRoute = apiRoute(
  {
    name: "categories.delete",
    auth: "admin",
    params: categoryIdSchema,
    message: "Category deleted.",
    tags: ({ params }) => categoryTags.remove(params),
  },
  async ({ params }) => {
    await deleteCategory(params.id);
    return null;
  },
);
