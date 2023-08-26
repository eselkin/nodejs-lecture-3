import express from "express";
import dotenv from "dotenv";

import winston from "winston";
import { RoleType, UserType } from "./db";
import loginRouter from "./routes/login";
import authenticatedRouter from "./routes/authenticatedroute";

declare global {
  namespace Express {
    export interface Request {
      user?: Omit<UserType, "roles"> & { roles: RoleType[] };
    }
  }
}
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  // if we're in development output to the console
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

dotenv.config();

const app = express();

const { PORT } = process.env;

// Check that if there is an environment variable to change the port that it's an integer
if (PORT && isNaN(parseInt(PORT))) {
  throw new Error("PORT must be an integer");
}
const port = parseInt(PORT || "3000");

app.use("/login", loginRouter);
app.use("/authenticatedroute", authenticatedRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
