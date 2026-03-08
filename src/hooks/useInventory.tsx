import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface InventoryItem {
  id: string;
  product_name: string;
  stock: number;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = useCallback(async () => {
    const { data } = await supabase
      .from("product_inventory")
      .select("id, product_name, stock")
      .order("product_name");
    if (data) setInventory(data as InventoryItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const getStock = useCallback(
    (productName: string) => {
      const item = inventory.find((i) => i.product_name === productName);
      return item ? item.stock : 0;
    },
    [inventory]
  );

  const isOutOfStock = useCallback(
    (productName: string) => getStock(productName) <= 0,
    [getStock]
  );

  return { inventory, loading, getStock, isOutOfStock, refetch: fetchInventory };
};
