import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Save, Share2 } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import { ImageManager } from "../../components/admin/MediaManager.jsx";
import clsx from "clsx";

const tabs = ["Brand", "Contact", "Homepage", "SEO"];

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [tab, setTab] = useState("Brand");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.get("/settings").then(({ data }) => setSettings(data.settings));
  }, []);

  const set = (section, key) => (e) =>
    setSettings((s) => ({ ...s, [section]: { ...s[section], [key]: e.target.value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await adminApi.put("/settings", settings);
      setSettings(data.settings);
      toast.success("Settings saved successfully.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="skeleton h-96 rounded-lg" />;

  return (
    <div>
      <PageHeader
        title="Website Settings"
        description="Manage your website's content without touching code."
        action={
          <Button onClick={handleSave} loading={saving}>
            <Save size={14} /> Save Changes
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={clsx("rounded-full px-4 py-1.5 text-xs font-medium", tab === t ? "bg-ink text-ivory" : "bg-cream-deep text-ink-soft")}>
            {t}
          </button>
        ))}
        <Link to="/admin/socials" className="ml-auto flex items-center gap-1.5 rounded-full bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold">
          <Share2 size={13} /> Manage Social Accounts &rarr;
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        {tab === "Brand" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Brand Name" full>
              <input className="input" value={settings.brand.name} onChange={set("brand", "name")} />
            </Field>
            <Field label="Tagline" full>
              <input className="input" value={settings.brand.tagline} onChange={set("brand", "tagline")} />
            </Field>
            <Field label="Logo" full>
              <ImageManager images={settings.brand.logo ? [{ url: settings.brand.logo }] : []} onChange={(imgs) => setSettings((s) => ({ ...s, brand: { ...s.brand, logo: imgs[0]?.url || "" } }))} />
            </Field>
          </div>
        )}

        {tab === "Contact" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email"><input className="input" value={settings.contact.email} onChange={set("contact", "email")} /></Field>
            <Field label="Phone"><input className="input" value={settings.contact.phone} onChange={set("contact", "phone")} /></Field>
            <Field label="WhatsApp"><input className="input" value={settings.contact.whatsapp} onChange={set("contact", "whatsapp")} /></Field>
            <Field label="Response Time"><input className="input" value={settings.contact.responseTime} onChange={set("contact", "responseTime")} /></Field>
            <Field label="Address" full><input className="input" value={settings.contact.address} onChange={set("contact", "address")} /></Field>
          </div>
        )}

        {tab === "Homepage" && (
          <div className="grid grid-cols-1 gap-4">
            <Field label="Hero Title"><input className="input" value={settings.homepage.heroTitle} onChange={set("homepage", "heroTitle")} /></Field>
            <Field label="Hero Subtitle"><textarea className="textarea" value={settings.homepage.heroSubtitle} onChange={set("homepage", "heroSubtitle")} /></Field>
            <Field label="Announcement Bar Text"><input className="input" value={settings.homepage.announcementBar} onChange={set("homepage", "announcementBar")} /></Field>
            <Field label="Hero Image">
              <ImageManager images={settings.homepage.heroImage ? [{ url: settings.homepage.heroImage }] : []} onChange={(imgs) => setSettings((s) => ({ ...s, homepage: { ...s.homepage, heroImage: imgs[0]?.url || "" } }))} />
            </Field>
            <Field label="Free Shipping Threshold (₦)">
              <input type="number" className="input" value={settings.freeShippingThreshold} onChange={(e) => setSettings((s) => ({ ...s, freeShippingThreshold: e.target.value }))} />
            </Field>
          </div>
        )}

        {tab === "SEO" && (
          <div className="grid grid-cols-1 gap-4">
            <Field label="Meta Title"><input className="input" value={settings.seo.metaTitle} onChange={set("seo", "metaTitle")} /></Field>
            <Field label="Meta Description"><textarea className="textarea" value={settings.seo.metaDescription} onChange={set("seo", "metaDescription")} /></Field>
            <Field label="Keywords"><input className="input" value={settings.seo.keywords} onChange={set("seo", "keywords")} /></Field>
            <Field label="OG Image">
              <ImageManager images={settings.seo.ogImage ? [{ url: settings.seo.ogImage }] : []} onChange={(imgs) => setSettings((s) => ({ ...s, seo: { ...s.seo, ogImage: imgs[0]?.url || "" } }))} />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
