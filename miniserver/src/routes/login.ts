import { Request, Router } from "express";
import passport from "passport";
import { getToken } from "~/authenticate";

const router = Router();
// these routes are all prefixed by /login
// this route is /login/
router.post("/", passport.authenticate("local"), (req: Request, res) => {
  if (!req.user) {
    res.statusCode = 401;
    res.json({ success: false, status: "Login Unsuccessful!", err: "No user" });
    return;
  }
  const token = getToken({ id: req.user.id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
});

export default router;
