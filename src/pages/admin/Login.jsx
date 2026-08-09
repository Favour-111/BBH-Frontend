import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { getErrorMessage } from "../../lib/api.js";
import Button from "../../components/ui/Button.jsx";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#191512] px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
            <Lock size={20} />
          </div>
          <h1 className="font-display text-2xl text-ink">Beauty by Horbah's Admin</h1>
          <p className="text-xs text-ink-soft">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Admin email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" loading={loading} variant="gold" className="w-full">
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] text-ink-soft">
          Demo: admin@beautybyhorbahs.com / Admin@12345
        </p>
      </div>
    </div>
  );
}
