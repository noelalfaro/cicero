// import { auth, signOut } from "@/auth";
import SignOutButton from "@/app/my-profile/SignOutButton";

export default async function Page() {
  // const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      {/* <SignOutButton
        signOut={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      /> */}
      profile
    </main>
  );
}
