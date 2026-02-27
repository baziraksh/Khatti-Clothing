export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discountPrice: number;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: string[];
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface WishlistItem {
  product: Product;
}
