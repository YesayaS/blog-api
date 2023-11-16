import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import createError from "http-errors";
import { Types } from "mongoose";

import Comment from "../models/comment";
import Post from "../models/post";

import { validateCommentContent } from "../lib/validator";

type UserWithId = {
  _id: Types.ObjectId;
  username: string;
  password: string;
  is_admin: boolean;
  __v: number;
};

export const commentPOST = [
  validateCommentContent(),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = createError(400, errors.array()[0].msg);
      return next(err);
    } else {
      const post = await Post.findById(req.params.postid);

      if (!post) {
        throw createError(405, "Method Not Allowed");
      }
      try {
        const comment = new Comment({
          content: req.body.content,
          date: new Date().toISOString(),
          author: (req.user as UserWithId)._id,
        });

        const commentResult = await comment.save();

        const post = await Post.updateOne(
          { _id: req.params.postid },
          { $push: { comments: commentResult._id } }
        );

        res.json({ msg: "Comment created", success: true });
      } catch (err) {
        next(err);
      }
    }
  }),
];

export const commentPUT = [
  validateCommentContent(),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = createError(400, errors.array()[0].msg);
      return next(err);
    } else {
      try {
        const comment = await Comment.findOne({
          _id: req.params.postid,
          comments: req.params.commentid,
        });

        if (!comment) {
          throw createError(405, "Method Not Allowed");
        }

        const isAuthorized =
          comment.author._id.toString() ===
          (req.user as UserWithId)._id.toString();

        if (!isAuthorized) {
          throw createError(
            403,
            "Don't have permission to perform this action."
          );
        }

        const updatedComment = {
          content: req.body.content,
        };

        const result = await Comment.updateOne(
          { _id: req.params.id },
          { $set: updatedComment }
        );

        res.json({ msg: "Post updated", success: true });
      } catch (err) {
        return next(err);
      }
    }
  }),
];

export const commentDELETE = [
  asyncHandler(async function (req, res, next) {
    try {
      const comment = await Comment.findById(req.params.commentid);

      if (!comment) {
        throw createError(405, "Method Not Allowed");
      }

      const isAuthorized =
        comment.author._id.toString() ===
        (req.user as UserWithId)._id.toString();

      if (!isAuthorized) {
        throw createError(403, "Don't have permission to perform this action.");
      }

      const postResult = await Post.updateOne(
        { _id: req.params.postid },
        { $pull: { comments: req.params.commentid } }
      );

      const commentResult = await Comment.findByIdAndDelete(
        req.params.commentid
      );

      res.json({ msg: "Comment deleted", success: true });
    } catch (err) {
      next(err);
    }
  }),
];
