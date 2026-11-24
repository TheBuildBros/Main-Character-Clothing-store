import crypto from "crypto";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../db";
import { otpCodes } from "../../drizzle/schema";
import { sendOtpEmail } from "./mailer";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

type Purpose = "signup" | "reset";

function generateCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export async function issueOtp(email: string, purpose: Purpose) {
  const [last] = await db
    .select()
    .from(otpCodes)
    .where(and(eq(otpCodes.email, email), eq(otpCodes.purpose, purpose)))
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  if (last && Date.now() - last.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Please wait a minute before requesting another code.",
    });
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);

  await db.insert(otpCodes).values({
    email,
    purpose,
    codeHash,
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  await sendOtpEmail(email, code, purpose);
}

export async function verifyOtp(email: string, purpose: Purpose, code: string) {
  const [row] = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.email, email),
        eq(otpCodes.purpose, purpose),
        isNull(otpCodes.usedAt),
      ),
    )
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  if (!row || row.expiresAt.getTime() < Date.now()) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Code expired or not found. Request a new one.",
    });
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many wrong attempts. Request a new code.",
    });
  }

  const valid = await bcrypt.compare(code, row.codeHash);

  if (!valid) {
    await db
      .update(otpCodes)
      .set({ attempts: row.attempts + 1 })
      .where(eq(otpCodes.id, row.id));
    throw new TRPCError({ code: "BAD_REQUEST", message: "Incorrect code." });
  }

  await db
    .update(otpCodes)
    .set({ usedAt: new Date() })
    .where(eq(otpCodes.id, row.id));
}
