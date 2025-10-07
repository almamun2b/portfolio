import { ChangePasswordForm } from "@/components/modules/Profile";
import { getUserSession } from "@/helpers/getUserSession";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Update your account password for better security.",
};

const ChangePasswordPage = async () => {
  const session = await getUserSession();

  if (!session?.user?.id) {
    notFound();
  }

  return <ChangePasswordForm userId={session.user.id} />;
};

export default ChangePasswordPage;
