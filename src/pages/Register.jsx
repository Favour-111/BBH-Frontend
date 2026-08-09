import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";
import toast from "react-hot-toast";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../lib/api.js";
import authPanelImage from "../../assets/image/imagec.png";
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const [showRegPw, setShowRegPw] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const passwordChecks = {
    length: registerForm.password.length >= 8,
    number: /\d/.test(registerForm.password),
    special: /[^A-Za-z0-9]/.test(registerForm.password),
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    try {
      await register(registerForm);
      toast.success("Account created! Welcome to Beauty by Horbah's.");
      navigate("/account");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr]">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <img
          src={authPanelImage}
          alt=""
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-14 text-ivory">
          <h1 className="font-display text-4xl leading-tight">Join Beauty by Horbah's</h1>
          <p className="mt-4 max-w-xs text-sm text-ivory/70">
            Create an account to shop, track orders and enjoy a personalized experience.
          </p>
          <ul className="mt-10 space-y-4 text-sm">
            {["Secure & Private", "Fast Checkout", "Exclusive Benefits"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <Check size={16} className="text-gold-light" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Container className="flex items-center py-16">
        <form onSubmit={handleRegister} className="mx-auto w-full max-w-md space-y-5">
          <div>
            <h2 className="font-display text-2xl text-ink">Create Your Account</h2>
            <p className="text-sm text-ink-soft">Join Beauty by Horbah's and start your beautiful journey</p>
          </div>
          <Field label="Full Name">
            <input
              required
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              className="input"
              placeholder="Enter your full name"
            />
          </Field>
          <Field label="Email Address">
            <input
              type="email"
              required
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              className="input"
              placeholder="Enter your email"
            />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                type={showRegPw ? "text" : "password"}
                required
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                className="input pr-10"
                placeholder="Create a password"
              />
              <button type="button" onClick={() => setShowRegPw((v) => !v)} className="absolute right-3 top-3 text-ink-soft">
                {showRegPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
              <PwCheck ok={passwordChecks.length} label="At least 8 characters" />
              <PwCheck ok={passwordChecks.number} label="Include a number" />
              <PwCheck ok={passwordChecks.special} label="Include a special character" />
            </div>
          </Field>
          <Button type="submit" loading={regLoading} className="w-full">
            Create Account
          </Button>
          <p className="text-center text-sm text-ink-soft">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-gold hover:underline">
              Sign in
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

function PwCheck({ ok, label }) {
  return (
    <span className={`flex items-center gap-1 ${ok ? "text-emerald-600" : "text-ink-soft/60"}`}>
      <Check size={11} /> {label}
    </span>
  );
}
