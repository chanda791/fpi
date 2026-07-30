import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(
    searchParams.get("expired") ? "Your session has expired. Please sign in again." : ""
  );
  const [loading, setLoading] = useState(false);
  const from = (location.state as { from?: string } | null)?.from || "/admin";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate(from, { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0E14] flex items-center justify-center px-4">
      {/* Video background */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/images/back.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Scrim for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E14]/80 via-[#0A0E14]/60 to-[#0A0E14]/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0A0E14_92%)]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="login-ring relative rounded-2xl p-[1px]">
          <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.14] shadow-[0_8px_40px_rgba(0,0,0,0.45)] px-8 py-10 sm:px-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4C7] shadow-[0_0_8px_#2DD4C7]" />
              <span
                className="text-[11px] tracking-[0.2em] uppercase text-white/50"
                style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
              >
                Admin &middot; Secure Access
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <img
                src="/images/logo.png"
                alt="Free Press Initiative Zambia"
                className="h-10 w-10 rounded-lg object-contain bg-white/10 p-1"
              />
              <div>
                <p
                  className="text-sm font-semibold text-white leading-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Free Press Initiative
                </p>
                <p className="text-xs text-white/50 leading-tight">Zambia</p>
              </div>
            </div>

            <h1
              className="text-3xl font-semibold text-white mb-1 tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Welcome back
            </h1>
            <p className="text-sm text-white/50 mb-8">
              Sign in to reach the control panel.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
                  autoComplete="username"
                  className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30
                    outline-none transition focus:border-[#2DD4C7]/60 focus:ring-2 focus:ring-[#2DD4C7]/30"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white placeholder-white/30
                      outline-none transition focus:border-[#2DD4C7]/60 focus:ring-2 focus:ring-[#2DD4C7]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-white/40 hover:text-white/70 transition"
                    tabIndex={0}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-white/60 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="rounded border-white/30 bg-white/10 text-[#2DD4C7] focus:ring-[#2DD4C7]/50"
                  />
                  Remember me
                </label>

                <Link
                  to="/admin/forgot-password"
                  className="text-white/50 hover:text-[#2DD4C7] transition"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p role="alert" className="text-sm text-[#FF6B6B] flex items-center gap-1.5">
                  <span className="inline-block h-1 w-1 rounded-full bg-[#FF6B6B]" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#2DD4C7] text-[#0A0E14] font-semibold text-sm py-3 mt-2
                  transition hover:bg-[#4FE0D5] disabled:opacity-60 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-[#2DD4C7]/50 focus:ring-offset-2 focus:ring-offset-[#0A0E14]"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          Restricted area &middot; authorized personnel only
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .login-ring::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 1px;
          background: conic-gradient(from 0deg, transparent 0%, #2DD4C7 12%, transparent 28%, transparent 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: rotate-ring 6s linear infinite;
        }

        @keyframes rotate-ring {
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-ring::before { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default Login;