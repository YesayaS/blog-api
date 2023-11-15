import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createError from "http-errors";
import { Types } from "mongoose";

import Comment from "../models/comment";
import Post from "../models/post";
import User from "../models/user";

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
      throw next(err);
    }
  }),
];

export const postPOST = [
  validatePostTitle(),
  validatePostContent(),
  validatePostPrivate(),
  asyncHandler(async function (req, res, next) {
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

export const postPUT = [
  validatePostTitle(),
  validatePostContent(),
  validatePostPrivate(),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = createError(400, errors.array()[0].msg);
      return next(err);
    } else {
      try {
        const post = await Post.findById(req.params.id);
        if (
          post?.author._id.toString() !==
          (req.user as UserWithId)._id.toString()
        ) {
          throw createError(
            403,
            "Don't have permission to perform this action."
          );
        }
        const updatedPost = new Post({
          _id: req.params.id,
          title: req.body.title,
          content: req.body.content,
          comment: post?.comment,
          publication_date: post?.publication_date,
          author: post?.author,
          is_private: req.body.isprivate,
        });
        const result = await Post.findByIdAndUpdate(req.params.id, updatedPost);
        res.json({ msg: "Post updated", success: true });
      } catch (err) {
        return next(err);
      }
    }
  }),
];

// export const delete_post = asyncHandler(function (req, res, next) {
//   res.json({ msg: "delete_post" });
// });

// export const get_posts = asyncHandler(function (req, res, next) {
//   res.json({ msg: "get_posts" });
// });

// export const get_posts_recent = asyncHandler(function (req, res, next) {
//   res.json({ msg: "getget_posts_recent_posts" });
// });
