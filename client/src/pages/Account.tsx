import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { Link } from "wouter";

export default function Account() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const name = String(data.get("name") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address."); return; }
    if (password.length < 8) { setError("Use at least 8 characters for your password."); return; }
    if (mode === "signup" && !name) { setError("Add your name to create a profile."); return; }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSuccess(mode === "signup" ? `You're on the list, ${name}. Account creation is a demo in this preview.` : "You're all set. Sign-in is a demo in this preview.");
      form.reset();
    }, 650);
  };

  return <div className="account-page">
    <div className="account-aside"><span className="eyebrow">MAIN CHARACTER ENERGY</span><h1>Your story.<br /><em>Your wardrobe.</em></h1><p>Save the pieces you love and find your way back when you're ready.</p><span className="account-aside-note">MC / PERSONAL EDIT</span></div>
    <div className="account-panel"><div className="breadcrumbs">HOME <span>/</span> YOUR ACCOUNT</div><div className="account-card">
      <div className="account-mark"><UserRound size={20} /></div><span className="eyebrow">YOUR SPACE, YOUR PACE</span><h2>{mode === "signin" ? "Good to see you." : "Make it yours."}</h2><p className="account-intro">{mode === "signin" ? "Pick up where your good taste left off." : "A little profile. A lot of point of view."}</p>
      <div className="guest-state" role="status"><span className="guest-state-dot" /> GUEST PREVIEW <span>You're not signed in. Account access needs a connected service.</span></div>
      <div className="auth-tabs"><button disabled={loading} className={mode === "signin" ? "selected" : ""} onClick={() => { setMode("signin"); setSuccess(""); setError(""); }}>Sign in</button><button disabled={loading} className={mode === "signup" ? "selected" : ""} onClick={() => { setMode("signup"); setSuccess(""); setError(""); }}>Create account</button></div>
      <form onSubmit={submit} className="auth-form" noValidate>{mode === "signup" && <label>Your name<input name="name" placeholder="How should we call you?" autoComplete="name" /></label>}<label>Email address<input type="email" name="email" placeholder="you@example.com" autoComplete="email" /></label><label>Password<div className="password-wrap"><input type={showPassword ? "text" : "password"} name="password" placeholder="At least 8 characters" autoComplete={mode === "signin" ? "current-password" : "new-password"} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><small>8 characters minimum</small></label>{error && <p className="form-alert error" role="alert">{error}</p>}{success && <p className="form-alert success" role="status">{success}</p>}<button className="button-primary auth-submit" type="submit" disabled={loading}>{loading ? <><span className="spinner" /> One moment</> : <>{mode === "signin" ? "Sign in" : "Create account"} <ArrowRight size={16} /></>}</button></form>
      <div className="demo-disclaimer"><LockKeyhole size={14} /><span>Preview only: no account service is connected. Do not enter a real password.</span></div>
    </div><div className="account-bottom">First time here? <Link href="/collections">Meet the collection</Link></div></div>
  </div>;
}
