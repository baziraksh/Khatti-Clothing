import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
  discount_amount: number;
  payment_status: string;
  order_status: string;
  shipping_address: any;
  coupon_code: string | null;
  created_at: string;
  items?: OrderItem[];
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "bg-blue-500/10 text-blue-500 border-blue-500/20", label: "Confirmed" },
  shipped: { icon: Truck, color: "bg-purple-500/10 text-purple-500 border-purple-500/20", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "bg-green-500/10 text-green-500 border-green-500/20", label: "Delivered" },
  cancelled: { icon: XCircle, color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Cancelled" },
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map(o => o.id);
        const { data: itemsData } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds);

        const ordersWithItems = ordersData.map(order => ({
          ...order,
          items: (itemsData || []).filter(item => item.order_id === order.id),
        }));
        setOrders(ordersWithItems as Order[]);
      } else {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-pulse text-muted-foreground">Loading orders...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-accent text-accent-foreground px-6 py-3 rounded-md font-medium hover:opacity-90"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.order_status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const isExpanded = expandedOrder === order.id;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-4 md:p-6 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="hidden sm:block">
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-semibold text-sm truncate">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                      <span className="font-heading font-bold text-sm whitespace-nowrap">
                        ₹{Number(order.total_amount).toLocaleString()}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="p-4 md:p-6 space-y-4">
                          {/* Items */}
                          <div className="space-y-3">
                            {order.items?.map((item) => (
                              <div key={item.id} className="flex gap-3 items-center">
                                <div className="w-12 h-12 bg-secondary rounded-md overflow-hidden shrink-0">
                                  <img
                                    src={item.product_image || "/placeholder.svg"}
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{item.product_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.size} · {item.color} · Qty: {item.quantity}
                                  </p>
                                </div>
                                <span className="text-sm font-semibold">₹{Number(item.price).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          {/* Summary */}
                          <div className="border-t border-border pt-3 space-y-1 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                              <span>Shipping</span>
                              <span>{Number(order.shipping_amount) === 0 ? "FREE" : `₹${Number(order.shipping_amount)}`}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Tax</span>
                              <span>₹{Number(order.tax_amount).toLocaleString()}</span>
                            </div>
                            {Number(order.discount_amount) > 0 && (
                              <div className="flex justify-between text-green-500">
                                <span>Discount</span>
                                <span>-₹{Number(order.discount_amount).toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold pt-1">
                              <span>Total</span>
                              <span>₹{Number(order.total_amount).toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Payment status */}
                          <div className="text-xs text-muted-foreground">
                            Payment: <span className="capitalize">{order.payment_status}</span>
                            {order.coupon_code && <> · Coupon: {order.coupon_code}</>}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
