import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import VerifyLink from "./VerifyLink";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return <VerifyLink />;
}
