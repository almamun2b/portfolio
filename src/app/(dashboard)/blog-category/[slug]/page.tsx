interface CreateBlogCategoryPageProps {
  params: Promise<{ slug: "create" | "edit" }>;
}

const CreateBlogCategoryPage = async ({
  params,
}: CreateBlogCategoryPageProps) => {
  const { slug } = await params;
  if (slug !== "create" && slug !== "edit") {
    throw new Error("Page not found");
  }
  return <div>CreateBlogPage {slug}</div>;
};

export default CreateBlogCategoryPage;
