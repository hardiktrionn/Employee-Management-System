
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const UserLayout = async({ children }) => {
  const cookieStore = await cookies();
  const cookiesToken = cookieStore.get("token")?.value;

  if (cookiesToken) {
    redirect("/dashboard");
  }

  return <>{children}</>;
};

export default UserLayout;
