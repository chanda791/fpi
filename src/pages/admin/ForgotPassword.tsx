import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
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
            Reset your password
          </h1>
          <p className="text-sm text-white/50 mb-8">
            Enter your admin email and we'll get you a reset link.
          </p>

          {submitted ? (
            <div className="rounded-lg border border-[#2DD4C7]/30 bg-[#2DD4C7]/10 px-4 py-4 text-sm text-white/80">
              If an account exists for that email, a password reset link has
              been generated. If SMTP is configured, check your inbox -- if
              not, ask your administrator to check the server logs for the
              reset link (see PASSWORD_RECOVERY.md).
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
