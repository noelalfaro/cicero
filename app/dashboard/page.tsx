// import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Page() {
  // const session = await auth();
  // const { getUser, isAuthenticated } = getKindeServerSession();

  // console.log(await getUser());
  // console.log(await isAuthenticated());
  // const user = await getUser();

  // if (!session?.user) redirect("/api/auth/signin?callbackUrl=/dashboard");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Dashboard for {user?.given_name} */}
      {/* <LogoutLink className="mt-8 inline-block text-blue-500 underline">
        <button>Logout</button>
      </LogoutLink> */}
    </main>
  );
}
