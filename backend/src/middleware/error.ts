import { Request, Response, NextFunction } from "express";

// TODO: error handler middleware
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(500).json({ error: err?.message || "Internal server error" });
};
