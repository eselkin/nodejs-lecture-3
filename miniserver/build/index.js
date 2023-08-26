"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const argon2_1 = __importDefault(require("argon2"));
const db_1 = require("~/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const { PORT } = process.env;
// Check that if there is an environment variable to change the port that it's an integer
if (PORT && isNaN(parseInt(PORT))) {
    throw new Error("PORT must be an integer");
}
const port = parseInt(PORT || "3000");
// use static authenticate method of model in LocalStrategy
passport_1.default.use(new passport_local_1.Strategy((email, password, done) => {
    db_1.UserModel.findOne({ where: { email: email } }).then((user) => {
        if (!user) {
            return done(401, false, { message: "Incorrect Email or Password or Both" });
        }
        argon2_1.default.verify(user.hash, password).then((valid) => {
            return done(null, valid ? user : false, { message: "Incorrect Email or Password or Both" });
        }).catch((err) => {
            return done(err);
        });
    }).catch((err) => {
        return done(err);
    });
}));
// passport.serializeUser();
// passport.deserializeUser();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
