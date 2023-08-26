import { RoleType, UserType } from "./db";
declare global {
  namespace Express {
    export interface Request {
      user?: Omit<UserType, "roles"> & { roles: RoleType[] };
    }
  }
}
