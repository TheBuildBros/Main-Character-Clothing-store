"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import {
  loginSchema,
  signupSchema,
  normalizePhone,
  type LoginFormData,
  type SignupFormData,
} from "./schemas";

const REDIRECT_TARGET = "/collections";
const OTP_PROVIDER: "none" | "whatsapp" | "sms" = "none";
// Set to "whatsapp" or "sms" once an OTP provider is chosen. WhatsApp authentication messages are paid per message (about ₹0.115 each in India). Email verification is free and is used now.

export default function AuthForms() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Signup Form
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    reset: resetSignup,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setFormError(null);
    setFormSuccess(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    resetLogin();
    resetSignup();
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setFormError(null);
    setFormSuccess(null);

    const { identifier, password } = data;

    try {
      if (identifier.includes("@")) {
        // Email login directly via Supabase Auth
        const { error } = await supabase.auth.signInWithPassword({
          email: identifier.trim(),
          password,
        });

        if (error) {
          setFormError("Email/phone or password is incorrect.");
          return;
        }

        router.push(REDIRECT_TARGET);
      } else {
        // Phone login via Express backend lookup
        const normalizedPhone = normalizePhone(identifier);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

        let email: string | null = null;
        try {
          const response = await fetch(`${apiUrl}/api/auth/login-by-phone`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: normalizedPhone,
              password,
            }),
          });

          if (!response.ok) {
            setFormError("Email/phone or password is incorrect.");
            return;
          }

          const resData = await response.json();
          email = resData.email;
        } catch {
          setFormError("Email/phone or password is incorrect.");
          return;
        }

        if (!email) {
          setFormError("Email/phone or password is incorrect.");
          return;
        }

        // Complete sign in with resolved email and password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setFormError("Email/phone or password is incorrect.");
          return;
        }

        router.push(REDIRECT_TARGET);
      }
    } catch {
      setFormError("Email/phone or password is incorrect.");
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    setFormError(null);
    setFormSuccess(null);

    const { username, phone, email, password } = data;
    const normalizedPhone = normalizePhone(phone);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
            phone: normalizedPhone,
          },
        },
      });

      if (authError) {
        const errMsg = authError.message.toLowerCase();
        if (
          errMsg.includes("already registered") ||
          errMsg.includes("already in use") ||
          errMsg.includes("unique") ||
          errMsg.includes("duplicate")
        ) {
          setFormError("Username or phone number already in use.");
        } else {
          setFormError(authError.message || "Failed to create account. Please try again.");
        }
        return;
      }

      // Check if email confirmation is required or session is established
      if (authData.session) {
        router.push(REDIRECT_TARGET);
      } else {
        setFormSuccess("Check your email to confirm your account.");
      }
    } catch {
      setFormError("Failed to create account. Please try again.");
    }
  };

  const isSubmitting = isLoginSubmitting || isSignupSubmitting;

  return (
    <div className="w-full max-w-[420px] bg-[#132B4F] rounded-2xl p-6 sm:p-8 border border-[#C9A46A]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Header Eyebrow & Title */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C9A46A] block">
          MAINCHARACTER
        </span>
        <h1 className="text-[32px] font-extrabold text-[#F5EFE0] tracking-tight leading-tight mt-1">
          {mode === "login" ? "Log in" : "Create account"}
        </h1>
      </div>

      {/* Tabs / Switcher */}
      <div
        className="flex items-center gap-6 border-b border-[#C9A46A]/20 pb-3 mb-6"
        role="tablist"
        aria-label="Authentication mode"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          onClick={() => switchMode("login")}
          className={`relative pb-1 text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer ${
            mode === "login"
              ? "text-[#F5EFE0]"
              : "text-[#F5EFE0]/65 hover:text-[#F5EFE0]"
          }`}
        >
          Log in
          {mode === "login" && (
            <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-[#C9A46A]" />
          )}
        </button>

        <span className="text-[#F5EFE0]/30 select-none">|</span>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          onClick={() => switchMode("signup")}
          className={`relative pb-1 text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer ${
            mode === "signup"
              ? "text-[#F5EFE0]"
              : "text-[#F5EFE0]/65 hover:text-[#F5EFE0]"
          }`}
        >
          Sign up
          {mode === "signup" && (
            <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-[#C9A46A]" />
          )}
        </button>
      </div>

      {/* Global Alerts */}
      {formError && (
        <div
          role="alert"
          className="mb-5 p-3 rounded-lg bg-[#F2B8B5]/10 border border-[#F2B8B5]/30 text-[#F2B8B5] text-xs leading-relaxed"
        >
          {formError}
        </div>
      )}

      {formSuccess && (
        <div
          role="status"
          className="mb-5 p-3 rounded-lg bg-[#C9A46A]/10 border border-[#C9A46A]/30 text-[#C9A46A] text-xs leading-relaxed font-medium"
        >
          {formSuccess}
        </div>
      )}

      {/* LOGIN FORM */}
      {mode === "login" && (
        <form
          onSubmit={handleSubmitLogin(onLoginSubmit)}
          noValidate
          className="space-y-4"
        >
          {/* Email or Phone */}
          <div>
            <label
              htmlFor="login-identifier"
              className="block text-xs font-medium text-[#C9A46A] tracking-wider uppercase mb-1.5"
            >
              Email or phone number
            </label>
            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              placeholder="name@example.com or 9876543210"
              aria-describedby={loginErrors.identifier ? "login-identifier-error" : undefined}
              {...registerLogin("identifier")}
              className="w-full bg-[#0B1F3A] border border-[#C9A46A]/40 text-[#F5EFE0] placeholder-[#F5EFE0]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A46A] focus-visible:ring-1 focus-visible:ring-[#C9A46A] transition-colors"
            />
            {loginErrors.identifier && (
              <p
                id="login-identifier-error"
                role="alert"
                className="text-xs text-[#F2B8B5] mt-1.5"
              >
                {loginErrors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-medium text-[#C9A46A] tracking-wider uppercase mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-describedby={loginErrors.password ? "login-password-error" : undefined}
                {...registerLogin("password")}
                className="w-full bg-[#0B1F3A] border border-[#C9A46A]/40 text-[#F5EFE0] placeholder-[#F5EFE0]/30 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#C9A46A] focus-visible:ring-1 focus-visible:ring-[#C9A46A] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F5EFE0]/60 hover:text-[#C9A46A] transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {loginErrors.password && (
              <p
                id="login-password-error"
                role="alert"
                className="text-xs text-[#F2B8B5] mt-1.5"
              >
                {loginErrors.password.message}
              </p>
            )}

            {/* Forgot password link */}
            {/* TODO: Implement password reset flow at /account?mode=reset */}
            <div className="flex justify-end pt-1.5">
              <Link
                href="/account?mode=reset"
                className="text-xs text-[#C9A46A] hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C9A46A] text-[#0B1F3A] font-bold text-xs uppercase tracking-[0.2em] py-3.5 px-6 rounded-full hover:bg-[#D8B57D] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A46A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#132B4F]"
            >
              {isSubmitting ? "Please wait…" : "Log in"}
            </button>
          </div>
        </form>
      )}

      {/* SIGNUP FORM */}
      {mode === "signup" && (
        <form
          onSubmit={handleSubmitSignup(onSignupSubmit)}
          noValidate
          className="space-y-4"
        >
          {/* 1. Username */}
          <div>
            <label
              htmlFor="signup-username"
              className="block text-xs font-medium text-[#C9A46A] tracking-wider uppercase mb-1.5"
            >
              Username
            </label>
            <input
              id="signup-username"
              type="text"
              autoComplete="username"
              placeholder="e.g. main_character"
              aria-describedby={signupErrors.username ? "signup-username-error" : undefined}
              {...registerSignup("username")}
              className="w-full bg-[#0B1F3A] border border-[#C9A46A]/40 text-[#F5EFE0] placeholder-[#F5EFE0]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A46A] focus-visible:ring-1 focus-visible:ring-[#C9A46A] transition-colors"
            />
            {signupErrors.username && (
              <p
                id="signup-username-error"
                role="alert"
                className="text-xs text-[#F2B8B5] mt-1.5"
              >
                {signupErrors.username.message}
              </p>
            )}
          </div>

          {/* 2. Phone number */}
          <div>
            <label
              htmlFor="signup-phone"
              className="block text-xs font-medium text-[#C9A46A] tracking-wider uppercase mb-1.5"
            >
              Phone number
            </label>
            <input
              id="signup-phone"
              type="tel"
              autoComplete="tel"
              placeholder="e.g. 9876543210 or +919876543210"
              aria-describedby={signupErrors.phone ? "signup-phone-error" : undefined}
              {...registerSignup("phone")}
              className="w-full bg-[#0B1F3A] border border-[#C9A46A]/40 text-[#F5EFE0] placeholder-[#F5EFE0]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A46A] focus-visible:ring-1 focus-visible:ring-[#C9A46A] transition-colors"
            />
            {signupErrors.phone && (
              <p
                id="signup-phone-error"
                role="alert"
                className="text-xs text-[#F2B8B5] mt-1.5"
              >
                {signupErrors.phone.message}
              </p>
            )}
          </div>

          {/* 3. Email */}
          <div>
            <label
              htmlFor="signup-email"
              className="block text-xs font-medium text-[#C9A46A] tracking-wider uppercase mb-1.5"
            >
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              aria-describedby={signupErrors.email ? "signup-email-error" : undefined}
              {...registerSignup("email")}
              className="w-full bg-[#0B1F3A] border border-[#C9A46A]/40 text-[#F5EFE0] placeholder-[#F5EFE0]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A46A] focus-visible:ring-1 focus-visible:ring-[#C9A46A] transition-colors"
            />
            {signupErrors.email && (
              <p
                id="signup-email-error"
                role="alert"
                className="text-xs text-[#F2B8B5] mt-1.5"
              >
                {signupErrors.email.message}
              </p>
            )}
          </div>

          {/* 4. Password */}
          <div>
            <label
              htmlFor="signup-password"
              className="block text-xs font-medium text-[#C9A46A] tracking-wider uppercase mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 chars, 1 letter, 1 number"
                aria-describedby={signupErrors.password ? "signup-password-error" : undefined}
                {...registerSignup("password")}
                className="w-full bg-[#0B1F3A] border border-[#C9A46A]/40 text-[#F5EFE0] placeholder-[#F5EFE0]/30 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#C9A46A] focus-visible:ring-1 focus-visible:ring-[#C9A46A] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F5EFE0]/60 hover:text-[#C9A46A] transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {/* Password rules hint */}
            <p id="signup-password-hint" className="text-[11px] text-[#F5EFE0]/50 mt-1">
              8–72 characters, with uppercase, lowercase, a number, and a symbol. Must not contain username or email.
            </p>
            {signupErrors.password && (
              <p
                id="signup-password-error"
                role="alert"
                className="text-xs text-[#F2B8B5] mt-1.5"
              >
                {signupErrors.password.message}
              </p>
            )}
          </div>

          {/* 5. Confirm password */}
          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-xs font-medium text-[#C9A46A] tracking-wider uppercase mb-1.5"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter password"
                aria-describedby={
                  signupErrors.confirmPassword ? "signup-confirm-password-error" : undefined
                }
                {...registerSignup("confirmPassword")}
                className="w-full bg-[#0B1F3A] border border-[#C9A46A]/40 text-[#F5EFE0] placeholder-[#F5EFE0]/30 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#C9A46A] focus-visible:ring-1 focus-visible:ring-[#C9A46A] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F5EFE0]/60 hover:text-[#C9A46A] transition-colors p-1"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {signupErrors.confirmPassword && (
              <p
                id="signup-confirm-password-error"
                role="alert"
                className="text-xs text-[#F2B8B5] mt-1.5"
              >
                {signupErrors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C9A46A] text-[#0B1F3A] font-bold text-xs uppercase tracking-[0.2em] py-3.5 px-6 rounded-full hover:bg-[#D8B57D] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A46A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#132B4F]"
            >
              {isSubmitting ? "Please wait…" : "Create account"}
            </button>
          </div>
        </form>
      )}

      {/* Switcher Link at Bottom */}
      <div className="mt-6 text-center text-xs text-[#F5EFE0]/65">
        {mode === "login" ? (
          <>
            New here?{" "}
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="text-[#C9A46A] hover:underline font-semibold transition-colors cursor-pointer"
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="text-[#C9A46A] hover:underline font-semibold transition-colors cursor-pointer"
            >
              Log in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
