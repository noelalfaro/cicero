import { ModeToggle } from "@/app/components/dark-mode-toggle";
import Nav from "@/app/components/nav";
import Players from "@/app/components/players";
import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Home() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {(await isAuthenticated()) ? (
        <div>
          <p className="mb-8">Well, well, well, if it isn&apos;t...</p>
          <p className="text-lg font-medium">
            {user!.given_name} {user!.family_name}
          </p>
          <pre className="mt-4 rounded-sm bg-slate-950 p-4 font-mono text-sm text-cyan-200">
            {JSON.stringify(user, null, 2)}
          </pre>
          <LogoutLink className="mt-8 inline-block text-blue-500 underline">
            Logout
          </LogoutLink>
        </div>
      ) : (
        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
          <LoginLink
            postLoginRedirectURL="/dashboard"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Login{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Log into an existing Prospect Portfolio account.
            </p>
          </LoginLink>

          <RegisterLink
            postLoginRedirectURL="/dashboard"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Register{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Create a new Prospect Portfolio account.
            </p>
          </RegisterLink>
        </div>
      )}
    </main>
  );
}
