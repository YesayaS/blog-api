import { body } from "express-validator";

export const validateLoginUsername = () =>
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username must be filled")
    .custom((value) => !/\s/.test(value))
    .escape();

export const validateLoginPassword = () =>
  body("password", "Password must be at least 6 characters")
    .notEmpty()
    .escape();

export const validateSignupUsername = () =>
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .custom((value) => !/\s/.test(value))
    .withMessage("Username should not have a space")
    .isAlphanumeric()
    .withMessage("Username should not have a special character")
    .escape();

export const validateSignupPassword = () =>
  body("password", "Password must be at least 6 characters")
    .isLength({ min: 6 })
    .escape();

export const validateSignupPasswordconfirm = () =>
  body("password-confirm", "Confirmation password must same as password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .escape();

export const validateSignupAdmin = () => body("admin").trim().escape();
