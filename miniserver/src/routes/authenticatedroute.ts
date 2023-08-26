import { Router } from "express";
import { verifyAdmin, verifyUser } from "~/authenticate";
import { UserModel } from "~/db";

const router = Router();

router.get("/user", verifyUser, async (req, res) => {
  res.send(req.user);
});

router.get("/users", verifyUser, verifyAdmin, async (req, res) => {
  const users = await UserModel.find().populate("roles");
  return res.json(users);
});

export default router;
