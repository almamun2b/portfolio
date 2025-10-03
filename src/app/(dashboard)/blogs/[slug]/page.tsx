interface CreateBlogPageProps {
  params: Promise<{ slug: "create" | "edit" }>;
}

const CreateBlogPage = async ({ params }: CreateBlogPageProps) => {
  const { slug } = await params;
  if (slug !== "create" && slug !== "edit") {
    throw new Error("Page not found");
  }
  return <div>CreateBlogPage {slug}</div>;
};

export default CreateBlogPage;
