import { Request, Response, NextFunction } from "express";

// TODO: verify Supabase JWT
export const authMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next();
};
