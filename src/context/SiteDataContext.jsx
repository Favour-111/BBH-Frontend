import { createContext, useContext, useEffect, useState } from "react";
import { cachedGet } from "../lib/api.js";

const SiteDataContext = createContext(null);

const defaultSettings = {
  brand: { name: "Beauty by Horbah's", tagline: "Jewelry that tells a story. Beauty that empowers. Content that connects." },
  contact: { email: "hello@beautybyhorbahs.com", phone: "+234 812 345 6789", whatsapp: "+234 812 345 6789", address: "Lagos, Nigeria", responseTime: "Within 24 hours" },
  homepage: { heroTitle: "Jewelry. Beauty. Creativity.", heroSubtitle: "Jewelry that tells a story. Makeup that empowers. Content that inspires.", announcementBar: "Free shipping on orders over ₦100,000" },
  freeShippingThreshold: 100000,
};

export function SiteDataProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [socials, setSocials] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    cachedGet("/settings").then(({ data }) => setSettings(data.settings)).catch(() => {});
    cachedGet("/socials").then(({ data }) => setSocials(data.accounts)).catch(() => {});
    cachedGet("/categories").then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  const socialByType = (type) => socials.filter((s) => s.type === type);

  return (
    <SiteDataContext.Provider value={{ settings, socials, categories, socialByType }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export const useSiteData = () => useContext(SiteDataContext);
