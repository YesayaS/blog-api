import { NextFunction, Request, Response } from "express";

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  console.log(`Request body : ${req.body}`);
  console.log(`Error message : ${err.message}`);

  next(err);
};

// error middleware
export const errorResponder = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header("Content-Type", "application/json");
  const status = err.status || 400;

  if (err.name === "CastError") {
    res.status(status).json({ error: `Invalid ${err.path}: ${err.value}` });
  }

  res.status(status).json({ error: err.message || "Something went wrong" });
};

// 404 middleware
export const invalidPathHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({ error: "Not found" });
};
