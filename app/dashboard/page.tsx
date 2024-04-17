import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Page() {
  // const session = await auth();
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  // const user = {
  //   family_name: "Alfaro",
  //   given_name: "Noel",
  //   picture: "https://avatars.githubusercontent.com/u/56320635?v=4",
  //   email: "ndalfaro333@gmail.com",
  //   id: "kp_6106225af72a4ab49924fe041daf90fb",
  // };

  // const redirectURL =
  //   process.env.NODE_ENV === "production"
  //     ? "https://cicero-coral.vercel.app/"
  //     : "http://localhost:3000/";

  // if (!session?.user) redirect("/api/auth/signin?callbackUrl=/dashboard");
  return (
    <main className="flex  flex-col items-center justify-start">
      {(await isAuthenticated()) ? (
        <div>Dashboard for {user?.given_name}</div>
      ) : (
        <div> Not Logged In</div>
      )}
    </main>
  );
}
