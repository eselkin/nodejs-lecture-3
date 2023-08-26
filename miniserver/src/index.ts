import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import {
  IVerifyOptions,
  Strategy as LocalStrategy,
  VerifyFunction,
} from "passport-local";
import argon2 from "argon2";
import { UserModel } from "~/db";
dotenv.config();

const app = express();

const { PORT } = process.env;

// Check that if there is an environment variable to change the port that it's an integer
if (PORT && isNaN(parseInt(PORT))) {
  throw new Error("PORT must be an integer");
}
const port = parseInt(PORT || "3000");

// This is a type signature that comes from passport-local ... only error is required user and options are optional
export type LocalStrategyDoneCallback = (
  error: any,
  user?: any,
  options?: IVerifyOptions
) => void;

// use static authenticate method of model in LocalStrategy
passport.use(
  new LocalStrategy(
    (email: string, password: string, done: LocalStrategyDoneCallback) => {
      UserModel.findOne({ where: { email: email } })
        .then((user) => {
          if (!user) {
            return done(401, false, {
              message: "Incorrect Email or Password or Both",
            });
          }
          argon2
            .verify(user.hash, password)
            .then((valid) => {
              return done(null, valid ? user : false, {
                message: "Incorrect Email or Password or Both",
              });
            })
            .catch((err) => {
              return done(err);
            });
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

// passport.serializeUser();
// passport.deserializeUser();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
