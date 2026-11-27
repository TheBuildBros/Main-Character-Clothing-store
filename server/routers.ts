import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "./_core/trpc";
import { db } from "./db";
import { users } from "../drizzle/schema";
import { issueOtp, verifyOtp } from "./_core/otp";
import { setSessionCookie } from "./_core/session";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminRouter } from "./admin";

const email = z.string().trim().toLowerCase().email();

const strongPassword = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Needs an uppercase letter")
  .regex(/[a-z]/, "Needs a lowercase letter")
  .regex(/[0-9]/, "Needs a number")
  .regex(/[^A-Za-z0-9]/, "Needs a symbol");

const otpCode = z.string().regex(/^\d{6}$/, "Enter the 6-digit code");

export const authRouter = router({
  me: publicProcedure.query(opts => opts.ctx.user),

  requestSignupOtp: publicProcedure
    .input(z.object({ email }))
    .mutation(async ({ input }) => {
      const [existing] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "An account with this email already exists." });
      }
      await issueOtp(input.email, "signup");
      return { success: true };
    }),

  register: publicProcedure
    .input(z.object({
      name: z.string().trim().min(2).max(80),
      email,
      phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number").optional(),
      password: strongPassword,
      otp: otpCode,
    }))
    .mutation(async ({ input, ctx }) => {
      await verifyOtp(input.email, "signup", input.otp);

      const [existing] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Email already registered." });

      const passwordHash = await bcrypt.hash(input.password, 12);
      const [user] = await db.insert(users).values({
        openId: crypto.randomUUID(),
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash,
        emailVerified: true,
        lastSignedIn: new Date(),
      }).returning();

      setSessionCookie(ctx.res, user.openId);
      return user;
    }),

  login: publicProcedure
    .input(z.object({ email, password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      const valid = user && (await bcrypt.compare(input.password, user.passwordHash));

      if (!user || !valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect email or password." });
      }

      await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));
      setSessionCookie(ctx.res, user.openId);
      return user;
    }),

  requestPasswordReset: publicProcedure
    .input(z.object({ email }))
    .mutation(async ({ input }) => {
      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (user) {
        try {
          await issueOtp(input.email, "reset");
        } catch (err) {
          if (!(err instanceof TRPCError && err.code === "TOO_MANY_REQUESTS")) throw err;
        }
      }
      return { success: true, message: "If that email exists, a code has been sent." };
    }),

  resetPassword: publicProcedure
    .input(z.object({ email, otp: otpCode, newPassword: strongPassword }))
    .mutation(async ({ input }) => {
      await verifyOtp(input.email, "reset", input.otp);

      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (!user) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid request." });

      const passwordHash = await bcrypt.hash(input.newPassword, 12);
      await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));
      return { success: true };
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
    return { success: true } as const;
  }),
});

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
