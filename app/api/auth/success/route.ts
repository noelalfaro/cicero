import { users } from "@/db/schema/users";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Ignore: this is just an npm script candidate
// // "db:migrate": "tsx ./db/index.ts",

export async function GET(request: Request) {
  // check if user exists
  const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
  const db = drizzle(sql);
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(user);

  if (!user || !user.id || !user.email) {
    return NextResponse.json(
      { error: "User not found or missing ID" },
      { status: 401 },
    );
  }

  console.log("you've reached your destination");

  if (!user || !user.id || !user.email) {
    return NextResponse.json(
      { error: "User not found or missing ID" },
      { status: 401 },
    ); // Adjust error handling as needed
  }
  // Find if a user exists
  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  console.log(dbUser);
  // If the user doesn't exist, add them to the database
  if (dbUser.length === 0) {
    await db.insert(users).values({
      id: user.id.toString(),
      firstName: user.given_name,
      lastName: user.family_name,
      email: user.email,
      image: user.picture,
    });
  }
  console.log("route successfully ran");
  return redirect("http://localhost:3000/dashboard");
}
