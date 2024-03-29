import { db } from "@/db";
import { users } from "@/db/schema/users";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  // check if user exists
  // const { getUser } = getKindeServerSession();
  // const user = await getUser();
  // // const { orgCode } = await getOrganization();
  console.log("testing");
  // if (!user || !user.id || !user.email) {
  //   return NextResponse.json(
  //     { error: "User not found or missing ID" },
  //     { status: 401 },
  //   ); // Adjust error handling as needed
  // }
  // const dbUser = await db.select().from(users).where(eq(users.id, user.id));
  // // if (dbUser) console.log("we got the user");
  // console.log(dbUser);

  // if (!dbUser) {
  //   await db.insert(users).values({
  //     id: user.id,
  //     firstName: user.given_name,
  //     lastName: user.family_name,
  //     email: user.email,
  //     image: user.picture,
  //   });
  // }
  // console.log("route successfully ran");
  // return redirect("http://localhost:3000/dashboard");
}
