import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      mustChangePassword: boolean;
    };
  }

  interface User {
    id: string;
    username: string;
    mustChangePassword: boolean;
    isMobile?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    mustChangePassword?: boolean;
    isMobile?: boolean;
  }
}
