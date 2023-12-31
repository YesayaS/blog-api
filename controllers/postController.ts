import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createError from "http-errors";
import { Types } from "mongoose";

import Comment from "../models/comment";
import Post from "../models/post";
import User from "../models/user";

import {
  validatePostTitle,
  validatePostSubTitle,
  validatePostTitleImg,
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
    const post = await Post.findById(req.params.id)
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      })
      .populate("author", "username");

    if (!post) {
      res.status(404).json({ error: "Page not found" });
    }

    res.json({ post, success: true });
  }),
];

export const editPostGET = [
  asyncHandler(async function (req, res, next) {
    const post = await Post.findById(req.params.id)
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      })
      .populate("author", "username");

    if (
      post?.author._id.toString() !== (req.user as UserWithId)._id.toString()
    ) {
      throw createError(403, "Don't have permission to perform this action.");
    }

    if (!post) {
      res.status(404).json({ error: "Page not found" });
    }

    res.json({ post, success: true });
  }),
];

export const postPOST = [
  validatePostTitle(),
  validatePostSubTitle(),
  validatePostTitleImg(),
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
        sub_title: req.body.sub_title,
        title_img: req.body.title_img,
        content: req.body.content,
        comments: [],
        publication_date: new Date().toISOString(),
        author: (req.user as UserWithId)._id,
        is_published: req.body.is_published,
      });
      const result = await post.save();
      const id = result._id.toString();

      res.json({ msg: "Post created", id: id });
    }
  }),
];

export const postPUT = [
  validatePostTitle(),
  validatePostSubTitle(),
  validatePostTitleImg(),
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
          sub_title: req.body.sub_title,
          title_img: req.body.title_img,
          content: req.body.content,
          is_published: req.body.is_published,
        };
        const result = await Post.updateOne(
          { _id: req.params.id },
          { $set: updatedPostField }
        );

        res.json({ msg: "Post created", id: req.params.id });
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

      const isAuthorized =
        post.author._id.toString() === (req.user as UserWithId)._id.toString();

      if (!isAuthorized) {
        throw createError(403, "Don't have permission to perform this action.");
      }

      const result = await Post.findByIdAndDelete(req.params.id);

      res.json({ msg: "Post deleted", success: true });
    } catch (err) {
      return next(err);
    }
  }),
];

export const postsGET = [
  asyncHandler(async function (req, res, next) {
    try {
      const posts = await Post.find({ is_published: true })
        .select("-content -comments -is_published -__v")
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

export const myPostGET = [
  asyncHandler(async function (req, res, next) {
    const post = await Post.find({
      author: (req.user as UserWithId)._id,
    }).select(["-comments", "-title_img", "-content", "-author", "-__v"]);
    if (!post) createError(404);
    res.json({ posts: post });
  }),
];
