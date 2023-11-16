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
        comment: [],
        publication_date: new Date().toISOString(),
        author: (req.user as UserWithId)._id,
        is_published: req.body.ispublished,
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
        const updatedPostField = {
          title: req.body.title,
          content: req.body.content,
          is_published: req.body.ispublished,
        };
        const result = await Post.updateOne(
          { _id: req.params.id },
          { $set: updatedPostField }
        );
        res.json({ msg: "Post updated", success: true });
      } catch (err) {
        return next(err);
      }
    }
  }),
];

export const postDELETE = [
  asyncHandler(async function (req, res, next) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) throw createError(405, "Method Not Allowed");
      if (
        post?.author._id.toString() !== (req.user as UserWithId)._id.toString()
      ) {
        throw createError(403, "Don't have permission to perform this action.");
      }
      const result = await Post.findByIdAndDelete(req.params.id);
      res.json({ msg: "Post deleted", success: true });
    } catch (err) {
      return next(err);
    }
  }),
];

export const get_posts = [
  asyncHandler(async function (req, res, next) {
    try {
      const posts = await Post.find({ is_published: true })
        .select("title content publication_date author")
        .sort({ publication_date: -1 })
        .limit(10)
        .populate("author", "username");

      if (posts) {
        res.json({ posts, success: true });
      }
    } catch (err) {
      throw next(err);
    }
  }),
];
