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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    console.info("🍀 Starting seed 🍀");
    console.info("🧻 Seeding roles 🧻");
    let roleUser = yield index_1.RoleModel.findOne({ where: { name: "user" } });
    let roleAdmin = yield index_1.RoleModel.findOne({ where: { name: "admin" } });
    if (!roleUser) {
        roleUser = yield index_1.RoleModel.create({ name: "user", level: 0 });
    }
    if (!roleAdmin) {
        roleAdmin = yield index_1.RoleModel.create({ name: "admin", level: 1 });
    }
    console.info("Seeding complete");
    process.exit(0); // everything is OK
});
seed().then().catch(console.error);
