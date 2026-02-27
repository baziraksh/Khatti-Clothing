import { Link } from "react-router-dom";
import { Heart, ArrowRight, Star } from "lucide-react";
import { Product } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);
  const wishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-lg"
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-badge-sale text-badge-sale-foreground text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
          {product.tags.includes("new") && (
            <span className="bg-badge-new text-badge-new-foreground text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${wishlisted ? "fill-accent text-accent" : "text-foreground"}`}
        />
      </button>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
          {product.brand}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading font-semibold text-sm leading-tight mb-2 hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-warning text-warning" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-heading font-bold text-lg">₹{product.discountPrice.toLocaleString()}</span>
          {discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
          )}
        </div>

      {/* Buy Now */}
        <Link
          to={`/product/${product.id}`}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Buy Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
