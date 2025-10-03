interface CreateProjectPageProps {
  params: Promise<{ slug: "create" | "edit" }>;
}

const CreateProjectPage = async ({ params }: CreateProjectPageProps) => {
  const { slug } = await params;
  if (slug !== "create" && slug !== "edit") {
    throw new Error("Page not found");
  }
  return <div>CreateProjectPage {slug}</div>;
};

export default CreateProjectPage;
