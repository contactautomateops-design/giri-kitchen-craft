import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { generateOtp, sendSignupOtp } from "@/lib/n8n";
import { Eye, EyeOff, Mail, Phone, Lock, User, ArrowLeft } from "lucide-react";

const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "verify-login" | "signup" | "verify-signup" | "phone" | "otp" | "forgot" | "verify-forgot" | "new-password">("login");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && mode !== "verify-signup" && mode !== "verify-login" && mode !== "verify-forgot" && mode !== "new-password") navigate("/");
  }, [user, navigate, mode]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // First check if user exists by trying to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Sign out immediately — we need OTP verification first
    await supabase.auth.signOut();

    // Generate OTP and send via n8n webhook
    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);

    const result = await sendSignupOtp(email, otpCode, "User");
    if (!result.success) {
      setError(result.error || "Failed to send verification email");
    } else {
      setMessage("A verification code has been sent to your email!");
      setMode("verify-login");
    }
    setLoading(false);
  };

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (otp !== generatedOtp) {
      setError("Invalid OTP. Please try again.");
      setLoading(false);
      return;
    }

    // OTP matched — sign in for real
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(loginError.message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Sign out any existing session to prevent auto-redirect
    await supabase.auth.signOut();

    // Generate OTP and send to n8n webhook
    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);

    const result = await sendSignupOtp(email, otpCode, fullName);
    if (!result.success) {
      setError(result.error || "Failed to send verification email");
    } else {
      setMessage("A verification code has been sent to your email!");
      setMode("verify-signup");
    }
    setLoading(false);
  };

  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (otp !== generatedOtp) {
      setError("Invalid OTP. Please try again.");
      setLoading(false);
      return;
    }

    // OTP verified — now create the Supabase account (auto-confirm is enabled)
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    // Auto-confirm is on, so sign in immediately
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(loginError.message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    const { sendOtp } = await import("@/lib/n8n");
    const result = await sendOtp(formattedPhone);
    if (!result.success) setError(result.error || "Failed to send OTP");
    else setMode("otp");
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    const { verifyOtp } = await import("@/lib/n8n");
    const result = await verifyOtp(formattedPhone, otp);
    if (!result.success) {
      setError(result.error || "Invalid OTP");
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setMessage("Check your email for a password reset link!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20 pb-10 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-3xl">🌿</span>
          <h1 className="font-playfair text-2xl font-bold text-foreground mt-2">
            {mode === "login" && "Welcome Back"}
            {mode === "verify-login" && "Verify Login"}
            {mode === "signup" && "Create Account"}
            {mode === "verify-signup" && "Verify Email"}
            {mode === "phone" && "Phone Login"}
            {mode === "otp" && "Enter OTP"}
            {mode === "forgot" && "Reset Password"}
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Giri Food Productions</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-body text-xs">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 font-body text-xs">
              {message}
            </div>
          )}

          {mode === "login" && (
            <>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background"
                      placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background"
                      placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="button" onClick={() => setMode("forgot")}
                  className="font-body text-xs text-primary hover:underline">Forgot password?</button>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="my-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="font-body text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-2">
                <button onClick={handleGoogleLogin} disabled={loading}
                  className="w-full py-3 rounded-xl border border-border font-body font-medium text-sm hover:bg-secondary/50 transition-all flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>
                <button onClick={() => setMode("phone")} disabled={loading}
                  className="w-full py-3 rounded-xl border border-border font-body font-medium text-sm hover:bg-secondary/50 transition-all flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Login with Phone
                </button>
              </div>

              <p className="mt-4 text-center font-body text-xs text-muted-foreground">
                Don't have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">Sign Up</button>
              </p>
            </>
          )}

          {mode === "signup" && (
            <>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background"
                      placeholder="Your full name" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background"
                      placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background"
                      placeholder="Min 6 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
                  {loading ? "Sending verification..." : "Create Account"}
                </button>
              </form>
              <p className="mt-4 text-center font-body text-xs text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">Sign In</button>
              </p>
            </>
          )}

          {mode === "verify-signup" && (
            <>
              <button onClick={() => { setMode("signup"); setOtp(""); setError(""); setMessage(""); }}
                className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-3 h-3" /> Back to signup
              </button>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Enter the 6-digit code sent to <span className="font-semibold text-foreground">{email}</span>
              </p>
              <form onSubmit={handleVerifySignupOtp} className="space-y-4">
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-center tracking-[0.5em] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background"
                  placeholder="------" />
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
                  {loading ? "Verifying..." : "Verify & Create Account"}
                </button>
                <button type="button" onClick={handleSignup} disabled={loading}
                  className="w-full py-2 font-body text-xs text-primary hover:underline">
                  Resend Code
                </button>
              </form>
            </>
          )}

          {mode === "verify-login" && (
            <>
              <button onClick={() => { setMode("login"); setOtp(""); setError(""); setMessage(""); }}
                className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-3 h-3" /> Back to login
              </button>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Enter the 6-digit code sent to <span className="font-semibold text-foreground">{email}</span>
              </p>
              <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-center tracking-[0.5em] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background"
                  placeholder="------" />
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </button>
                <button type="button" onClick={handleEmailLogin} disabled={loading}
                  className="w-full py-2 font-body text-xs text-primary hover:underline">
                  Resend Code
                </button>
              </form>
            </>
          )}

          {mode === "phone" && (
            <>
              <button onClick={() => setMode("login")} className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-3 h-3" /> Back to login
              </button>
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground">+91</span>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required pattern="[0-9]{10}"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background"
                      placeholder="10-digit number" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {mode === "otp" && (
            <>
              <button onClick={() => setMode("phone")} className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-3 h-3" /> Change number
              </button>
              <p className="font-body text-sm text-muted-foreground mb-4">OTP sent to +91{phone}</p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-center tracking-[0.5em] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background"
                  placeholder="------" />
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            </>
          )}

          {mode === "forgot" && (
            <>
              <button onClick={() => setMode("login")} className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-3 h-3" /> Back to login
              </button>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background"
                    placeholder="your@email.com" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
