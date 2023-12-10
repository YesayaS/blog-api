import { body } from "express-validator";

// LOGIN //
export const validateLoginUsername = () =>
  body("username")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Username is required.")
    .isString()
    .withMessage("type error")
    .custom((value) => !/\s/.test(value))
    .escape();
export const validateLoginPassword = () =>
  body("password")
    .notEmpty()
    .withMessage('"Password is required."')
    .isString()
    .withMessage("type error")
    .escape();
// LOGIN //

// SIGNUP //
export const validateSignupUsername = () =>
  body("username")
    .trim()
    .toLowerCase()
    .isLength({ min: 3 })
    .withMessage("Username should be at least 3 characters")
    .custom((value) => !/\s/.test(value))
    .withMessage("Username should not have a space")
    .isAlphanumeric()
    .withMessage("Username should not have a special character")
    .custom((username) => {
      const alphabetRegex = /^[a-z]/;
      return alphabetRegex.test(username);
    })
    .withMessage("Username should starts with a letter of the alphabet")
    .escape();
export const validateSignupPassword = () =>
  body("password", "Password should be at least 6 characters")
    .isLength({ min: 6 })
    .escape();
export const validateSignupPasswordconfirm = () =>
  body("confirm_password", "Password confirmation must match the password.")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .escape();
export const validateSignupAdmin = () => body("admin").trim().escape();
// SIGNUP //

// POST //
export const validatePostTitle = () =>
  body("title", "Title cannot be empty").notEmpty().isString().escape();
export const validatePostSubTitle = () =>
  body("sub_title", "Subtitle is not string").isString().escape();
export const validatePostTitleImg = () =>
  body("title_img", "Image URL is not string").isString().escape();
export const validatePostContent = () =>
  body("content", "Content cannot be empty").notEmpty().isString().escape();
export const validatePostPrivate = () =>
  body("ispublished", "Published Type Error").isBoolean().escape();
// POST //

// COMMENT //
export const validateCommentContent = () =>
  body("content", "Comment cannot be empty").notEmpty().isString().escape();
// COMMENT //
