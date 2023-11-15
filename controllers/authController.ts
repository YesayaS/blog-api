import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import passport from "passport";
import createError from "http-errors";
import jwt from "jsonwebtoken";
require("dotenv").config();

import { validateLoginUsername, validateLoginPassword } from "../lib/validator";

interface UserInterface {
  username: string;
  password: string;
  is_admin: boolean;
}

export const post_login = [
  validateLoginUsername(),
  validateLoginPassword(),
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
