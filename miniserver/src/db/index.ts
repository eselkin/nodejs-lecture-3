import { Types, Schema, model, connect, Document } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const makeConnection = async () => {
  await connect(process.env.MONGO_URL || "", {});
};

const UserSchema = new Schema({
  email: String,
  password: String,
  roles: { type: Schema.Types.ObjectId, ref: "Role" },
});

export type UserType = Document & {
  email: string;
  password: string;
  roles: string[];
};

const RoleSchema = new Schema({
  name: String,
  level: Number,
});

export type RoleType = Document & {
  name: string;
  level: number;
};

export const UserModel = model<UserType>("User", UserSchema); // makes a collection called users (plural, lowercase)
export const RoleModel = model<RoleType>("Role", RoleSchema, "Role"); // makes a collection called Role (singular, uppercase because we tell it what to call it)
// The Role on line 6, is related to the model name -- the first argument here

makeConnection().then().catch(console.error);
