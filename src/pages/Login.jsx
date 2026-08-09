import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";
import toast from "react-hot-toast";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../lib/api.js";
import authPanelImage from "../../assets/image/imagec.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/account";

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr]">
      <div className="relative hidden overflow-hidden bg-black lg:block">
        <img
          src={authPanelImage}
          alt=""
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-14 text-ivory">
          <h1 className="font-display text-4xl leading-tight">Welcome to Beauty by Horbah's</h1>
          <p className="mt-4 max-w-xs text-sm text-ivory/70">
            Sign in to your account to shop, track orders and enjoy a personalized experience.
          </p>
          <ul className="mt-10 space-y-4 text-sm">
            {["Secure & Private", "Fast Checkout", "Exclusive Benefits"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <Check size={16} className="text-light" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Container className="flex items-center py-16">
        <form onSubmit={handleLogin} className="mx-auto w-full max-w-md space-y-5">
          <div>
            <h2 className="font-display text-2xl text-ink">Welcome Back</h2>
            <p className="text-sm text-ink-soft">Login to your Beauty by Horbah's account</p>
          </div>
          <Field label="Email Address">
            <input
              type="email"
              required
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="input"
              placeholder="Enter your email"
            />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                type={showLoginPw ? "text" : "password"}
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="input pr-10"
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShowLoginPw((v) => !v)} className="absolute right-3 top-3 text-ink-soft">
                {showLoginPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>
          <div className="flex items-center justify-end text-xs">
            <Link to="/forgot-password" className="text-gold hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" loading={loginLoading} className="w-full">
            Sign In
          </Button>
          <p className="text-center text-sm text-ink-soft">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-gold hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </Container>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
