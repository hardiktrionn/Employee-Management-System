
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const UserLayout = async({ children }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return <>{children}</>;
};

export default UserLayout;
