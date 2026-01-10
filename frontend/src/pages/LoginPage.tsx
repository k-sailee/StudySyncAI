import { useState } from "react";
import { useAuth, UserRole } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const palette = {
  primary: "#7B9FE0",
  secondary: "#D4A5E0",
  accent: "#5FA899",
  darkBg: "linear-gradient(135deg, #0f1423 0%, #1a1a2e 50%, #2d1b4e 100%)",
  card: "#FFFFFF",
  text: "#1A1F3A",
  textSecondary: "#6B7280",
  shadowLight: "0 4px 12px rgba(0,0,0,0.08)",
  shadowMedium: "0 8px 32px rgba(0,0,0,0.1)",
  errorBg: "#FEE8E8",
  errorBorder: "#FF9999",
  errorText: "#D32F2F",
};

const roles = [
  { key: "student", label: "Student", icon: "👨‍🎓" },
  { key: "teacher", label: "Teacher", icon: "👨‍🏫" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();

  const validate = () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (isSignUp && !displayName.trim()) {
      setError("Please enter your name");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await signUp(email, password, displayName, role);
        setLoading(false);
        navigate("/dashboard");
      } else {
        const user = await signIn(email, password, role);
        setLoading(false);
        // Navigate after successful sign-in; app can show role-specific UI
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row items-stretch relative overflow-hidden"
      style={{ background: palette.darkBg }}
    >
      {/* Back to Home Link - More visible */}
      <button
        type="button"
        className="fixed left-8 top-8 text-lg font-bold transition-colors duration-200 focus:outline-none hover:underline z-50 bg-white/90 px-4 py-2 rounded-full shadow"
        style={{
          color: palette.primary,
          border: `2px solid ${palette.primary}`,
          boxShadow: palette.shadowLight,
        }}
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      {/* LEFT SIDE - Branding/Illustration */}
      <div
        className="hidden lg:flex flex-col items-center justify-center w-full lg:w-1/2 p-8 lg:p-12 relative"
        style={{
          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
          minHeight: "100vh",
        }}
      >
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="rounded-full bg-white p-3"
              style={{ boxShadow: palette.shadowLight }}
            >
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#fff" />
                <path
                  d="M12 7v5l4 2"
                  stroke={palette.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="font-extrabold text-3xl tracking-tight text-white">
              StudySync
            </h1>
          </div>

          {/* Illustration Box */}
          <div
            className="bg-white/20 rounded-3xl p-8 flex items-center justify-center mt-4"
            style={{
              width: 200,
              height: 200,
              backdropFilter: "blur(10px)",
            }}
          >
            <svg
              width="140"
              height="140"
              viewBox="0 0 64 64"
              fill="none"
            >
              <rect width="64" height="64" rx="20" fill={palette.secondary} />
              <path
                d="M32 20l14 8-14 8-14-8 14-8zm0 8v14m-10 6h20"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Text Content */}
          <div className="mt-6">
            <h2 className="text-4xl font-bold text-white mb-4">
              Start Your Journey
            </h2>
            <p className="text-lg text-white/85 leading-relaxed">
              Track your tasks, connect with teachers, and achieve your academic
              goals.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 bg-gradient-to-b from-white/95 to-white/98 lg:bg-white">
        {/* Role Selection - Positioned at Top */}
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-center gap-3 sm:gap-4">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap ${
                  role === r.key
                    ? "bg-gradient-to-r from-[#D4A5E0] to-[#E8C5F0] text-white border-transparent shadow-md"
                    : "bg-[#E8E8F0] text-[#6B7280] border-[#D0D0DC] hover:bg-[#DCDCE4]"
                }`}
                style={{
                  minWidth: "120px",
                }}
                aria-pressed={role === r.key}
                onClick={() => setRole(r.key as UserRole)}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <form
          className="w-full max-w-md"
          onSubmit={handleSubmit}
        >
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: palette.text }}>
              Welcome Back
            </h2>
            <p className="text-base text-gray-500" style={{ color: palette.textSecondary }}>
              Sign in to your {role === "student" ? "Student" : "Teacher"} account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="flex items-center gap-3 mb-6 p-4 border rounded-lg animate-pulse"
              style={{
                background: palette.errorBg,
                borderColor: palette.errorBorder,
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" fill="#FF9999" />
                <path
                  d="M12 8v4m0 4h.01"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium" style={{ color: palette.errorText }}>
                {error}
              </span>
            </div>
          )}

          {/* Display Name Field (SignUp only) */}
          {isSignUp && (
            <div className="mb-6">
              <label htmlFor="displayName" className="block font-semibold mb-2 text-sm" style={{ color: palette.text }}>
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B0]">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="3" stroke={palette.primary} strokeWidth="2" />
                    <path d="M4 20c0-4 3-6 8-6s8 2 8 6" stroke={palette.primary} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  id="displayName"
                  type="text"
                  className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-lg border border-[#E0E0E8] text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7B9FE0] focus:border-transparent"
                  style={{ background: "#F9F9FB", color: palette.text }}
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block font-semibold mb-2 text-sm" style={{ color: palette.text }}>
              Email
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B0]">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M4 8l8 6 8-6M4 8h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2z"
                    stroke={palette.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-lg border border-[#E0E0E8] text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7B9FE0] focus:border-transparent"
                style={{ background: "#F9F9FB", color: palette.text }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-2">
            <label htmlFor="password" className="block font-semibold mb-2 text-sm" style={{ color: palette.text }}>
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0B0]">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 17a2 2 0 002-2v-2a2 2 0 00-2-2 2 2 0 00-2 2v2a2 2 0 002 2zm6-6V9a6 6 0 10-12 0v2"
                    stroke={palette.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-3 sm:py-3.5 rounded-lg border border-[#E0E0E8] text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7B9FE0] focus:border-transparent"
                style={{ background: "#F9F9FB", color: palette.text }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-[#7B9FE0] transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M17.94 17.94A10.94 10.94 0 0112 19c-5 0-9.27-3.11-11-7.5a11.05 11.05 0 012.92-4.19M6.06 6.06A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7.5a11.05 11.05 0 01-2.92 4.19M9.5 9.5a3 3 0 014.24 4.24M3 3l18 18"
                      stroke={palette.primary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"
                      stroke={palette.primary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke={palette.primary} strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          {!isSignUp && (
            <div className="flex justify-end mb-6">
              <button
                type="button"
                className="text-sm font-medium transition-colors duration-200 focus:outline-none hover:underline"
                style={{ color: palette.primary }}
                onClick={() => alert("Forgot password functionality coming soon!")}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 sm:py-3.5 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 mb-6"
            style={{
              background: `linear-gradient(90deg, ${palette.secondary} 0%, #E8C5F0 100%)`,
              color: "#fff",
              boxShadow: "0 4px 12px rgba(212, 165, 224, 0.3)",
              border: "none",
              borderRadius: 10,
              opacity: loading ? 0.85 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              transform: loading ? "scale(0.98)" : "scale(1)",
            }}
            disabled={loading}
          >
            {loading ? (isSignUp ? "Creating Account..." : "Signing In...") : isSignUp ? "Sign Up" : "Sign In"}
          </button>

          {/* Toggle SignUp/SignIn */}
          <div className="text-center text-sm">
            <span style={{ color: palette.textSecondary }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            </span>
            <button
              type="button"
              className="font-semibold transition-colors duration-200 focus:outline-none hover:underline"
              style={{ color: palette.primary }}
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setDisplayName("");
              }}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>

          {/* Demo Credentials */}
          {!isSignUp && (
            <div
              className="mt-8 p-4 rounded-lg border text-xs sm:text-sm"
              style={{
                background: "rgba(212, 165, 224, 0.1)",
                borderColor: palette.secondary,
                color: palette.text,
              }}
            >
              <div className="font-bold mb-2">Demo Credentials:</div>
              <div className="space-y-1">
                <div><strong>Student:</strong> student@example.com / password123</div>
                <div><strong>Teacher:</strong> teacher@example.com / password123</div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}