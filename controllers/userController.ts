import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
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

export const signupPOST = [
  validateSignupUsername(),
  validateSignupPassword(),
  validateSignupPasswordconfirm(),
  validateSignupAdmin(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(createError(400, errors.array()[0].msg));
    } else {
      const usernameTaken = await User.exists({
        username: req.body.username.toLowerCase(),
      });
      if (usernameTaken) {
        return next(createError(409, "Username already taken"));
      }

      let isAdmin = false;

      if (req.body.admin) {
        const passcode = await Passcode.findOne({}).exec();

        if (!passcode) {
          return next(createError(500, "Internal error"));
        }

        isAdmin = req.body.admin === passcode.admin;

        if (req.body.admin && !isAdmin) {
          return next(createError(401, "Invalid admin passcode"));
        }
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = new User({
        username: req.body.username.toLowerCase(),
        password: hashedPassword,
        is_admin: isAdmin,
      });

      const result = await user.save();

      res.json({ message: "Signup successful" });
    }
  }),
];
