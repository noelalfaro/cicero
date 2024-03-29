// import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
// import { DrizzleAdapter } from "@auth/drizzle-adapter"; // Assuming you have this set up
// import { db } from "@/db"; // Assuming you have your database connection

// declare module "next-auth" {
//   interface User {
//     /** The user's id. */
//     id?: string;
//   }
// }

// export const authConfig = {
//   providers: [GitHub],
//   adapter: DrizzleAdapter(db),
//   callbacks: {
//     async session({ session, token, user }: any) {
//       // session.user.address is now a valid property, and will be type-checked
//       // in places like `useSession().data.user` or `auth().user`
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           id: user.id,
//         },
//       };
//     },
//   },
// };
// export const { handlers, auth, signOut } = NextAuth(authConfig);
