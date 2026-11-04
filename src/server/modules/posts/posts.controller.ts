import "server-only";
import {
  postBodySchema,
  postIdSchema,
  postListParamsSchema,
} from "@/lib/schemas/posts";
import { AppError } from "@/server/core/errors/app-error";
import { apiRoute } from "@/server/core/http/route";
import { postTags } from "./posts.constants";
import {
  createPost,
  deletePost,
  getPostById,
  listPosts,
  updatePost,
} from "./posts.service";

export const listPostsRoute = apiRoute(
  { name: "posts.list", auth: "admin", query: postListParamsSchema },
  ({ query }) => listPosts(query),
);

export const createPostRoute = apiRoute(
  {
    name: "posts.create",
    auth: "admin",
    body: postBodySchema,
    status: 201,
    message: "Post created.",
    tags: () => postTags.create(),
  },
  ({ body }) => createPost(body),
);

export const getPostRoute = apiRoute(
  { name: "posts.get", auth: "admin", params: postIdSchema },
  async ({ params }) => {
    const post = await getPostById(params.id);
    if (!post) throw AppError.notFound("That post no longer exists.");
    return post;
  },
);

export const updatePostRoute = apiRoute(
  {
    name: "posts.update",
    auth: "admin",
    params: postIdSchema,
    body: postBodySchema,
    message: "Post updated.",
    tags: ({ params }) => postTags.update(params),
  },
  ({ params, body }) => updatePost({ id: params.id, ...body }),
);

export const deletePostRoute = apiRoute(
  {
    name: "posts.delete",
    auth: "admin",
    params: postIdSchema,
    message: "Post deleted.",
    tags: ({ params }) => postTags.remove(params),
  },
  async ({ params }) => {
    await deletePost(params.id);
    return null;
  },
);
