import { ModeToggle } from "@/app/components/dark-mode-toggle";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { User, userSchema } from "@/app/lib/definitions";

export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();

  const kindeUser = await getUser();
  // console.log(kindeUser);

  // Fetch the additional user information
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.KINDE_API_ACCESS_TOKEN}`,
  };

  let username = "";

  try {
    const response = await fetch(
      `https://cicero.kinde.com/api/v1/user?id=${kindeUser?.id}`,
      {
        method: "GET",
        headers: headers,
      },
    )
      .then(function (res) {
        return res.json();
      })
      .then(function (body) {
        console.log(body.username);
      });
  } catch (error) {
    console.error("Failed to fetch additional user information:", error);
  }

  // Create a complete user object
  // const user: User = {
  //   ...kindeUser,
  //   username,
  // };

  // Validate the user object using the schema

  const redirectURL =
    process.env.NODE_ENV === "production"
      ? "https://cicero-coral.vercel.app"
      : "http://localhost:3000";

  return (
    <main className="flex w-full max-w-5xl flex-col items-start justify-between gap-4">
      {(await isAuthenticated()) ? (
        <>
          <div className="flex w-full flex-col">
            <div>
              <p className="mb-8">Well, well, well, if it isn&apos;t...</p>

              <pre className="mt-4 rounded-sm bg-slate-950 p-4 font-mono text-sm text-cyan-200">
                {JSON.stringify(kindeUser, null, 2)}
              </pre>
            </div>
          </div>
          <ModeToggle />
          <LogoutLink
            postLogoutRedirectURL={redirectURL}
            className="inline-block text-blue-500 underline"
          >
            <Button variant={"destructive"}>Logout</Button>
          </LogoutLink>
        </>
      ) : (
        <div>Not Authenticated</div>
      )}
    </main>
  );
}
