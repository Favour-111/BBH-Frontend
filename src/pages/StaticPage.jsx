import Container from "../components/ui/Container.jsx";

const content = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect only the information necessary to process your orders, deliver your jewelry, and improve your shopping experience   including your name, email, phone number, and delivery address.",
      "Your payment details are processed securely through Paystack. We never store your card information on our servers.",
      "We do not sell or share your personal information with third parties, except as required to fulfil your order (e.g. courier partners) or comply with the law.",
      "You may request access to, correction of, or deletion of your personal data at any time by contacting hello@beautybyhorbahs.com.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "By using the Beauty by Horbah's website, you agree to these terms. All jewelry is sold subject to availability and pricing at the time of order.",
      "Product images are for illustrative purposes   slight variations in color and finish may occur due to lighting and screen settings.",
      "Orders are confirmed only after successful payment via Paystack. We reserve the right to cancel orders in cases of suspected fraud or pricing errors.",
      "Content, images and branding on this site are the property of Beauty by Horbah's and may not be reproduced without permission.",
    ],
  },
  refund: {
    title: "Refund & Return Policy",
    body: [
      "We accept returns within 7 days of delivery for unworn, unused items in their original packaging with all tags attached.",
      "To initiate a return, contact hello@beautybyhorbahs.com with your order number. Once approved, we'll provide instructions for returning your item.",
      "Refunds are processed to your original payment method within 5-7 business days of receiving your returned item.",
      "Custom or personalized pieces, and items marked as final sale, are not eligible for return or refund unless defective.",
    ],
  },
};

export default function StaticPage({ type }) {
  const page = content[type] || content.privacy;
  return (
    <Container className="max-w-3xl py-20">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">Legal</p>
      <h1 className="font-display text-4xl text-ink">{page.title}</h1>
      <div className="mt-8 space-y-5">
        {page.body.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-ink-soft">
            {p}
          </p>
        ))}
      </div>
    </Container>
  );
}
