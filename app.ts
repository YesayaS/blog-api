import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
var cors = require("cors");

require("dotenv").config();

import * as errorHandler from "./lib/errorHandler";
import apiRouter from "./routes/api";
import { localAuth, jwtAuth } from "./lib/auth";

var app = express();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI || "";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

passport.use("local", localAuth);
passport.use("jwt", jwtAuth);
app.use(passport.initialize());

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next) {
  next(createError(404));
});

app.use(errorHandler.errorLogger);
app.use(errorHandler.errorResponder);
app.use(errorHandler.invalidPathHandler);

export default app;
