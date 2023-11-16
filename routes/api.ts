import passport from "passport";
import express, { Request, Response, NextFunction } from "express";
var router = express.Router();

import * as authController from "../controllers/authController";
import * as postController from "../controllers/postController";
import * as userController from "../controllers/userController";
import * as commentController from "../controllers/commentController";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ msg: "hi there!" });
});

router.post("/login", authController.loginPOST);
router.post("/signup", userController.signupPOST);

router.get("/post/:id", postController.postGET);
router.post(
  "/post",
  passport.authenticate("jwt", { session: false }),
  postController.postPOST
);
router.put(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  postController.postPUT
);
router.delete(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  postController.postDELETE
);

router.get("/posts", postController.postsGET);
// router.get("/posts/recent", postController.get_posts_recent);

router.post(
  "/post/:postid/comment",
  passport.authenticate("jwt", { session: false }),
  commentController.commentPOST
);

export default router;
