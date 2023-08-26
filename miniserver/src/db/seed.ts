import { UserModel, RoleModel } from "./index";

const seed = async () => {
  console.info("🍀 Starting seed 🍀");
  console.info("🧻 Seeding roles 🧻");

  let roleUser = await RoleModel.findOne({ where: { name: "user" } });
  let roleAdmin = await RoleModel.findOne({ where: { name: "admin" } });

  if (!roleUser) {
    roleUser = await RoleModel.create({ name: "user", level: 0 });
  }
  if (!roleAdmin) {
    roleAdmin = await RoleModel.create({ name: "admin", level: 10 });
  }

  console.info("Seeding complete");

  process.exit(0); // everything is OK
};

seed().then().catch(console.error);
