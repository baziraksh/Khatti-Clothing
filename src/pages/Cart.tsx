import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const discount = couponApplied ? Math.round(cartTotal * 0.1) : 0;
  const total = cartTotal + shipping + tax - discount;

  const applyCoupon = () => {
    if (coupon.toLowerCase() === "khatti10") {
      setCouponApplied(true);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-heading text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-md font-medium"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
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
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-8">Shopping Cart ({cart.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => (
              <motion.div
                key={item.product.id + item.selectedSize + item.selectedColor}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 bg-card rounded-lg border border-border"
              >
                <Link to={`/product/${item.product.id}`} className="w-24 h-24 rounded-md overflow-hidden bg-secondary shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-heading font-semibold text-sm truncate hover:text-accent transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.selectedSize} · {item.selectedColor}
                  </p>
                  <p className="font-heading font-bold mt-2">₹{item.product.discountPrice.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-md">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-secondary">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-secondary">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card rounded-lg border border-border p-6 h-fit sticky top-24">
            <h3 className="font-heading font-bold text-lg mb-4">Order Summary</h3>

            {/* Coupon */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder='Try "KHATTI10"'
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                className="flex-1 bg-secondary rounded-md px-3 py-2 text-sm outline-none border border-border focus:border-accent"
              />
              <button
                onClick={applyCoupon}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
              >
                Apply
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (18% GST)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-success">
                  <span>Coupon (10%)</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-heading font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={async () => {
                if (!user) {
                  toast.info("Please sign in to place an order");
                  navigate("/auth");
                  return;
                }
                setPlacingOrder(true);
                try {
                  const { data: order, error: orderError } = await supabase
                    .from("orders")
                    .insert({
                      user_id: user.id,
                      total_amount: total,
                      shipping_amount: shipping,
                      tax_amount: tax,
                      discount_amount: discount,
                      payment_status: "paid" as any,
                      order_status: "pending" as any,
                      coupon_code: couponApplied ? coupon : null,
                    })
                    .select()
                    .single();

                  if (orderError) throw orderError;

                  const items = cart.map(item => ({
                    order_id: order.id,
                    product_id: item.product.id,
                    product_name: item.product.name,
                    product_image: item.product.images[0],
                    size: item.selectedSize,
                    color: item.selectedColor,
                    quantity: item.quantity,
                    price: item.product.discountPrice * item.quantity,
                  }));

                  const { error: itemsError } = await supabase.from("order_items").insert(items);
                  if (itemsError) throw itemsError;

                  clearCart();
                  toast.success("Order placed successfully!");
                  navigate("/orders");
                } catch (err: any) {
                  toast.error(err.message || "Failed to place order");
                } finally {
                  setPlacingOrder(false);
                }
              }}
              disabled={placingOrder}
              className="w-full bg-accent text-accent-foreground py-3 rounded-md font-medium mt-6 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
