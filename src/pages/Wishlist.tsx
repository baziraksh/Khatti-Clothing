import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const Wishlist = () => {
  const { wishlist, toggleWishlist, moveToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-heading text-2xl font-bold mb-2">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-6">Save items you love and come back to them later.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-md font-medium"
          >
            Explore Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-8">Wishlist ({wishlist.length})</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item, i) => {
            const product = item.product;
            const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 bg-card rounded-lg border border-border"
              >
                <Link to={`/product/${product.id}`} className="w-28 h-28 rounded-md overflow-hidden bg-secondary shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-heading font-semibold text-sm truncate hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-heading font-bold">₹{product.discountPrice.toLocaleString()}</span>
                    {discount > 0 && (
                      <span className="text-xs text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => moveToCart(product.id, product.sizes[0], product.colors[0])}
                      className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-medium hover:opacity-90"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
