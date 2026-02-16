import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - News Nikwetu</title>
        <meta name="description" content="Get in touch with News Nikwetu. Send us your feedback, story tips, or inquiries." />
      </Helmet>
      <Header />
      <main className="news-container py-12 max-w-2xl mx-auto">
        <h1 className="font-serif font-bold text-3xl mb-6">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have a story tip, feedback, or inquiry? We'd love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={255} />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required maxLength={1000} />
          </div>
          <Button type="submit" size="lg">Send Message</Button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
