import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createError from "http-errors";
import { Types } from "mongoose";

import Post from "../models/post";
import Comment from "../models/comment";

import {
  validatePostTitle,
  validatePostContent,
  validatePostPrivate,
} from "../lib/validator";

type UserWithId = {
  _id: Types.ObjectId;
  username: string;
  password: string;
  is_admin: boolean;
  __v: number;
};

export const postGET = [
  asyncHandler(async function (req, res, next) {
    try {
      const post = await Post.findById(req.params.id)
        .populate("comment")
        .populate("author", "username");

      if (post) {
        res.json({ post, success: true });
      }
    } catch (err) {
      throw createError(404);
    }
  }),
];

export const postPOST = [
  validatePostTitle(),
  validatePostContent(),
  validatePostPrivate(),
  asyncHandler(async function (req, res, next) {
    console.log(req.user);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = createError(400, errors.array()[0].msg);
      return next(err);
    } else {
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        comment: [new Comment()],
        publication_date: new Date().toISOString(),
        author: (req.user as UserWithId)._id,
        is_private: req.body.isprivate,
      });
      const result = await post.save();
      res.json({ msg: "Post created", success: true });
    }
  }),
];

// export const put_post = asyncHandler(function (req, res, next) {
//   res.json({ msg: "put_post" });
// });

// export const delete_post = asyncHandler(function (req, res, next) {
//   res.json({ msg: "delete_post" });
// });

// export const get_posts = asyncHandler(function (req, res, next) {
//   res.json({ msg: "get_posts" });
// });

// export const get_posts_recent = asyncHandler(function (req, res, next) {
//   res.json({ msg: "getget_posts_recent_posts" });
// });
