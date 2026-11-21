import { Router, Request, Response } from "express";
import { validatePhone } from "../lib/validation";
import { supabaseAdmin } from "../lib/supabase";

const router = Router();

/**
 * POST /api/auth/login-by-phone
 * Body: { phone: string, password: string }
 *
 * Validates the phone number using shared rules and returns 400 for invalid input
 * before any database query is executed.
 * Note: Password strength is not checked on login, but password is required.
 */
router.post("/login-by-phone", async (req: Request, res: Response) => {
  // TODO: Add rate limiting here (e.g. rate-limiter-flexible or express-rate-limit)
  // to mitigate brute-force attempts and phone enumeration.

  const { phone, password } = req.body || {};

  if (!password || typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({ error: "Password is required." });
  }

  if (!phone || typeof phone !== "string") {
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
  }

  // Validate phone with the exact shared rules before querying database
  const phoneResult = validatePhone(phone);
  if (!phoneResult.valid) {
    return res.status(400).json({ error: phoneResult.error });
  }

  const normalizedPhone = phoneResult.normalized!;

  try {
    // Look up profiles by phone using service role client
    // Support matching both normalized 10-digit and legacy +91 format
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .or(`phone.eq.${normalizedPhone},phone.eq.+91${normalizedPhone}`)
      .maybeSingle();

    if (error || !profile) {
      return res.status(401).json({ error: "Email/phone or password is incorrect." });
    }

    return res.json({ email: profile.email });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
