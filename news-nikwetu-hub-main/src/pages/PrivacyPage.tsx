import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const PrivacyPage = () => (
  <>
    <Helmet>
      <title>Privacy Policy - News Nikwetu</title>
    </Helmet>
    <Header />
    <main className="news-container py-12 max-w-3xl mx-auto">
      <h1 className="font-serif font-bold text-3xl mb-6">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly, including when you contact us through our website or subscribe to our newsletter.</p>
        <h2>How We Use Your Information</h2>
        <p>We use the information to provide and improve our services, send updates, and respond to inquiries.</p>
        <h2>Cookies</h2>
        <p>We use cookies and similar technologies to analyze traffic and improve user experience. You can control cookie settings in your browser.</p>
        <h2>Third-Party Services</h2>
        <p>We may use third-party analytics and advertising services. These services may collect information about your use of our website.</p>
        <h2>Contact</h2>
        <p>For questions about this privacy policy, contact us at <a href="mailto:info@newsnikwetu.com">info@newsnikwetu.com</a>.</p>
      </div>
    </main>
    <Footer />
  </>
);

export default PrivacyPage;
