import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import passport from "passport";
import bcrypt from "bcryptjs";
import createError from "http-errors";
import jwt from "jsonwebtoken";
require("dotenv").config();

import User from "../models/user";
import Passcode from "../models/passcode";

interface UserInterface {
  username: string;
  password: string;
  is_admin: boolean;
}

const validate_username = () =>
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .custom((value) => !/\s/.test(value))
    .withMessage("Username should not have a space")
    .isAlphanumeric()
    .withMessage("Username should not have a special character")
    .escape();

const validate_password = () =>
  body("password", "Password must be at least 6 characters")
    .isLength({ min: 6 })
    .escape();

const validate_passwordconfirm = () =>
  body("password-confirm", "Confirmation password must same as password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .escape();

const validate_admin = () => body("admin").trim().escape();

export const post_login = [
  validate_username(),
  validate_password(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = createError(400, errors.array()[0].msg);
      return next(err);
    } else {
      passport.authenticate(
        "local",
        { session: false },
        (err: Error, user: UserInterface, info: any) => {
          if (err || !user) {
            return res
              .status(400)
              .json({ message: "Login failed", success: false });
          }

          const token = jwt.sign(
            { username: user.username, is_admin: user.is_admin },
            "your_secret_key",
            { expiresIn: 1 * 24 * 60 * 6000 }
          );
          return res.json({ token, success: true });
        }
      )(req, res, next);
    }
  }),
];

export const post_signup = [
  validate_username()
    .bail()
    .custom(async (username) => {
      const usernameTaken = await User.exists({
        username: username.toLowerCase(),
      });
      if (usernameTaken) {
        return Promise.reject("Username is already taken.");
      }
    }),
  validate_password(),
  validate_passwordconfirm(),
  validate_admin(),

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
