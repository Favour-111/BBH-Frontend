import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import api, { getErrorMessage } from "../../lib/api.js";
import Button from "../../components/ui/Button.jsx";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put("/auth/me", form);
      updateUser(data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return toast.error("New passwords do not match.");
    setSavingPw(true);
    try {
      await api.put("/auth/change-password", pwForm);
      toast.success("Password changed successfully");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-ink">Account Details</h1>

      <form onSubmit={handleProfileSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink">Profile Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input placeholder="Full Name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" disabled value={user?.email} className="input bg-cream-deep/40 text-ink-soft" />
          <input placeholder="Phone Number" className="input sm:col-span-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <Button type="submit" loading={savingProfile} size="sm">
          Save Changes
        </Button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink">Change Password</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="password"
            required
            placeholder="Current Password"
            className="input sm:col-span-2"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="New Password"
            className="input"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Confirm New Password"
            className="input"
            value={pwForm.confirm}
            onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
          />
        </div>
        <Button type="submit" loading={savingPw} size="sm">
          Update Password
        </Button>
      </form>
    </div>
  );
}
