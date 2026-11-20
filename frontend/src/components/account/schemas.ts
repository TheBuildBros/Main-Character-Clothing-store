import { z } from "zod";
import {
  validateEmail,
  validatePhone,
  validateUsername,
  validatePassword,
  validateLoginIdentifier,
  normalizePhone,
} from "@/lib/validation";

export { normalizePhone };

// ================================================================
// LOGIN SCHEMA
// ================================================================
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone number is required.")
    .superRefine((val, ctx) => {
      const res = validateLoginIdentifier(val);
      if (!res.valid && res.error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: res.error,
        });
      }
    }),
  // On login: only check that password is not empty (no strength rules)
  password: z.string().min(1, "Password is required."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ================================================================
// SIGNUP SCHEMA
// ================================================================
export const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required.")
      .superRefine((val, ctx) => {
        const res = validateUsername(val);
        if (!res.valid && res.error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: res.error,
          });
        }
      }),
    phone: z
      .string()
      .min(1, "Enter a valid 10-digit mobile number.")
      .superRefine((val, ctx) => {
        const res = validatePhone(val);
        if (!res.valid && res.error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: res.error,
          });
        }
      }),
    email: z
      .string()
      .min(1, "Email is required.")
      .superRefine((val, ctx) => {
        const res = validateEmail(val);
        if (!res.valid && res.error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: res.error,
          });
        }
      }),
    password: z.string().min(1, "Password is required."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .superRefine((data, ctx) => {
    // Validate password with context if non-empty
    if (data.password && data.password.length > 0) {
      const passRes = validatePassword(data.password, {
        username: data.username,
        email: data.email,
      });
      if (!passRes.valid && passRes.error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: passRes.error,
        });
      }
    }

    // Confirm password match
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type SignupFormData = z.infer<typeof signupSchema>;
