// import { auth, signOut } from "@/auth";
import { ModeToggle } from "@/app/components/dark-mode-toggle";
import SignOutButton from "@/app/my-profile/SignOutButton";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  const redirectURL =
    process.env.NODE_ENV === "production"
      ? "https://cicero-coral.vercel.app/"
      : "http://localhost:3000/";
  return (
    <main className="flex w-full max-w-5xl flex-col items-start justify-between gap-4 ">
      {(await isAuthenticated()) ? (
        <>
          <div className="flex  w-full flex-col ">
            <div>
              <p className="mb-8">Well, well, well, if it isn&apos;t...</p>

              <pre className="mt-4 rounded-sm bg-slate-950 p-4 font-mono text-sm text-cyan-200">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
          <ModeToggle />
          <LogoutLink
            postLogoutRedirectURL={redirectURL}
            className=" inline-block text-blue-500 underline"
          >
            <Button>Logout</Button>
          </LogoutLink>
        </>
      ) : (
        <div>Not Authenticated</div>
      )}
    </main>
  );
}
