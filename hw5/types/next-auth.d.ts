import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userId: string;
    } & DefaultSession["user"]
  }

  interface User {
    userId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    providerId?: string;
    userId?: string;
    userMongoId?: string; // MongoDB _id
  }
}

