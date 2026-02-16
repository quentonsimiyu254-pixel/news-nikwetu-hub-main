import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const AboutPage = () => (
  <>
    <Helmet>
      <title>About Us - News Nikwetu</title>
      <meta name="description" content="Learn about News Nikwetu, your trusted source for breaking news coverage." />
    </Helmet>
    <Header />
    <main className="news-container py-12 max-w-3xl mx-auto">
      <h1 className="font-serif font-bold text-3xl mb-6">About News Nikwetu</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          News Nikwetu is a dedicated news platform committed to delivering accurate, timely, and 
          comprehensive news coverage to our readers. Our name, meaning "Our News," reflects our 
          mission to serve the community with stories that matter.
        </p>
        <h2>Our Mission</h2>
        <p>
          We strive to be the most trusted source of news, providing unbiased reporting across 
          politics, education, business, sports, entertainment, and local affairs. Our team of 
          experienced journalists works tirelessly to bring you the stories that shape our world.
        </p>
        <h2>Our Values</h2>
        <ul>
          <li><strong>Accuracy:</strong> We verify facts before publishing</li>
          <li><strong>Integrity:</strong> We maintain the highest ethical standards</li>
          <li><strong>Timeliness:</strong> We deliver breaking news as it happens</li>
          <li><strong>Community:</strong> We serve the people and amplify their voices</li>
        </ul>
        <h2>Contact Us</h2>
        <p>
          We value your feedback and story tips. Reach out to us through our contact page 
          or email us at <a href="mailto:info@newsnikwetu.com">info@newsnikwetu.com</a>.
        </p>
      </div>
    </main>
    <Footer />
  </>
);

export default AboutPage;
