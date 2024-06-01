import Signout from "@/components/Signout";
import { auth } from "@/auth";

const page = async () => {
  const session = await auth();
  console.log("session", session);

  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <Signout />
    </div>
  );
};

export default page;
