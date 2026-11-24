import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, type User } from "../../drizzle/schema";
import { verifySessionToken } from "./session";
import { COOKIE_NAME } from "../../shared/const";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;
  const token = opts.req.cookies?.[COOKIE_NAME];

  if (token) {
    const openId = verifySessionToken(token);
    if (openId) {
      const [found] = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
      user = found ?? null;
    }
  }

  return { req: opts.req, res: opts.res, user };
}
