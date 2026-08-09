import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import api, { getErrorMessage } from "../lib/api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink">Forgot Password</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="mt-8 rounded-md bg-emerald-50 p-5 text-sm text-emerald-700">
            If an account exists for that email, a reset link has been sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input"
            />
            <Button type="submit" loading={loading} className="w-full">
              Send Reset Link
            </Button>
          </form>
        )}

        <Link to="/login" className="mt-6 block text-center text-xs text-gold hover:underline">
          Back to Login
        </Link>
      </div>
    </Container>
  );
}
