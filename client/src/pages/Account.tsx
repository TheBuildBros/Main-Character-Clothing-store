import { useState, useEffect, type FormEvent } from "react";
import { ArrowRight, Check, Eye, EyeOff, UserRound } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Account() {
  const utils = trpc.useUtils();
  const meQuery = trpc.auth.me.useQuery();
  const user = meQuery.data;

  const loginMutation = trpc.auth.login.useMutation();
  const requestSignupOtpMutation = trpc.auth.requestSignupOtp.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const requestPasswordResetMutation = trpc.auth.requestPasswordReset.useMutation();
  const resetPasswordMutation = trpc.auth.resetPassword.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [signupStep, setSignupStep] = useState<"form" | "otp">("form");
  const [forgotStep, setForgotStep] = useState<"request" | "verify" | "success">("request");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  // Form field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Validation tracking: errors only show after blur or submission attempt
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    otp?: string;
  }>({});
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
    otp?: boolean;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Requirement: Reset scroll position to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Validation helper
  const validateField = (
    field: "name" | "email" | "phone" | "password" | "confirmPassword" | "otp",
    val: string,
    currentPassword = password
  ): string => {
    const value = val.trim();
    if (field === "name") {
      if (mode === "signup" && signupStep === "form" && !value) {
        return "Add your name to create a profile.";
      }
    }
    if (field === "email") {
      if (!value) return "Enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Enter a valid email address.";
      }
    }
    if (field === "phone") {
      if (mode === "signup" && value) {
        const digits = value.replace(/[\s-]/g, "");
        if (countryCode === "+91") {
          if (!/^[6-9]\d{9}$/.test(digits)) {
            return "Enter a valid 10-digit mobile number.";
          }
        } else if (!/^\d{7,14}$/.test(digits)) {
          return "Enter a valid phone number (7-14 digits).";
        }
      }
    }
    if (field === "password") {
      if (!val) return "Password is required.";
      if (mode === "signup" || (mode === "forgot" && forgotStep === "verify")) {
        if (val.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(val)) return "Include at least one uppercase letter (A-Z).";
        if (!/[a-z]/.test(val)) return "Include at least one lowercase letter (a-z).";
        if (!/[0-9]/.test(val)) return "Include at least one number (0-9).";
        if (!/[^a-zA-Z0-9]/.test(val)) return "Include at least one symbol (!@#$%^&*).";
      } else {
        if (val.length < 1) return "Password is required.";
      }
    }
    if (field === "confirmPassword") {
      if (mode === "signup" || (mode === "forgot" && forgotStep === "verify")) {
        if (!val) return "Please re-type your password.";
        if (val !== currentPassword) return "Passwords do not match";
      }
    }
    if (field === "otp") {
      if (!val) return "Enter the 6-digit code.";
      if (!/^\d{6}$/.test(val.trim())) return "Code must be 6 digits.";
    }
    return "";
  };

  const handleBlur = (
    field: "name" | "email" | "phone" | "password" | "confirmPassword" | "otp"
  ) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val =
      field === "name"
        ? name
        : field === "email"
        ? email
        : field === "phone"
        ? phone
        : field === "password"
        ? password
        : field === "confirmPassword"
        ? confirmPassword
        : otp;
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleFieldChange = (
    field: "name" | "email" | "phone" | "password" | "confirmPassword" | "otp",
    value: string
  ) => {
    setServerError("");
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "phone") setPhone(value);
    if (field === "password") {
      setPassword(value);
      if (touched.confirmPassword || isSubmitted) {
        if (confirmPassword && value !== confirmPassword) {
          setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
        } else if (confirmPassword && value === confirmPassword) {
          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
      }
    }
    if (field === "confirmPassword") setConfirmPassword(value);
    if (field === "otp") setOtp(value.replace(/\D/g, "").slice(0, 6));

    if (touched[field] || isSubmitted) {
      const err = validateField(field, value, field === "password" ? value : password);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const shouldShowError = (
    field: "name" | "email" | "phone" | "password" | "confirmPassword" | "otp"
  ) => {
    return (touched[field] || isSubmitted) && errors[field];
  };

  // Password rules checklist for live checkmarks
  const passwordRules = [
    {
      id: "rule-len",
      label: "Minimum length of 8 characters",
      met: password.length >= 8,
    },
    {
      id: "rule-upper",
      label: "At least one uppercase letter (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      id: "rule-lower",
      label: "At least one lowercase letter (a-z)",
      met: /[a-z]/.test(password),
    },
    {
      id: "rule-num",
      label: "At least one number (0-9)",
      met: /[0-9]/.test(password),
    },
    {
      id: "rule-sym",
      label: "At least one symbol (e.g. !@#$%^&*)",
      met: /[^a-zA-Z0-9]/.test(password),
    },
  ];

  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "", color: "", bar: "" };
    const metCount = passwordRules.filter((r) => r.met).length;

    if (metCount <= 2)
      return { score: 1, label: "Weak", color: "text-red-500", bar: "bg-red-500" };
    if (metCount === 3)
      return { score: 2, label: "Fair", color: "text-amber-500", bar: "bg-amber-500" };
    if (metCount === 4)
      return { score: 3, label: "Good", color: "text-blue-500", bar: "bg-blue-500" };
    return {
      score: 4,
      label: "Strong",
      color: "text-emerald-500",
      bar: "bg-emerald-500",
    };
  };

  const strength = getPasswordStrength();

  const handleTabSwitch = (newMode: "signin" | "signup") => {
    if (
      loginMutation.isPending ||
      requestSignupOtpMutation.isPending ||
      registerMutation.isPending
    )
      return;
    setMode(newMode);
    setSignupStep("form");
    setForgotStep("request");
    setSuccess("");
    setServerError("");
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setShowConfirmPassword(false);
  };

  // 3. Sign in submit
  const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setServerError("");
    setSuccess("");

    const newErrors: { email?: string; password?: string } = {};
    const emailErr = validateField("email", email);
    if (emailErr) newErrors.email = emailErr;
    const passErr = validateField("password", password);
    if (passErr) newErrors.password = passErr;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.email) {
        document.getElementById("account-email")?.focus();
      } else if (newErrors.password) {
        document.getElementById("account-password")?.focus();
      }
      return;
    }

    try {
      await loginMutation.mutateAsync({ email: email.trim(), password });
      await utils.auth.me.invalidate();
      setPassword("");
      setTouched({});
      setIsSubmitted(false);
    } catch (err: any) {
      setServerError(err.message || "Failed to sign in. Please try again.");
    }
  };

  // 4a. Create account form submit -> request OTP
  const handleSignupFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setServerError("");
    setSuccess("");

    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const nameErr = validateField("name", name);
    if (nameErr) newErrors.name = nameErr;
    const emailErr = validateField("email", email);
    if (emailErr) newErrors.email = emailErr;
    const phoneErr = validateField("phone", phone);
    if (phoneErr) newErrors.phone = phoneErr;
    const passErr = validateField("password", password);
    if (passErr) newErrors.password = passErr;
    const confirmErr = validateField("confirmPassword", confirmPassword);
    if (confirmErr) newErrors.confirmPassword = confirmErr;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const fieldOrder: Array<"name" | "email" | "phone" | "password" | "confirmPassword"> = [
        "name",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ];
      const firstInvalid = fieldOrder.find((f) => newErrors[f]);
      if (firstInvalid) {
        const id =
          firstInvalid === "confirmPassword"
            ? "account-confirm-password"
            : `account-${firstInvalid}`;
        document.getElementById(id)?.focus();
      }
      return;
    }

    try {
      await requestSignupOtpMutation.mutateAsync({ email: email.trim() });
      setSignupStep("otp");
      setOtp("");
      setIsSubmitted(false);
      setTouched({});
      setSuccess(`We sent a 6-digit code to ${email.trim()}`);
    } catch (err: any) {
      setServerError(err.message || "Unable to send verification code.");
    }
  };

  // 4b. Verify OTP and register
  const handleSignupOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setServerError("");

    const otpErr = validateField("otp", otp);
    if (otpErr) {
      setErrors((prev) => ({ ...prev, otp: otpErr }));
      document.getElementById("account-otp")?.focus();
      return;
    }

    const cleanedDigits = phone.replace(/[\s-]/g, "");
    const cleanedPhone = cleanedDigits ? `${countryCode}${cleanedDigits}` : undefined;

    try {
      await registerMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        phone: cleanedPhone,
        password,
        otp: otp.trim(),
      });
      await utils.auth.me.invalidate();
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setTouched({});
      setIsSubmitted(false);
    } catch (err: any) {
      setServerError(err.message || "Registration failed.");
    }
  };

  const handleResendSignupOtp = async () => {
    setServerError("");
    setSuccess("");
    try {
      await requestSignupOtpMutation.mutateAsync({ email: email.trim() });
      setSuccess(`New verification code sent to ${email.trim()}`);
    } catch (err: any) {
      setServerError(err.message || "Failed to resend code.");
    }
  };

  // 5. Forgot password step 1: request reset
  const handleForgotRequestSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setServerError("");
    setSuccess("");

    const emailErr = validateField("email", email);
    if (emailErr) {
      setErrors({ email: emailErr });
      document.getElementById("account-email")?.focus();
      return;
    }

    try {
      await requestPasswordResetMutation.mutateAsync({ email: email.trim() });
      setForgotStep("verify");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setTouched({});
      setIsSubmitted(false);
      setSuccess(`If an account exists for ${email.trim()}, a code has been sent.`);
    } catch (err: any) {
      setServerError(err.message || "Unable to request password reset.");
    }
  };

  // 5. Forgot password step 2: verify code and reset password
  const handleForgotVerifySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setServerError("");
    setSuccess("");

    const newErrors: { otp?: string; password?: string; confirmPassword?: string } = {};
    const otpErr = validateField("otp", otp);
    if (otpErr) newErrors.otp = otpErr;
    const passErr = validateField("password", password);
    if (passErr) newErrors.password = passErr;
    const confirmErr = validateField("confirmPassword", confirmPassword);
    if (confirmErr) newErrors.confirmPassword = confirmErr;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.otp) document.getElementById("account-otp")?.focus();
      else if (newErrors.password) document.getElementById("account-password")?.focus();
      else if (newErrors.confirmPassword) document.getElementById("account-confirm-password")?.focus();
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        email: email.trim(),
        otp: otp.trim(),
        newPassword: password,
      });
      setForgotStep("success");
      setSuccess("Your password has been reset successfully.");
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setTouched({});
      setIsSubmitted(false);
    } catch (err: any) {
      setServerError(err.message || "Password reset failed.");
    }
  };

  // 6. Log out
  const handleLogout = async () => {
    setServerError("");
    try {
      await logoutMutation.mutateAsync();
      await utils.auth.me.invalidate();
    } catch (err: any) {
      setServerError(err.message || "Failed to log out.");
    }
  };

  const isPending =
    loginMutation.isPending ||
    requestSignupOtpMutation.isPending ||
    registerMutation.isPending ||
    requestPasswordResetMutation.isPending ||
    resetPasswordMutation.isPending;

  return (
    <div className="account-page">
      {/* Dark Navy Left Hero Panel (desktop) & Collapsible Banner (mobile) */}
      <aside className="account-aside" aria-label="Brand narrative">
        <div className="account-watermark" aria-hidden="true">
          MC
        </div>

        <div className="account-hero-content">
          <span className="account-eyebrow">主人公のムード</span>
          <h1 className="account-hero-title">
            Your story.
            <br />
            <em>Your wardrobe.</em>
          </h1>
          <p className="account-hero-desc">
            Save the pieces you love and find your way back when you're ready.
          </p>
        </div>

        <span className="account-aside-note">MC / PERSONAL EDIT</span>
      </aside>

      {/* Right Column: Account Content & Form */}
      <section className="account-panel" aria-label="Account access panel">
        {user ? (
          /* 6. Signed-in state */
          <div className="account-card">
            <nav aria-label="Breadcrumbs" className="breadcrumbs">
              <Link href="/" className="hover:text-foreground transition-colors">
                HOME
              </Link>{" "}
              <span>/</span> YOUR ACCOUNT
            </nav>

            <div className="account-header">
              <div className="account-mark" aria-hidden="true">
                <UserRound size={22} />
              </div>
              <span className="eyebrow">YOUR SPACE, YOUR PACE</span>
              <h2>Good to see you, {user.name}.</h2>
              <p className="account-intro">
                You're signed in to your Main Character profile.
              </p>
            </div>

            <div className="flex flex-col gap-3 py-4 border-y border-[var(--line)] my-6 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)] uppercase tracking-wider font-semibold">
                  Name
                </span>
                <span className="font-medium text-[var(--text)]">{user.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)] uppercase tracking-wider font-semibold">
                  Email
                </span>
                <span className="font-medium text-[var(--text)]">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex justify-between items-center">
                  <span className="text-[var(--muted)] uppercase tracking-wider font-semibold">
                    Phone
                  </span>
                  <span className="font-medium text-[var(--text)]">{user.phone}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)] uppercase tracking-wider font-semibold">
                  Role
                </span>
                <span className="font-medium text-[var(--text)] capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            {serverError && (
              <p className="form-alert error mb-4" role="alert">
                {serverError}
              </p>
            )}

            <div className="submit-row">
              <button
                type="button"
                className="button-primary auth-submit"
                disabled={logoutMutation.isPending}
                onClick={handleLogout}
              >
                {logoutMutation.isPending ? (
                  <>
                    <span className="spinner" /> Signing out...
                  </>
                ) : (
                  <span>Log out</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Authentication flow */
          <div className="account-card">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumbs" className="breadcrumbs">
              <Link href="/" className="hover:text-foreground transition-colors">
                HOME
              </Link>{" "}
              <span>/</span> YOUR ACCOUNT
            </nav>

            {/* Header */}
            <div className="account-header">
              <div className="account-mark" aria-hidden="true">
                <UserRound size={22} />
              </div>
              <span className="eyebrow">
                {mode === "forgot" ? "ACCOUNT RECOVERY" : "YOUR SPACE, YOUR PACE"}
              </span>
              <h2>
                {mode === "forgot"
                  ? forgotStep === "success"
                    ? "Password updated."
                    : "Reset password."
                  : mode === "signin"
                  ? "Good to see you."
                  : signupStep === "otp"
                  ? "Verify your email."
                  : "Make it yours."}
              </h2>
              <p className="account-intro">
                {mode === "forgot"
                  ? forgotStep === "success"
                    ? "Your password has been changed successfully."
                    : forgotStep === "verify"
                    ? `Enter the 6-digit code sent to ${email} and set your new password.`
                    : "Enter your email to receive a password reset code."
                  : mode === "signin"
                  ? "Pick up where your good taste left off."
                  : signupStep === "otp"
                  ? `Enter the 6-digit verification code sent to ${email}.`
                  : "A little profile. A lot of point of view."}
              </p>
            </div>

            {/* Auth tabs: Sign in / Create account (hidden in forgot mode) */}
            {mode !== "forgot" && (
              <div
                className="auth-tabs"
                role="tablist"
                aria-label="Account authentication options"
              >
                <button
                  type="button"
                  role="tab"
                  id="tab-signin"
                  aria-controls="panel-signin"
                  aria-selected={mode === "signin"}
                  disabled={isPending}
                  className={`auth-tab-btn ${mode === "signin" ? "selected" : ""}`}
                  onClick={() => handleTabSwitch("signin")}
                >
                  <span>Sign in</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-signup"
                  aria-controls="panel-signup"
                  aria-selected={mode === "signup"}
                  disabled={isPending}
                  className={`auth-tab-btn ${mode === "signup" ? "selected" : ""}`}
                  onClick={() => handleTabSwitch("signup")}
                >
                  <span>Create account</span>
                </button>
              </div>
            )}

            {/* Server Error Notice */}
            {serverError && (
              <p className="form-alert error mb-4" role="alert">
                {serverError}
              </p>
            )}

            {/* General Success Notice */}
            {success && (
              <p className="form-alert success mb-4" role="status">
                {success}
              </p>
            )}

            {/* 3. SIGN IN MODE */}
            {mode === "signin" && (
              <form
                id="panel-signin"
                role="tabpanel"
                aria-labelledby="tab-signin"
                onSubmit={handleSignInSubmit}
                className="auth-form"
                noValidate
              >
                {/* Field: Email */}
                <div className="form-field">
                  <label htmlFor="account-email" className="field-label">
                    <span>Email address</span>
                    <span className="text-[#1e6bff]" aria-label="Required">
                      *
                    </span>
                  </label>
                  <input
                    id="account-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={Boolean(shouldShowError("email"))}
                    aria-describedby={
                      shouldShowError("email") ? "account-email-error" : undefined
                    }
                    className={`field-input ${
                      shouldShowError("email") ? "field-error" : ""
                    }`}
                  />
                  {shouldShowError("email") && (
                    <p id="account-email-error" role="alert" className="error-text">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Field: Password */}
                <div className="form-field">
                  <div className="field-label-row">
                    <label htmlFor="account-password" className="field-label mb-0">
                      <span>Password</span>
                      <span className="text-[#1e6bff]" aria-label="Required">
                        *
                      </span>
                    </label>
                    <button
                      type="button"
                      className="field-hint-tag hover:text-[#1e6bff] cursor-pointer bg-transparent border-0 p-0"
                      onClick={() => {
                        setMode("forgot");
                        setForgotStep("request");
                        setServerError("");
                        setSuccess("");
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="password-input-wrap">
                    <input
                      id="account-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        handleFieldChange("password", e.target.value)
                      }
                      onBlur={() => handleBlur("password")}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      aria-required="true"
                      aria-invalid={Boolean(shouldShowError("password"))}
                      aria-describedby={
                        shouldShowError("password")
                          ? "account-password-error"
                          : undefined
                      }
                      className={`field-input pr-11 ${
                        shouldShowError("password") ? "field-error" : ""
                      }`}
                    />
                    <button
                      type="button"
                      id="account-toggle-password"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((value) => !value)}
                      className="password-toggle-btn"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {shouldShowError("password") && (
                    <p
                      id="account-password-error"
                      role="alert"
                      className="error-text"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="submit-row">
                  <button
                    className="button-primary auth-submit"
                    type="submit"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <span className="spinner" /> Signing in...
                      </>
                    ) : (
                      <>
                        <span>Sign in</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* 4. CREATE ACCOUNT MODE */}
            {mode === "signup" && signupStep === "form" && (
              <form
                id="panel-signup"
                role="tabpanel"
                aria-labelledby="tab-signup"
                onSubmit={handleSignupFormSubmit}
                className="auth-form"
                noValidate
              >
                {/* Field: Name */}
                <div className="form-field">
                  <label htmlFor="account-name" className="field-label">
                    <span>Your name</span>
                    <span className="text-[#1e6bff]" aria-label="Required">
                      *
                    </span>
                  </label>
                  <input
                    id="account-name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="How should we call you?"
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={Boolean(shouldShowError("name"))}
                    aria-describedby={
                      shouldShowError("name") ? "account-name-error" : undefined
                    }
                    className={`field-input ${
                      shouldShowError("name") ? "field-error" : ""
                    }`}
                  />
                  {shouldShowError("name") && (
                    <p id="account-name-error" role="alert" className="error-text">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Field: Email */}
                <div className="form-field">
                  <label htmlFor="account-email" className="field-label">
                    <span>Email address</span>
                    <span className="text-[#1e6bff]" aria-label="Required">
                      *
                    </span>
                  </label>
                  <input
                    id="account-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={Boolean(shouldShowError("email"))}
                    aria-describedby={
                      shouldShowError("email") ? "account-email-error" : undefined
                    }
                    className={`field-input ${
                      shouldShowError("email") ? "field-error" : ""
                    }`}
                  />
                  {shouldShowError("email") && (
                    <p id="account-email-error" role="alert" className="error-text">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Field: Phone */}
                <div className="form-field">
                  <div className="field-label-row">
                    <label htmlFor="account-phone" className="field-label">
                      <span>Phone number</span>
                    </label>
                    <span id="account-phone-hint" className="field-hint-tag">
                      (optional)
                    </span>
                  </div>
                  <div className="phone-input-row">
                    <label htmlFor="account-country-code" className="sr-only">
                      Country code
                    </label>
                    <select
                      id="account-country-code"
                      name="countryCode"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      aria-label="Country calling code"
                      className="country-select"
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+81">+81 (JP)</option>
                      <option value="+971">+971 (UAE)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+65">+65 (SG)</option>
                      <option value="+49">+49 (DE)</option>
                    </select>
                    <input
                      id="account-phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="98765 43210"
                      autoComplete="tel"
                      inputMode="tel"
                      aria-invalid={Boolean(shouldShowError("phone"))}
                      aria-describedby={
                        shouldShowError("phone")
                          ? "account-phone-error"
                          : "account-phone-hint"
                      }
                      className={`field-input flex-1 ${
                        shouldShowError("phone") ? "field-error" : ""
                      }`}
                    />
                  </div>
                  {shouldShowError("phone") && (
                    <p id="account-phone-error" role="alert" className="error-text">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Field: Password */}
                <div className="form-field">
                  <label htmlFor="account-password" className="field-label">
                    <span>Password</span>
                    <span className="text-[#1e6bff]" aria-label="Required">
                      *
                    </span>
                  </label>
                  <div className="password-input-wrap">
                    <input
                      id="account-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        handleFieldChange("password", e.target.value)
                      }
                      onBlur={() => handleBlur("password")}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      aria-required="true"
                      aria-invalid={Boolean(shouldShowError("password"))}
                      aria-describedby="account-password-hints"
                      className={`field-input pr-11 ${
                        shouldShowError("password") ? "field-error" : ""
                      }`}
                    />
                    <button
                      type="button"
                      id="account-toggle-password"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((value) => !value)}
                      className="password-toggle-btn"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {shouldShowError("password") && (
                    <p
                      id="account-password-error"
                      role="alert"
                      className="error-text"
                    >
                      {errors.password}
                    </p>
                  )}

                  {/* Password rules & live checkmarks */}
                  <div
                    id="account-password-hints"
                    className="password-hints-wrap"
                  >
                    {password.length > 0 && (
                      <div className="strength-meter-wrap">
                        <div className="strength-label-row">
                          <span className="strength-caption">
                            Password strength:
                          </span>
                          <span className={`strength-val ${strength.color}`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="strength-bars">
                          <div
                            className={`strength-bar ${
                              strength.score >= 1 ? strength.bar : ""
                            }`}
                          />
                          <div
                            className={`strength-bar ${
                              strength.score >= 2 ? strength.bar : ""
                            }`}
                          />
                          <div
                            className={`strength-bar ${
                              strength.score >= 3 ? strength.bar : ""
                            }`}
                          />
                          <div
                            className={`strength-bar ${
                              strength.score >= 4 ? strength.bar : ""
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="requirements-list">
                      {passwordRules.map((rule) => (
                        <div
                          key={rule.id}
                          className={`req-item ${rule.met ? "met" : ""}`}
                        >
                          <span className="req-check-badge" aria-hidden="true">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          <span>{rule.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Field: Re-type password */}
                <div className="form-field">
                  <label
                    htmlFor="account-confirm-password"
                    className="field-label"
                  >
                    <span>Re-type password</span>
                    <span className="text-[#1e6bff]" aria-label="Required">
                      *
                    </span>
                  </label>
                  <div className="password-input-wrap">
                    <input
                      id="account-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) =>
                        handleFieldChange("confirmPassword", e.target.value)
                      }
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      aria-required="true"
                      aria-invalid={Boolean(shouldShowError("confirmPassword"))}
                      aria-describedby={
                        shouldShowError("confirmPassword")
                          ? "account-confirm-password-error"
                          : undefined
                      }
                      className={`field-input pr-11 ${
                        shouldShowError("confirmPassword") ? "field-error" : ""
                      }`}
                    />
                    <button
                      type="button"
                      id="account-toggle-confirm-password"
                      aria-label={
                        showConfirmPassword
                          ? "Hide re-typed password"
                          : "Show re-typed password"
                      }
                      aria-pressed={showConfirmPassword}
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      className="password-toggle-btn"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {shouldShowError("confirmPassword") && (
                    <p
                      id="account-confirm-password-error"
                      role="alert"
                      className="error-text"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="submit-row">
                  <button
                    className="button-primary auth-submit"
                    type="submit"
                    disabled={requestSignupOtpMutation.isPending}
                  >
                    {requestSignupOtpMutation.isPending ? (
                      <>
                        <span className="spinner" /> Sending code...
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* 4b. CREATE ACCOUNT: OTP VERIFICATION */}
            {mode === "signup" && signupStep === "otp" && (
              <form
                id="panel-signup-otp"
                onSubmit={handleSignupOtpSubmit}
                className="auth-form"
                noValidate
              >
                <div className="form-field">
                  <label htmlFor="account-otp" className="field-label">
                    <span>6-digit verification code</span>
                    <span className="text-[#1e6bff]" aria-label="Required">
                      *
                    </span>
                  </label>
                  <input
                    id="account-otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => handleFieldChange("otp", e.target.value)}
                    onBlur={() => handleBlur("otp")}
                    placeholder="123456"
                    aria-required="true"
                    aria-invalid={Boolean(shouldShowError("otp"))}
                    aria-describedby={
                      shouldShowError("otp") ? "account-otp-error" : undefined
                    }
                    className={`field-input text-center text-lg tracking-[0.25em] font-mono ${
                      shouldShowError("otp") ? "field-error" : ""
                    }`}
                  />
                  {shouldShowError("otp") && (
                    <p id="account-otp-error" role="alert" className="error-text">
                      {errors.otp}
                    </p>
                  )}
                </div>

                <div className="submit-row flex flex-col gap-3">
                  <button
                    className="button-primary auth-submit"
                    type="submit"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <span className="spinner" /> Creating account...
                      </>
                    ) : (
                      <>
                        <span>Verify and create account</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => {
                        setSignupStep("form");
                        setServerError("");
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      className="text-link text-[#1e6bff]"
                      disabled={requestSignupOtpMutation.isPending}
                      onClick={handleResendSignupOtp}
                    >
                      {requestSignupOtpMutation.isPending
                        ? "Sending..."
                        : "Resend code"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 5. FORGOT PASSWORD MODE */}
            {mode === "forgot" && forgotStep === "request" && (
              <form
                id="panel-forgot-request"
                onSubmit={handleForgotRequestSubmit}
                className="auth-form"
                noValidate
              >
                <div className="form-field">
                  <label htmlFor="account-email" className="field-label">
                    <span>Email address</span>
                    <span className="text-[#1e6bff]" aria-label="Required">
                      *
                    </span>
                  </label>
                  <input
                    id="account-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={Boolean(shouldShowError("email"))}
                    aria-describedby={
                      shouldShowError("email")
                        ? "account-email-error"
                        : undefined
                    }
                    className={`field-input ${
                      shouldShowError("email") ? "field-error" : ""
                    }`}
                  />
                  {shouldShowError("email") && (
                    <p
                      id="account-email-error"
                      role="alert"
                      className="error-text"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="submit-row flex flex-col gap-3">
                  <button
                    className="button-primary auth-submit"
                    type="submit"
                    disabled={requestPasswordResetMutation.isPending}
                  >
                    {requestPasswordResetMutation.isPending ? (
                      <>
                        <span className="spinner" /> Sending code...
                      </>
                    ) : (
                      <>
                        <span>Send reset code</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => {
                        setMode("signin");
                        setServerError("");
                      }}
                    >
                      ← Back to Sign in
                    </button>
                  </div>
                </div>
              </form>
            )}

            {mode === "forgot" && forgotStep === "verify" && (
              <form
                id="panel-forgot-verify"
                onSubmit={handleForgotVerifySubmit}
                className="auth-form"
                noValidate
              >
                {/* Field: OTP */}
                <div className="form-field">
                  <label htmlFor="account-otp" className="field-label">
                    <span>6-digit reset code</span>
                    <span className="text-[#1e6bff]" aria-label="Required">
                      *
                    </span>
                  </label>
                  <input
                    id="account-otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => handleFieldChange("otp", e.target.value)}
                    onBlur={() => handleBlur("otp")}
                    placeholder="123456"
                    aria-required="true"
                    aria-invalid={Boolean(shouldShowError("otp"))}
                    aria-describedby={
                      shouldShowError("otp") ? "account-otp-error" : undefined
                    }
                    className={`field-input text-center text-lg tracking-[0.25em] font-mono ${
                      shouldShowError("otp") ? "field-error" : ""
                    }`}
                  />
                  {shouldShowError("otp") && (
                    <p id="account-otp-error" role="alert" className="error-text">
                      {errors.otp}
                    </p>
                  )}
                </div>

                {/* Field: New Password */}
                <div className="form-field">
                  <label htmlFor="account-password" className="field-label">
                    <span>New password</span>
                    <span className="text-[#1e6bff]" aria-label="Required">
                      *
                    </span>
                  </label>
                  <div className="password-input-wrap">
                    <input
                      id="account-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        handleFieldChange("password", e.target.value)
                      }
                      onBlur={() => handleBlur("password")}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      aria-required="true"
                      aria-invalid={Boolean(shouldShowError("password"))}
                      aria-describedby="account-password-hints"
                      className={`field-input pr-11 ${
                        shouldShowError("password") ? "field-error" : ""
                      }`}
                    />
                    <button
                      type="button"
                      id="account-toggle-password"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((value) => !value)}
                      className="password-toggle-btn"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {shouldShowError("password") && (
                    <p
                      id="account-password-error"
                      role="alert"
                      className="error-text"
                    >
                      {errors.password}
                    </p>
                  )}

                  {/* Password rules & checkmarks */}
                  <div
                    id="account-password-hints"
                    className="password-hints-wrap"
                  >
                    {password.length > 0 && (
                      <div className="strength-meter-wrap">
                        <div className="strength-label-row">
                          <span className="strength-caption">
                            Password strength:
                          </span>
                          <span className={`strength-val ${strength.color}`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="strength-bars">
                          <div
                            className={`strength-bar ${
                              strength.score >= 1 ? strength.bar : ""
                            }`}
                          />
                          <div
                            className={`strength-bar ${
                              strength.score >= 2 ? strength.bar : ""
                            }`}
                          />
                          <div
                            className={`strength-bar ${
                              strength.score >= 3 ? strength.bar : ""
                            }`}
                          />
                          <div
                            className={`strength-bar ${
                              strength.score >= 4 ? strength.bar : ""
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="requirements-list">
                      {passwordRules.map((rule) => (
                        <div
                          key={rule.id}
                          className={`req-item ${rule.met ? "met" : ""}`}
                        >
                          <span className="req-check-badge" aria-hidden="true">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          <span>{rule.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Field: Re-type new password */}
                <div className="form-field">
                  <label
                    htmlFor="account-confirm-password"
                    className="field-label"
                  >
                    <span>Re-type new password</span>
                    <span className="text-[#1e6bff]" aria-label="Required">
                      *
                    </span>
                  </label>
                  <div className="password-input-wrap">
                    <input
                      id="account-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) =>
                        handleFieldChange("confirmPassword", e.target.value)
                      }
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Re-enter your new password"
                      autoComplete="new-password"
                      aria-required="true"
                      aria-invalid={Boolean(shouldShowError("confirmPassword"))}
                      aria-describedby={
                        shouldShowError("confirmPassword")
                          ? "account-confirm-password-error"
                          : undefined
                      }
                      className={`field-input pr-11 ${
                        shouldShowError("confirmPassword") ? "field-error" : ""
                      }`}
                    />
                    <button
                      type="button"
                      id="account-toggle-confirm-password"
                      aria-label={
                        showConfirmPassword
                          ? "Hide re-typed password"
                          : "Show re-typed password"
                      }
                      aria-pressed={showConfirmPassword}
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      className="password-toggle-btn"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {shouldShowError("confirmPassword") && (
                    <p
                      id="account-confirm-password-error"
                      role="alert"
                      className="error-text"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="submit-row flex flex-col gap-3">
                  <button
                    className="button-primary auth-submit"
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? (
                      <>
                        <span className="spinner" /> Resetting password...
                      </>
                    ) : (
                      <>
                        <span>Reset password</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => {
                        setForgotStep("request");
                        setServerError("");
                      }}
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              </form>
            )}

            {mode === "forgot" && forgotStep === "success" && (
              <div className="auth-form">
                <div className="submit-row">
                  <button
                    type="button"
                    className="button-primary auth-submit"
                    onClick={() => {
                      setMode("signin");
                      setForgotStep("request");
                      setSuccess("");
                      setServerError("");
                    }}
                  >
                    <span>Sign in with new password</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Link */}
        <div className="account-bottom">
          First time here?{" "}
          <Link href="/collections" className="meet-collection-link">
            Meet the collection
          </Link>
        </div>
      </section>
    </div>
  );
}
