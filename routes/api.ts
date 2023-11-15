import express, { Request, Response, NextFunction } from "express";
var router = express.Router();

import * as authController from "../controllers/authController";
import * as postController from "../controllers/postController";
import * as commentController from "../controllers/commentController";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ msg: "hi there!" });
});

router.post("/login", authController.post_login);
router.post("/signup", authController.post_signup);

// router.get("post/:id", postController.get_post);
// router.post("post/", postController.post_post);
// router.put("post/:id", postController.put_post);
// router.delete("post/:id", postController.delete_post);

// router.get("/posts", postController.get_posts);
// router.get("/posts/recent", postController.get_posts_recent);

// router.post("/comment", commentController.post_comment);

export default router;
