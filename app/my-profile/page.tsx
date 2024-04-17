// import { auth, signOut } from "@/auth";
import { ModeToggle } from "@/app/components/dark-mode-toggle";
import SignOutButton from "@/app/my-profile/SignOutButton";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default async function Page() {
  const isAuthenticated = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return false;
  };
  const user = {
    family_name: "Alfaro",
    given_name: "Noel",
    picture: "https://avatars.githubusercontent.com/u/56320635?v=4",
    email: "ndalfaro333@gmail.com",
    id: "kp_6106225af72a4ab49924fe041daf90fb",
  };
  // const session = await auth();
  return (
    <main className="flex w-full max-w-5xl flex-col items-start justify-between gap-4 ">
      <div className="flex  w-full flex-col ">
        <div>
          <p className="mb-8">Well, well, well, if it isn&apos;t...</p>

          <pre className="mt-4 rounded-sm bg-slate-950 p-4 font-mono text-sm text-cyan-200">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
      <ModeToggle />
      <LogoutLink className=" inline-block text-blue-500 underline">
        <Button>Logout</Button>
      </LogoutLink>
    </main>
  );
}
