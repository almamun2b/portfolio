import { getUserById } from "@/actions/users";
import { ProfileContent } from "@/components/modules/Profile";
import { SingleUserResponse } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "User Profile",
  description: "View user profile information.",
};

const UserProfilePage = async ({ params }: UserProfilePageProps) => {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const userResponse: SingleUserResponse | null = await getUserById(id);

  if (!userResponse || !userResponse.success) {
    notFound();
  }

  return <ProfileContent user={userResponse.data} />;
};

export default UserProfilePage;
