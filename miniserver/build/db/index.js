"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = exports.UserModel = exports.RoleSchema = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const makeConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connect)(process.env.MONGO_URL || "", {});
});
exports.UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    hash: String,
    roles: { type: mongoose_1.Schema.Types.ObjectId, ref: "Role" },
});
exports.RoleSchema = new mongoose_1.Schema({
    name: String,
    level: Number,
});
exports.UserModel = (0, mongoose_1.model)("User", exports.UserSchema); // makes a collection called users (plural, lowercase)
exports.RoleModel = (0, mongoose_1.model)("Role", exports.RoleSchema, "Role"); // makes a collection called Role (singular, uppercase because we tell it what to call it)
// The Role on line 6, is related to the model name -- the first argument here
makeConnection().then().catch(console.error);
