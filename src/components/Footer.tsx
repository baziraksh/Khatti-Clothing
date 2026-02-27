import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="font-heading text-2xl font-bold mb-4">
              KHATTI<span className="text-accent">.</span>
            </h2>
            <p className="text-sm opacity-70 leading-relaxed">
              Your destination for premium streetwear, sneakers, and everyday essentials. Wear the culture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {["Shoes", "Sneakers", "T-Shirts", "Hoodies", "Pants", "Streetwear"].map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-2.5">
              {["Contact Us", "FAQs", "Shipping Info", "Returns & Exchanges", "Size Guide"].map(item => (
                <li key={item}>
                  <span className="text-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-sm opacity-70 mb-4">Get the latest drops and exclusive offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 rounded-l-md px-3 py-2 text-sm placeholder:opacity-50 outline-none focus:border-accent"
              />
              <button className="bg-accent text-accent-foreground px-4 py-2 rounded-r-md text-sm font-medium hover:opacity-90 transition-opacity">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-sm opacity-50">© 2026 Khatti Clothing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
