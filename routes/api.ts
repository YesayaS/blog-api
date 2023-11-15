import passport from "passport";
import express, { Request, Response, NextFunction } from "express";
var router = express.Router();

import * as authController from "../controllers/authController";
import * as postController from "../controllers/postController";
import * as userController from "../controllers/userController";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ msg: "hi there!" });
});

router.post("/login", authController.loginPOST);
router.post("/signup", userController.signupPOST);

// router.get("post/:id", postController.postGET);
router.post(
  "/post",
  passport.authenticate("jwt", { session: false }),
  postController.postPOST
);
// router.put("post/:id", postController.put_post);
// router.delete("post/:id", postController.delete_post);

// router.get("/posts", postController.get_posts);
// router.get("/posts/recent", postController.get_posts_recent);

// router.post("/comment", commentController.post_comment);

export default router;
