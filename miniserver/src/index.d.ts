import { UserType } from "./db";

// export {}; <-- you don't need this

declare global {
  namespace Express {
    export interface Request {
      user?: UserType;
    }
  }
}
