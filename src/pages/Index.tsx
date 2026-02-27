import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, RefreshCcw } from "lucide-react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroBanner from "@/assets/hero-banner.jpg";
import { motion } from "framer-motion";

const Index = () => {
  const featured = products.filter(p => p.tags.includes("featured"));
  const trending = products.filter(p => p.tags.includes("trending"));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src={heroBanner}
          alt="Khatti Clothing hero banner featuring streetwear collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <span className="inline-block bg-accent text-accent-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-4">
              New Collection 2026
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              Wear The <br />
              <span className="text-gradient">Culture</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-md">
              Premium streetwear, sneakers, and essentials crafted for those who set trends.
            </p>
            <div className="flex gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?category=Sneakers"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Explore Sneakers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Truck, text: "Free Shipping Over ₹999" },
            { icon: Shield, text: "Secure Payments" },
            { icon: RefreshCcw, text: "Easy 30-Day Returns" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center justify-center gap-3 py-2">
              <Icon className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/products?category=${cat.name}`}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border hover:border-accent/40 hover:shadow-md transition-all group"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-heading font-semibold text-sm">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.count}+ items</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Discount Banner */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-primary rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-accent text-sm font-bold uppercase tracking-widest">Limited Time</span>
            <h3 className="font-heading text-2xl md:text-4xl font-bold text-primary-foreground mt-2">
              Up to 40% Off
            </h3>
            <p className="text-primary-foreground/60 mt-2">
              On selected streetwear and sneakers. Don't miss out.
            </p>
          </div>
          <Link
            to="/products"
            className="bg-accent text-accent-foreground px-8 py-3.5 rounded-md font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Shop the Sale
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="container mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Trending Now 🔥</h2>
          <Link to="/products" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {trending.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
