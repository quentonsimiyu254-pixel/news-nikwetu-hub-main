import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-16">
      <div className="news-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground font-serif font-black text-xl px-3 py-1 rounded">
                NN
              </div>
              <span className="font-serif font-bold text-xl">News Nikwetu</span>
            </div>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed max-w-md">
              Your trusted source for breaking news, politics, business, sports, and entertainment 
              coverage across the region. Delivering accurate and timely reporting.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/category/politics" className="hover:text-primary transition-colors">Politics</Link></li>
              <li><Link to="/category/business" className="hover:text-primary transition-colors">Business</Link></li>
              <li><Link to="/category/sports" className="hover:text-primary transition-colors">Sports</Link></li>
              <li><Link to="/category/entertainment" className="hover:text-primary transition-colors">Entertainment</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-foreground/50">
          <p>© {new Date().getFullYear()} News Nikwetu. All rights reserved.</p>
          <p>newsnikwetu.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
