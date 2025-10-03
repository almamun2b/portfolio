import { NextResponse } from "next/server";
import { post } from "../route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  const { blogId } = await params;
  const blog = post.find((blog) => blog.id === Number(blogId));
  return NextResponse.json(blog, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
