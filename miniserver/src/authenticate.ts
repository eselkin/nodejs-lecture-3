import argon2 from "argon2";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { RoleType, UserModel, UserType } from "~/db";
import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";

const { TOKEN_SECRET_KEY } = process.env;

if (!TOKEN_SECRET_KEY) {
  throw new Error("TOKEN_SECRET_KEY must be defined");
}

// This is a type signature that comes from passport-local ... only error is required, user and options are optional
export type LocalStrategyDoneCallback = (
  error: any,
  user?: any,
  options?: IVerifyOptions
) => void;

export const local = passport.use(
  new LocalStrategy(
    (email: string, password: string, done: LocalStrategyDoneCallback) => {
      UserModel.findOne({ where: { email: email } })
        .populate<{ roles: RoleType }>("roles")
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
          return done(err, false, { message: "Something went wrong" });
        });
    }
  )
);

// @ts-ignore-next-line
passport.serializeUser(function (user: UserType, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, email: user.email });
  });
});

passport.deserializeUser(function (user: UserType, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

export const getToken = (user: { id: string }) => {
  return jwt.sign(user, TOKEN_SECRET_KEY, { expiresIn: 3600 });
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: TOKEN_SECRET_KEY,
};

export const jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload:", jwt_payload);
    // @ts-ignore-next-line
    UserModel.findById(jwt_payload.id, async (err, user: UserType) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        const populatedUser = await user.populate<{ roles: RoleType }>("roles");
        return done(null, populatedUser);
      } else {
        return done(null, false);
      }
    });
  })
);

export const verifyUser = passport.authenticate("jwt", { session: false });
//xRoute (doesn't have req.user) -> verifyUser() -> yRoute (does have req.user)
export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(403).json({ message: "You are not authorized" });
  }
  // @ts-ignore-next-line
  if (req.user.roles.some((role: RoleType) => role.name === "admin")) {
    return next();
  }
};
