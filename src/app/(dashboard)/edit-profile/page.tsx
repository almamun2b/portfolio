import { getUserById } from "@/actions/users";
import { EditProfileForm } from "@/components/modules/Profile";
import { getUserSession } from "@/helpers/getUserSession";
import { SingleUserResponse } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Update your profile information.",
};

const EditProfilePage = async () => {
  const session = await getUserSession();

  if (!session?.user?.id) {
    notFound();
  }

  const userResponse: SingleUserResponse | null = await getUserById(
    session.user.id
  );

  if (!userResponse || !userResponse.success) {
    notFound();
  }

  return <EditProfileForm user={userResponse.data} />;
};

export default EditProfilePage;
