import { getUserSession } from "@/helpers/getUserSession";

const DashboardHomePage = async () => {
  const quote = "The secret of getting ahead is getting started.";

  const session = await getUserSession();
  console.log("Session:", session);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Welcome {session?.user?.name}</h1>
      <p>{session?.user?.email}</p>
      <p className="">{quote}</p>
    </div>
  );
};

export default DashboardHomePage;
