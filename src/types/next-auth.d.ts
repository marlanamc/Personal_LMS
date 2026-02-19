import { DefaultSession } from "next-auth";

export type UserRole = "student" | "teacher";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      username: string;
      mustChangePassword: boolean;
    };
  }

  interface User {
    id: string;
    role: UserRole;
    username: string;
    mustChangePassword: boolean;
    isMobile?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    username?: string;
    mustChangePassword?: boolean;
    isMobile?: boolean;
  }
}

