import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import createError from "http-errors";
import bcrypt from "bcryptjs";

import {
  validateSignupUsername,
  validateSignupPassword,
  validateSignupPasswordconfirm,
  validateSignupAdmin,
} from "../lib/validator";

import User from "../models/user";
import Passcode from "../models/passcode";

export const post_signup = [
  validateSignupUsername()
    .bail()
    .custom(async (username) => {
      const usernameTaken = await User.exists({
        username: username.toLowerCase(),
      });
      if (usernameTaken) {
        return Promise.reject("Username is already taken.");
      }
    }),
  validateSignupPassword(),
  validateSignupPasswordconfirm(),
  validateSignupAdmin(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = createError(400, errors.array()[0].msg);
      return next(err);
    } else {
      try {
        const passcode = await Passcode.findOne({}).exec();

        if (!passcode) {
          throw createError(500, "Internal error");
        }

        let isAdmin = req.body.admin === passcode.admin;

        if (req.body.admin && !isAdmin) {
          throw createError(400, "Wrong admin passcode");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
          username: req.body.username.toLowerCase(),
          password: hashedPassword,
          is_admin: isAdmin,
        });

        const result = await user.save();

        res.json({ msg: "Signup successful", success: true });
      } catch (err) {
        return next(err);
      }
    }
  }),
];
