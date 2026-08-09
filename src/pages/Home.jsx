import Hero from "../components/home/Hero.jsx";
import FeaturedProducts from "../components/home/FeaturedProducts.jsx";
import VideoShowcase from "../components/home/VideoShowcase.jsx";
import AboutPreview from "../components/home/AboutPreview.jsx";
import ServicesPreview from "../components/home/ServicesPreview.jsx";
import SocialPreview from "../components/home/SocialPreview.jsx";
import Testimonials from "../components/home/Testimonials.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <VideoShowcase />
      <AboutPreview />
      <ServicesPreview />
      <SocialPreview />
      <Testimonials />
    </>
  );
}
