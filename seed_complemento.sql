-- 1. Actualizar la Gorra para que su categoría sea 'gorras' en lugar de 'accesorios'
UPDATE products SET category = 'gorras' WHERE name = 'Gorra NY Yankees';

-- 2. Insertar Zapatillas (Calzado)
INSERT INTO products (id, name, description, price, category, image_url, is_new)
VALUES ('b2c3d4e5-0000-0000-0000-000000000001', 'Zapatillas DC White', 'Zapatillas urbanas DC clásicas', 115000, 'calzado', '/images/calzado.png', true);

INSERT INTO product_sizes (product_id, size, stock_quantity)
VALUES 
  ('b2c3d4e5-0000-0000-0000-000000000001', '39', 2),
  ('b2c3d4e5-0000-0000-0000-000000000001', '40', 0),
  ('b2c3d4e5-0000-0000-0000-000000000001', '41', 5);

-- 3. Insertar Perfume
INSERT INTO products (id, name, description, price, category, image_url, is_new)
VALUES ('b2c3d4e5-0000-0000-0000-000000000002', 'Perfume Asad Lattafa', 'Perfume árabe importado 100ml', 95000, 'perfumes', '/images/perfume.png', true);

INSERT INTO product_sizes (product_id, size, stock_quantity)
VALUES 
  ('b2c3d4e5-0000-0000-0000-000000000002', 'Único', 10);

-- 4. Insertar Accesorio (Reloj)
INSERT INTO products (id, name, description, price, category, image_url, is_new)
VALUES ('b2c3d4e5-0000-0000-0000-000000000003', 'Reloj Lacoste White', 'Reloj de silicona blanco Lacoste', 35000, 'accesorios', '/images/reloj.png', false);

INSERT INTO product_sizes (product_id, size, stock_quantity)
VALUES 
  ('b2c3d4e5-0000-0000-0000-000000000003', 'Único', 3);
