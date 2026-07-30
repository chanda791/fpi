import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/auth";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing its token. Request a new one.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch {
      setError("This reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0E14] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0A0E14_92%)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.14] shadow-[0_8px_40px_rgba(0,0,0,0.45)] px-8 py-10 sm:px-10">
          <h1
            className="text-2xl font-semibold text-white mb-1 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Set a new password
          </h1>
          <p className="text-sm text-white/50 mb-8">
            Choose a new password for your admin account.
          </p>

          {done ? (
            <div className="rounded-lg border border-[#2DD4C7]/30 bg-[#2DD4C7]/10 px-4 py-4 text-sm text-white/80">
              Password reset successfully. Redirecting to sign in...
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1.5">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30
                    outline-none transition focus:border-[#2DD4C7]/60 focus:ring-2 focus:ring-[#2DD4C7]/30"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-white/60 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30
                    outline-none transition focus:border-[#2DD4C7]/60 focus:ring-2 focus:ring-[#2DD4C7]/30"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-[#FF6B6B]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#2DD4C7] text-[#0A0E14] font-semibold text-sm py-3 mt-2
                  transition hover:bg-[#4FE0D5] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-white/40 mt-6">
            <Link to="/admin/login" className="hover:text-white/70 transition">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
