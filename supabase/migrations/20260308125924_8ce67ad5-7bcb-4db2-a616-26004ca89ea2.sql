
-- Product inventory table
CREATE TABLE public.product_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text UNIQUE NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_inventory ENABLE ROW LEVEL SECURITY;

-- Anyone can read inventory (to show stock status)
CREATE POLICY "Anyone can read inventory"
  ON public.product_inventory FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only admins can manage inventory
CREATE POLICY "Admins can manage inventory"
  ON public.product_inventory FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed with all products at default stock of 100
INSERT INTO public.product_inventory (product_name, stock) VALUES
  ('Groundnut Oil', 100),
  ('Mustard Oil', 100),
  ('Coconut Oil', 100),
  ('Red Chilly Powder', 100),
  ('Turmeric Powder', 100),
  ('Coriander Powder', 100);

-- Function to decrement stock after order
CREATE OR REPLACE FUNCTION public.decrement_stock(p_product_name text, p_quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.product_inventory
  SET stock = GREATEST(0, stock - p_quantity), updated_at = now()
  WHERE product_name = p_product_name;
END;
$$;
