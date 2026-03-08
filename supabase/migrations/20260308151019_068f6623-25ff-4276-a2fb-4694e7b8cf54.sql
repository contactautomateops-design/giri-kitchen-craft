
-- Create products table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  weight text NOT NULL,
  price integer NOT NULL,
  mrp integer NOT NULL,
  emoji text NOT NULL DEFAULT '📦',
  accent text NOT NULL DEFAULT '#E87000',
  badge text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can read active products
CREATE POLICY "Anyone can read active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Admins can manage all products
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Storage policies: anyone can view, admins can upload/delete
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- Seed existing products
INSERT INTO public.products (name, weight, price, mrp, emoji, accent, badge, category, image_url) VALUES
  ('Groundnut Oil', '1 Litre', 199, 240, '🥜', '#E87000', 'BESTSELLER', 'oils', '/images/product-groundnut-oil.jpg'),
  ('Mustard Oil', '1 Litre', 179, 210, '🌻', '#F5C518', 'PURE', 'oils', '/images/product-mustard-oil.jpg'),
  ('Coconut Oil', '500 ml', 249, 299, '🥥', '#C4874A', 'BESTSELLER', 'oils', '/images/product-coconut-oil.jpg'),
  ('Red Chilly Powder', '200 g', 89, 110, '🌶️', '#C0392B', 'PURE', 'spices', '/images/product-red-chilly.jpg'),
  ('Turmeric Powder', '200 g', 79, 99, '🟡', '#F39C12', 'PURE', 'spices', '/images/product-turmeric.jpg'),
  ('Coriander Powder', '200 g', 75, 95, '🌿', '#2D5A27', 'BESTSELLER', 'spices', '/images/product-coriander.jpg');

-- Add realtime for products
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
