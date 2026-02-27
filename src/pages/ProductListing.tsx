import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products, categories, brands } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SlidersHorizontal, X } from "lucide-react";

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedBrand) result = result.filter(p => p.brand === selectedBrand);
    result = result.filter(p => p.discountPrice >= priceRange[0] && p.discountPrice <= priceRange[1]);

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case "price-high":
        result.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case "newest":
        result.reverse();
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [selectedCategory, selectedBrand, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange([0, 20000]);
    setSortBy("popularity");
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? "" : cat.name)}
              className={`block w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                selectedCategory === cat.name
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Brand</h4>
        <div className="space-y-2">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(selectedBrand === brand ? "" : brand)}
              className={`block w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                selectedBrand === brand
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Price Range</h4>
        <div className="flex items-center gap-2 text-sm">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span className="text-muted-foreground">—</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={0}
          max={20000}
          step={500}
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full mt-2 accent-accent"
        />
      </div>

      <button
        onClick={clearFilters}
        className="text-sm text-accent hover:underline"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">
              {selectedCategory || "All Products"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} products</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-secondary text-sm rounded-md px-3 py-2 outline-none border border-border"
            >
              <option value="popularity">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
            </select>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="md:hidden p-2 rounded-md border border-border hover:bg-secondary transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-56 shrink-0">
            <FilterSidebar />
          </aside>

          {/* Mobile Filters */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 bg-background md:hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-heading font-bold">Filters</h3>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No products found</p>
                <button onClick={clearFilters} className="text-accent mt-2 hover:underline text-sm">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductListing;
