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

export const loginPOST = [
  validateLoginUsername(),
  validateLoginPassword(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    } else {
      passport.authenticate(
        "local",
        { session: false },
        (err: Error, user: UserInterface, info: any) => {
          if (err || !user) {
            return next(createError(401, "Invalid username or password"));
          }

          const tokenExpires = 24 * 60 * 60; // (h * m * s)

          const token = jwt.sign(
            { username: user.username },
            "your_secret_key",
            { expiresIn: tokenExpires }
          );

          return res.json({ token: token });
        }
      )(req, res, next);
    }
  }),
];
