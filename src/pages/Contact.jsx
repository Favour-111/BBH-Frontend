import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api.js";
import { useSiteData } from "../context/SiteDataContext.jsx";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import { InstagramIcon, TiktokIcon, YoutubeIcon } from "../components/ui/SocialIcons.jsx";
import clsx from "clsx";

const platformIcon = { instagram: InstagramIcon, tiktok: TiktokIcon, youtube: YoutubeIcon };

const inquiryTypes = [
  { key: "general", label: "General Enquiry" },
  { key: "makeup-booking", label: "Makeup Booking" },
  { key: "content-creation", label: "Content Creation" },
  { key: "brand-collaboration", label: "Brand Collaboration" },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  service: "photoshoot-makeup",
  preferredDate: "",
  budget: "",
  socialHandle: "",
  brand: "",
  campaign: "",
};

export default function Contact() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "general";
  const site = useSiteData();
  const [type, setType] = useState(inquiryTypes.some((t) => t.key === initialType) ? initialType : "general");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return toast.error("Please agree to the privacy policy.");
    setLoading(true);
    try {
      if (type === "makeup-booking") {
        await api.post("/bookings", {
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          preferredDate: form.preferredDate || undefined,
          budget: form.budget,
          message: form.message,
        });
        toast.success("Booking request sent! We'll be in touch shortly.");
      } else if (type === "brand-collaboration") {
        await api.post("/collaborations", {
          brand: form.brand,
          contactPerson: form.name,
          email: form.email,
          phone: form.phone,
          campaign: form.campaign,
          budget: form.budget,
          socialHandle: form.socialHandle,
          description: form.message,
        });
        toast.success("Thanks for reaching out! We'll respond within 24 hours.");
      } else {
        await api.post("/messages", {
          name: form.name,
          email: form.email,
          phone: form.phone,
          type,
          subject: form.subject || inquiryTypes.find((t) => t.key === type)?.label,
          message: form.message,
        });
        toast.success("Message sent! We'll respond soon.");
      }
      setForm(emptyForm);
      setAgreed(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const settings = site?.settings;

  return (
    <div>
      <div className="relative overflow-hidden bg-ink">
        <img src="/images/contact-banner.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <Container className="relative py-20">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold-light">Let's Connect</p>
          <h1 className="max-w-lg font-display text-4xl text-ivory sm:text-5xl">
            Let's create something <span className="italic text-gold-light">beautiful</span> together.
          </h1>
          <p className="mt-4 max-w-md text-sm text-ivory/70">
            Have a question, booking request or collaboration idea? I'd love to hear from you.
          </p>
          <div className="mt-8 flex flex-wrap gap-8 text-sm text-ivory/80">
            <span className="flex items-center gap-2">
              <Phone size={15} className="text-gold-light" /> {settings?.contact?.phone}
            </span>
            <span className="flex items-center gap-2">
              <Mail size={15} className="text-gold-light" /> {settings?.contact?.email}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={15} className="text-gold-light" /> {settings?.contact?.address}
            </span>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        <h2 className="mb-8 text-center font-display text-2xl text-ink">How can I help you?</h2>
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {inquiryTypes.map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className={clsx(
                "rounded-lg border p-5 text-center transition",
                type === t.key ? "border-gold bg-gold/5" : "border-cream-deep hover:border-gold/50"
              )}
            >
              <p className="text-sm font-medium text-ink">{t.label}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-lg bg-white p-8 shadow-sm">
            <h3 className="font-display text-xl text-ink">Send Me a Message</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="Full Name" className="input" value={form.name} onChange={set("name")} />
              <input required type="email" placeholder="Email Address" className="input" value={form.email} onChange={set("email")} />
              <input placeholder="Phone Number" className="input" value={form.phone} onChange={set("phone")} />

              {type === "brand-collaboration" && (
                <input placeholder="Company / Brand Name" className="input" value={form.brand} onChange={set("brand")} required />
              )}

              {type === "makeup-booking" && (
                <select className="select" value={form.service} onChange={set("service")}>
                  <option value="bridal-makeup">Bridal Makeup</option>
                  <option value="photoshoot-makeup">Photoshoot Makeup</option>
                  <option value="event-makeup">Event Makeup</option>
                  <option value="makeup-lessons">Makeup Lessons</option>
                  <option value="other">Other</option>
                </select>
              )}
              {type === "makeup-booking" && (
                <input type="date" className="input" value={form.preferredDate} onChange={set("preferredDate")} />
              )}

              {type === "brand-collaboration" && (
                <input placeholder="Campaign / Project" className="input" value={form.campaign} onChange={set("campaign")} />
              )}
              {(type === "makeup-booking" || type === "brand-collaboration") && (
                <input placeholder="Budget" className="input" value={form.budget} onChange={set("budget")} />
              )}
              {type === "brand-collaboration" && (
                <input placeholder="Social Media Handle" className="input" value={form.socialHandle} onChange={set("socialHandle")} />
              )}
              {(type === "general" || type === "content-creation") && (
                <input placeholder="Subject" className="input sm:col-span-2" value={form.subject} onChange={set("subject")} />
              )}
            </div>

            <textarea
              required
              placeholder="Tell me more about your enquiry..."
              className="textarea"
              value={form.message}
              onChange={set("message")}
            />

            <label className="flex items-start gap-2 text-xs text-ink-soft">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />
              I agree to the <span className="text-gold">privacy policy</span> and consent to being contacted.
            </label>

            <Button type="submit" loading={loading} className="w-full sm:w-auto">
              <Send size={14} /> Send Message
            </Button>
          </form>

          <div className="space-y-6">
            <div className="rounded-lg bg-cream-deep/50 p-6">
              <h4 className="mb-4 font-display text-lg text-ink">Let's Connect</h4>
              <div className="space-y-3">
                {(site?.socials || []).slice(0, 4).map((s) => {
                  const Icon = platformIcon[s.platform] || InstagramIcon;
                  return (
                    <a key={s._id} href={s.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-md bg-white px-4 py-3">
                      <span className="flex items-center gap-2 text-sm">
                        <Icon size={16} className="text-gold" /> {s.username}
                      </span>
                      <span className="text-xs font-medium text-gold">Follow</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg bg-cream-deep/50 p-6">
              <h4 className="mb-3 flex items-center gap-2 font-display text-lg text-ink">
                <Clock size={16} className="text-gold" /> Availability
              </h4>
              <div className="space-y-2 text-xs text-ink-soft">
                <div className="flex justify-between">
                  <span>Monday - Friday</span> <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span> <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span> <span>By Appointment</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-ink-soft/70">(WAT) West Africa Time &mdash; {settings?.contact?.responseTime}</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
