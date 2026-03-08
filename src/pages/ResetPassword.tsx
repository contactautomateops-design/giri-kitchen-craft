import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      navigate("/auth");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20 px-4">
        <div className="text-center">
          <h2 className="font-playfair text-xl font-bold text-foreground mb-2">Password Updated!</h2>
          <p className="font-body text-sm text-muted-foreground mb-4">You can now sign in with your new password.</p>
          <button onClick={() => navigate("/auth")}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20 px-4">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border p-6 shadow-lg">
        <h2 className="font-playfair text-xl font-bold text-foreground mb-4">Set New Password</h2>
        {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive font-body text-xs">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background"
              placeholder="New password (min 6 chars)" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm disabled:opacity-50">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
