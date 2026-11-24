import jwt from "jsonwebtoken";
import type { Response } from "express";
import { COOKIE_NAME } from "../../shared/const";

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function setSessionCookie(res: Response, openId: string) {
  const token = jwt.sign({ sub: openId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_MS,
  });
}

export function verifySessionToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    return payload.sub;
  } catch {
    return null;
  }
}
