import { users } from "@/db/schema/users";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  // check if user exists
  const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
  const db = drizzle(sql);
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // When I get a secure connection, you have to verify wether you can get the user info from kind while in localhost
  // currently, I get a message from kind saying I have to set the correct callback
  // Allowed callback URLs
  // https://cicero-coral.vercel.app/api/auth/kinde_callback
  // Allowed logout redirect URLs
  // https://cicero-coral.vercel.app
  // To mitigate this, am just gonna user a user object with my info

  // const user = {
  //   family_name: "Alfaro",
  //   given_name: "Noel",
  //   picture: "https://avatars.githubusercontent.com/u/56320635?v=4",
  //   email: "ndalfaro333@gmail.com",
  //   id: "kp_6106225af72a4ab49924fe041daf90fb",
  // };
  console.log(user);
  const redirectURL =
    process.env.NODE_ENV === "production"
      ? "https://cicero-coral.vercel.app/dashboard"
      : "http://localhost:3000/dashboard";

  if (!user || !user.id || !user.email) {
    return NextResponse.json(
      { error: "User not found or missing ID" },
      { status: 401 },
    );
  }

  // console.log("you've reached your destination");

  // if (!user || !user.id || !user.email) {
  //   return NextResponse.json(
  //     { error: "User not found or missing ID" },
  //     { status: 401 },
  //   ); // Adjust error handling as needed
  // }
  // Find if a user exists
  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  // console.log(dbUser);
  // If the user doesn't exist, add them to the database
  if (dbUser.length === 0) {
    console.log(dbUser);
    await db.insert(users).values({
      id: user.id.toString(),
      firstName: user.given_name,
      lastName: user.family_name,
      email: user.email,
      image: user.picture,
    });
  }
  // console.log("route successfully ran");
  return redirect(redirectURL);
}

// Allowed callback URLs
// https://cicero-coral.vercel.app/api/auth/kinde_callback
// Allowed logout redirect URLs
// https://cicero-coral.vercel.app
