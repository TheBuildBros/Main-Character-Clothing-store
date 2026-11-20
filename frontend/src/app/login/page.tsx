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
    <main className="min-h-screen bg-[#F8F6F1] flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-block transition-opacity duration-300 hover:opacity-80"
          >
            <span
              className="text-3xl sm:text-4xl font-black tracking-[0.25em] text-[#0B1F3A] block leading-none"
              style={{
                fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
              }}
            >
              主人公
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#C6A76A] block mt-1.5 font-medium">
              MainCharacter
            </span>
          </Link>
          <div className="pt-2">
            <h1
              className="text-2xl sm:text-3xl text-[#0B1F3A]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              Member Sign In
            </h1>
            <p className="text-xs text-[#20242B]/60 tracking-wider font-light mt-1">
              Passwordless Email OTP access to private archives & orders.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#20242B]/[0.08] shadow-[0_4px_24px_rgba(11,31,58,0.06)] p-7 sm:p-9 space-y-6">
          {!isOtpSent ? (
            /* STEP 1: EMAIL-ONLY LOGIN */
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="loginEmail"
                    className="block text-[10px] uppercase tracking-[0.25em] font-semibold text-[#0B1F3A]"
                  >
                    Email Address
                  </label>
                  <span className="text-[9px] uppercase tracking-wider text-[#C6A76A] font-medium">
                    Passwordless
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C6A76A]">
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <input
                    id="loginEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="protagonist@domain.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#F8F6F1]/50 border border-[#20242B]/15 text-xs text-[#20242B] placeholder-[#20242B]/40 focus:outline-none focus:border-[#C6A76A] focus:ring-1 focus:ring-[#C6A76A] transition-all"
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-600 font-light">{emailError}</p>
                )}
              </div>

              <div className="p-3.5 border border-[#C6A76A]/25 bg-[#C6A76A]/5 flex items-start gap-2.5">
                <Info className="h-4 w-4 text-[#C6A76A] shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-[11px] text-[#20242B]/75 leading-relaxed font-light">
                  We use secure passwordless authentication. A one-time 6-digit login code will be delivered to your registered email.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#0B1F3A] text-[#C6A76A] text-[10px] uppercase tracking-[0.28em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300 flex items-center justify-center gap-2 border border-[#0B1F3A]"
              >
                <span>Send One-Time Code</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </form>
          ) : (
            /* STEP 2: OTP VERIFICATION */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Notice Banner */}
              <div className="p-3.5 bg-[#0B1F3A] text-[#F8F6F1] border border-[#C6A76A]/30 space-y-1">
                <div className="flex items-center gap-2 text-[#C6A76A] font-semibold text-[10px] uppercase tracking-[0.25em]">
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span>Interactive Prototype</span>
                </div>
                <p className="text-[11px] text-[#F8F6F1]/70 leading-relaxed font-light">
                  Demo state: Enter any 6 digits (e.g. <strong>123456</strong>) to verify and access your account.
                </p>
              </div>

              <div className="text-center space-y-1">
                <h3
                  className="text-lg text-[#0B1F3A]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}
                >
                  Enter Verification Code
                </h3>
                <p className="text-xs text-[#20242B]/60 font-light">
                  Authentication code sent to <strong className="text-[#0B1F3A] font-semibold">{email}</strong>
                </p>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`login-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg font-bold bg-[#F8F6F1] border border-[#20242B]/20 text-[#0B1F3A] focus:outline-none focus:border-[#C6A76A] focus:ring-1 focus:ring-[#C6A76A]"
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-center text-xs text-red-600 font-light">{otpError}</p>
              )}

              <div className="flex items-center justify-between text-xs text-[#20242B]/70 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="hover:underline text-[11px] text-[#20242B]/60"
                >
                  ← Edit email
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(["", "", "", "", "", ""]);
                    setOtpError("");
                  }}
                  className="flex items-center gap-1 text-[11px] text-[#C6A76A] font-semibold uppercase tracking-wider hover:underline"
                >
                  <RotateCcw className="h-3 w-3" strokeWidth={1.5} />
                  <span>Resend</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#0B1F3A] text-[#C6A76A] text-[10px] uppercase tracking-[0.28em] font-semibold hover:bg-[#C6A76A] hover:text-[#0B1F3A] transition-all duration-300 flex items-center justify-center gap-2 border border-[#0B1F3A]"
              >
                <span>Verify & Sign In</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </form>
          )}

          {/* Switch to Signup Link */}
          <div className="pt-4 border-t border-[#20242B]/[0.08] text-center">
            <p className="text-xs text-[#20242B]/60 font-light">
              New to MainCharacter?{" "}
              <Link
                href="/signup"
                className="text-[#C6A76A] font-semibold hover:underline ml-1"
              >
                Join VIP Roster
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
