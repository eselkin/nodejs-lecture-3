"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const db_1 = require("~/db");
const { TOKEN_SECRET_KEY } = process.env;
if (!TOKEN_SECRET_KEY) {
    throw new Error("TOKEN_SECRET_KEY must be defined");
}
exports.local = passport_1.default.use(new passport_local_1.Strategy((email, password, done) => {
    db_1.UserModel.findOne({ where: { email: email } })
        .then((user) => {
        if (!user) {
            return done(401, false, {
                message: "Incorrect Email or Password or Both",
            });
        }
        argon2_1.default
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
}));
// @ts-ignore-next-line
passport_1.default.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, email: user.email });
    });
});
passport_1.default.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
exports.getToken = (user) => {
    return jsonwebtoken_1.default.sign(user, TOKEN_SECRET_KEY, { expiresIn: 3600 });
};
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: TOKEN_SECRET_KEY,
};
exports.jwtPassport = passport_1.default.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => {
    console.log("JWT payload:", jwt_payload);
    // @ts-ignore-next-line
    db_1.UserModel.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        else if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    });
}));
exports.verifyUser = passport_1.default.authenticate("jwt", { session: false });
