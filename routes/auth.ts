import express, { Request, Response, NextFunction } from "express";
var router = express.Router();

import * as authController from "../controllers/authController";

router.get("/", function (req, res, next) {
  res.json({ msg: "hi there!" });
});

router.get("/login", authController.get_login);
router.post("/login", authController.post_login);

router.post("/signup", authController.post_signup);

export default router;
