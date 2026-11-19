"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info,
  RotateCcw,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function SignupPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  // Form states
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // OTP flow state
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);

  // Validate Step 1 Form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!username.trim() || username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    }

    if (!phoneNumber.trim() || phoneNumber.trim().length < 8) {
      newErrors.phoneNumber =
        "Enter a valid contact phone number (min 8 digits)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Transition to Email OTP Verification UI
    setIsOtpSent(true);
    setResendTimer(30);
  };

  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, "").slice(0, 1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setOtpError("");

    // Auto-focus next input
    if (cleanVal && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
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

    // Mock verification successful (Integration placeholder)
    login(email, username, phoneNumber);
    router.push("/account");
  };

  const handleResend = () => {
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpError("");
    setResendTimer(30);
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
            Create Customer Account
          </h1>
          <p className="text-xs text-[#091426]/60 tracking-wider">
            Join the MainCharacter protagonist roster for priority drops & archival access.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-[#091426]/10 p-6 sm:p-8 space-y-6">
          {!isOtpSent ? (
            /* STEP 1: REGISTRATION FORM */
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Username Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="username"
                  className="block text-xs uppercase tracking-widest font-bold text-[#091426]"
                >
                  Username / Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C6A15B]">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Kenji Sato"
                    className="w-full pl-10 pr-4 py-3 rounded-md bg-[#F5F2EA]/40 border border-[#091426]/15 text-sm text-[#091426] placeholder-[#091426]/40 focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-xs uppercase tracking-widest font-bold text-[#091426]"
                  >
                    Contact Phone Number
                  </label>
                  <span className="text-[10px] text-[#091426]/50">
                    (Contact only, never for OTP)
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C6A15B]">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="phoneNumber"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+81 90 1234 5678"
                    className="w-full pl-10 pr-4 py-3 rounded-md bg-[#F5F2EA]/40 border border-[#091426]/15 text-sm text-[#091426] placeholder-[#091426]/40 focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-xs text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Email Address Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-widest font-bold text-[#091426]"
                  >
                    Email Address
                  </label>
                  <span className="text-[10px] text-[#C6A15B] font-semibold">
                    (OTP delivered here)
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C6A15B]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="protagonist@domain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-md bg-[#F5F2EA]/40 border border-[#091426]/15 text-sm text-[#091426] placeholder-[#091426]/40 focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Note on OTP Delivery */}
              <div className="p-3 rounded-md bg-[#101D35]/5 border border-[#C6A15B]/30 flex items-start gap-2.5">
                <Info className="h-4 w-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#091426]/80 leading-relaxed">
                  Security note: Verification OTP will be sent <strong>strictly via Email</strong>.
                  Your phone number is retained purely for delivery logistics and order communication.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-md bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] hover:text-[#e0c487] transition-all flex items-center justify-center gap-2 shadow-sm border border-[#C6A15B]/30"
              >
                <span>Continue & Send Email OTP</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: EMAIL OTP VERIFICATION PLACEHOLDER */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Notice Banner */}
              <div className="p-3.5 rounded-lg bg-[#101D35] text-[#F5F2EA] border border-[#C6A15B]/40 space-y-1.5">
                <div className="flex items-center gap-2 text-[#C6A15B] font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Backend Integration Placeholder</span>
                </div>
                <p className="text-[11px] text-[#F5F2EA]/80 leading-relaxed">
                  No real email has been sent. In this demo flow, enter any 6 digits (e.g. <strong>123456</strong>) to verify your account.
                </p>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#091426]">
                  Enter Verification Code
                </h3>
                <p className="text-xs text-[#091426]/60">
                  Verification OTP dispatched to <strong>{email}</strong>
                </p>
              </div>

              {/* 6 Digit OTP Inputs */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
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

              {/* Resend Timer & Edit Details */}
              <div className="flex items-center justify-between text-xs text-[#091426]/70 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="hover:underline text-[#091426]/80"
                >
                  &larr; Change email address
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  className="flex items-center gap-1 text-[#C6A15B] font-semibold hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Resend Code</span>
                </button>
              </div>

              {/* Complete Registration Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-md bg-[#091426] text-[#C6A15B] text-xs uppercase tracking-widest font-bold hover:bg-[#101D35] hover:text-[#e0c487] transition-all flex items-center justify-center gap-2 shadow-sm border border-[#C6A15B]/30"
              >
                <span>Verify & Complete Registration</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Switch to Login Link */}
          <div className="pt-4 border-t border-black/[0.06] text-center">
            <p className="text-xs text-[#091426]/70">
              Already registered?{" "}
              <Link
                href="/login"
                className="text-[#C6A15B] font-bold hover:underline ml-1"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
