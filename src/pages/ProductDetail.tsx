import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { products } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Heart, Minus, Plus, ShoppingCart, Star, Truck, Shield, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Reset state and scroll to top when product changes
  useEffect(() => {
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
    setSelectedImage(0);
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products" className="text-accent hover:underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    const size = selectedSize || product.sizes[0];
    const color = selectedColor || product.colors[0];
    for (let i = 0; i < quantity; i++) {
      addToCart(product, size, color);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-accent" : "border-border"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">{product.brand}</p>
              <h1 className="font-heading text-2xl md:text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold">₹{product.discountPrice.toLocaleString()}</span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                  <span className="text-sm font-bold text-badge-sale bg-badge-sale/10 px-2 py-0.5 rounded">{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Size */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                      selectedSize === size
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">Color</h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                      selectedColor === color
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <p className={`text-sm font-medium ${product.stock > 10 ? "text-success" : "text-warning"}`}>
              {product.stock > 10 ? "In Stock" : `Only ${product.stock} left!`}
            </p>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-secondary transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-secondary transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-md border transition-colors ${
                  wishlisted ? "bg-accent/10 border-accent text-accent" : "border-border hover:border-foreground"
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-accent" : ""}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full bg-accent text-accent-foreground py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Buy Now
            </button>

            {/* Perks */}
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="w-4 h-4 text-accent" /> Free delivery on orders over ₹999
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-accent" /> 30-day easy returns
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-border pt-6">
              <h4 className="font-heading font-semibold mb-3">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-heading text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
