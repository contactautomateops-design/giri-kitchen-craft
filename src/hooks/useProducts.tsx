import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  weight: string;
  price: number;
  mrp: number;
  emoji: string;
  accent: string;
  badge: string;
  category: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setProducts(data as Product[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();

    // Realtime subscription
    const channel = supabase
      .channel("products-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchProducts]);

  const activeProducts = products.filter((p) => p.is_active);

  return { products, activeProducts, loading, refetch: fetchProducts };
};
