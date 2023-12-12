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

// AUTH
router.post("/login", authController.loginPOST);
router.post("/signup", userController.signupPOST);

// POST
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

// ALL POST
router.get("/posts", postController.postsGET);

// COMMENT
router.post(
  "/post/:postid/comment",
  passport.authenticate("jwt", { session: false }),
  commentController.commentPOST
);
router.put(
  "/post/:postid/comment/:commentid",
  passport.authenticate("jwt", { session: false }),
  commentController.commentPUT
);
router.delete(
  "/post/:postid/comment/:commentid",
  passport.authenticate("jwt", { session: false }),
  commentController.commentDELETE
);

export default router;
