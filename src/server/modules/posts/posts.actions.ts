"use server";

import {
  createPostSchema,
  postIdSchema,
  updatePostSchema,
} from "@/lib/schemas/posts";
import { adminAction } from "@/server/core/action";
import { postTags } from "./posts.constants";
import { createPost, deletePost, updatePost } from "./posts.service";

export const createPostAction = adminAction(
  "post.create",
  createPostSchema,
  async (data) => {
    const post = await createPost(data);
    return { id: post.id };
  },
  { tags: postTags.create },
);

export const updatePostAction = adminAction(
  "post.update",
  updatePostSchema,
  async (data) => {
    await updatePost(data);
  },
  { tags: postTags.update },
);

export const deletePostAction = adminAction(
  "post.delete",
  postIdSchema,
  async (data) => {
    await deletePost(data.id);
  },
  { tags: postTags.remove },
);
