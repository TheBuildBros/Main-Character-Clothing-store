"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  Info,
  RotateCcw,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setIsOtpSent(true);
  };

  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, "").slice(0, 1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setOtpError("");

    if (cleanVal && index < 5) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`login-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length < 6) {
      setOtpError("Please enter all 6 digits of the OTP");
      return;
    }

    // Mock successful authentication
    login(email);
    router.push("/account");
  };

  return (
    <main className="min-h-screen bg-[#F5F2EA] flex flex-col justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-block text-[#091426] hover:opacity-80 transition-opacity"
          >
            <span
              className="text-4xl font-black tracking-[0.2em] text-[#091426]"
              style={{
                fontFamily:
                  "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              }}
            >
              主人公
            </span>
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-[0.16em] text-[#091426]">
            Customer Login
          </h1>
          <p className="text-xs text-[#091426]/60 tracking-wider">
            Passwordless Email OTP access to your account & orders.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-[#091426]/10 p-6 sm:p-8 space-y-6">
          {!isOtpSent ? (
            /* STEP 1: EMAIL-ONLY LOGIN */
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="loginEmail"
                    className="block text-xs uppercase tracking-widest font-bold text-[#091426]"
                  >
                    Email Address
                  </label>
                  <span className="text-[10px] text-[#C6A15B] font-semibold">
                    (Passwordless)
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C6A15B]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="loginEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="protagonist@domain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-md bg-[#F5F2EA]/40 border border-[#091426]/15 text-sm text-[#091426] placeholder-[#091426]/40 focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-600">{emailError}</p>
                )}
              </div>

              <div className="p-3 rounded-md bg-[#101D35]/5 border border-[#C6A15B]/30 flex items-start gap-2.5">
                <Info className="h-4 w-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#091426]/80 leading-relaxed">
                  We use secure passwordless authentication. A one-time 6-digit login code will be delivered to your registered email.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-md bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] hover:text-[#e0c487] transition-all flex items-center justify-center gap-2 shadow-sm border border-[#C6A15B]/30"
              >
                <span>Send One-Time Login Code</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: OTP VERIFICATION */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Notice Banner */}
              <div className="p-3.5 rounded-lg bg-[#101D35] text-[#F5F2EA] border border-[#C6A15B]/40 space-y-1.5">
                <div className="flex items-center gap-2 text-[#C6A15B] font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Backend Integration Placeholder</span>
                </div>
                <p className="text-[11px] text-[#F5F2EA]/80 leading-relaxed">
                  Demo state: Enter any 6 digits (e.g. <strong>123456</strong>) to verify and access your account.
                </p>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#091426]">
                  Enter One-Time Code
                </h3>
                <p className="text-xs text-[#091426]/60">
                  Authentication code sent to <strong>{email}</strong>
                </p>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`login-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-lg bg-[#F5F2EA]/60 border border-[#091426]/20 text-[#091426] focus:outline-none focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/30"
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-center text-xs text-red-600">{otpError}</p>
              )}

              <div className="flex items-center justify-between text-xs text-[#091426]/70 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="hover:underline text-[#091426]/80"
                >
                  &larr; Use another email
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(["", "", "", "", "", ""]);
                    setOtpError("");
                  }}
                  className="flex items-center gap-1 text-[#C6A15B] font-semibold hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Resend Code</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-md bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] hover:text-[#e0c487] transition-all flex items-center justify-center gap-2 shadow-sm border border-[#C6A15B]/30"
              >
                <span>Verify & Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Switch to Signup Link */}
          <div className="pt-4 border-t border-black/[0.06] text-center">
            <p className="text-xs text-[#091426]/70">
              New to MainCharacter?{" "}
              <Link
                href="/signup"
                className="text-[#C6A15B] font-bold hover:underline ml-1"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
