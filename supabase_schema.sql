-- Supabase Schema para Importados Berisso

-- 1. Tabla de Productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Talles y Stock (Product Sizes)
CREATE TABLE product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(10) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, size)
);

-- 3. Tabla de Órdenes (Orders)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  delivery_method VARCHAR(20) NOT NULL, -- 'retiro', 'envio'
  payment_method VARCHAR(20) NOT NULL, -- 'tarjeta', 'efectivo'
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'cancelled', 'shipped'
  total NUMERIC(10, 2) NOT NULL,
  mercadopago_id VARCHAR(100),
  mercadopago_preference_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Ítems de Órdenes (Order Items)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  size VARCHAR(10) NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase NUMERIC(10, 2) NOT NULL
);

-- Políticas de RLS (Row Level Security) - Solo lectura para productos, el server inserta órdenes.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de productos" ON products FOR SELECT USING (true);
CREATE POLICY "Lectura pública de talles" ON product_sizes FOR SELECT USING (true);
-- Órdenes y Order Items solo accesibles desde el server via service_role key o con policies restrictivas.

-- 5. Data Inicial (Seed) para probar el sistema
INSERT INTO products (id, name, description, price, category, image_url, is_new)
VALUES 
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Buzo Jordan Essential', 'Buzo clásico Jordan premium', 65000, 'buzos', '/images/buzo-new.png', true),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Jogger Nike Club', 'Jogger liviano de entrenamiento', 45000, 'pantalones', '/images/jogger.png', false),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Gorra NY Yankees', 'Gorra clásica New Era', 25000, 'accesorios', '/images/gorra-new.png', false);

INSERT INTO product_sizes (product_id, size, stock_quantity)
VALUES 
  ('a1b2c3d4-0000-0000-0000-000000000001', 'S', 5),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'M', 0),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'L', 2),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'M', 10),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Único', 15);
