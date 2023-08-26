"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston_1.default.transports.File({ filename: "error.log", level: "error" }),
        new winston_1.default.transports.File({ filename: "combined.log" }),
    ],
});
if (process.env.NODE_ENV !== "production") {
    // if we're in development output to the console
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
dotenv_1.default.config();
const app = (0, express_1.default)();
const { PORT } = process.env;
// Check that if there is an environment variable to change the port that it's an integer
if (PORT && isNaN(parseInt(PORT))) {
    throw new Error("PORT must be an integer");
}
const port = parseInt(PORT || "3000");
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
