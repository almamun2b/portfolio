/* eslint-disable @typescript-eslint/no-explicit-any */
import BlogDetailsCard from "@/components/modules/BlogsOld/BlogDetailsCard";
import { getBlogById } from "@/services/PostServices";

interface BlogDetailsPageProps {
  params: Promise<{ blogId: string }>;
}

export const generateMetadata = async ({ params }: BlogDetailsPageProps) => {
  const { blogId } = await params;
  const blog = await getBlogById(blogId);

  return {
    title: blog.title,
    description: blog.content,
  };
};

export const generateStaticParams = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/post`);
  const { data: blogs } = await res.json();

  return blogs.map((blog: any) => ({
    blogId: blog.id.toString(),
  }));
};

const BlogDetailsPage = async ({ params }: BlogDetailsPageProps) => {
  const { blogId } = await params;
  const blog = await getBlogById(blogId);

  return (
    <div className="py-30 px-4 max-w-7xl mx-auto">
      <BlogDetailsCard blog={blog} />
    </div>
  );
};

export default BlogDetailsPage;
