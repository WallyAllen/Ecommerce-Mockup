CREATE OR REPLACE FUNCTION create_order_atomic(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_delivery_method TEXT,
  p_payment_method TEXT,
  p_total NUMERIC,
  p_status TEXT,
  p_expires_at TIMESTAMPTZ,
  p_items JSONB
) RETURNS JSONB AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_product_id UUID;
  v_size TEXT;
  v_quantity INT;
  v_price NUMERIC;
  v_stock INT;
BEGIN
  -- Insert the order
  INSERT INTO orders (
    customer_name, customer_email, customer_phone, 
    delivery_method, payment_method, total, status, expires_at
  ) VALUES (
    p_customer_name, p_customer_email, p_customer_phone, 
    p_delivery_method, p_payment_method, p_total, p_status, p_expires_at
  ) RETURNING id INTO v_order_id;

  -- Process each item in the JSON array
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_size := v_item->>'size';
    v_quantity := (v_item->>'quantity')::INT;
    v_price := (v_item->>'price')::NUMERIC;

    -- Lock the row for update to prevent concurrent race conditions
    SELECT stock_quantity INTO v_stock
    FROM product_sizes
    WHERE product_id = v_product_id AND size = v_size
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Producto % talla % no encontrado en product_sizes', v_product_id, v_size;
    END IF;

    IF v_stock < v_quantity THEN
      RAISE EXCEPTION 'Stock insuficiente para producto % talla % (stock: %, pedido: %)', v_product_id, v_size, v_stock, v_quantity;
    END IF;

    -- Deduct stock
    UPDATE product_sizes
    SET stock_quantity = stock_quantity - v_quantity
    WHERE product_id = v_product_id AND size = v_size;

    -- Insert order item
    INSERT INTO order_items (
      order_id, product_id, size, quantity, price_at_purchase
    ) VALUES (
      v_order_id, v_product_id, v_size, v_quantity, v_price
    );
  END LOOP;

  RETURN jsonb_build_object('order_id', v_order_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
