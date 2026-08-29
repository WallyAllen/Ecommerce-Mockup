# Arquitectura del Sistema de Reservas

Este documento define la lógica operativa para gestionar el inventario mediante el "Ecosistema Autónomo", basándose en las reglas de negocio de Importados Berisso.

## 1. Reglas de Negocio
- **Reserva Sin Seña:** Expira automáticamente a las 24 horas exactas de haberse generado.
- **Reserva Con Seña:** Expira a los 10 días de haberse acreditado el pago parcial.

## 2. Flujo de Datos (Web -> Supabase -> n8n -> WhatsApp)

### Paso 1: El Frontend (Next.js)
Cuando el usuario selecciona "Reservar (Transf / Efectivo)" en el checkout:
1. Se inserta la orden en Supabase con `status = 'pending'`, `payment_method = 'efectivo'`.
2. El backend calcula y guarda `expires_at = NOW() + INTERVAL '24 hours'`.
3. Se dispara el webhook hacia **n8n** notificando el nuevo lead.

### Paso 2: El Triage IA (n8n + Gemini)
1. La IA inicia la conversación por WhatsApp:
   *"¡Hola! Reservamos tu prenda por 24hs. ⏳ Si querés asegurar el stock por 10 días, podés dejar una seña transfiriendo a este CBU. Si transferís el total o la seña, enviame el comprobante por acá."*

### Paso 3: Acreditación (Validación de Comprobante)
1. El usuario envía una imagen. n8n utiliza Gemini Vision para leer el comprobante.
2. Si el monto coincide con una **Seña**:
   - Supabase Update: `deposit_amount = [monto]`, `status = 'reserved_deposit'`, `expires_at = NOW() + INTERVAL '10 days'`.
   - La IA responde: *"¡Seña acreditada! Tenés 10 días para abonar el resto y retirar/coordinar envío."*
3. Si el monto coincide con el **Total**:
   - Supabase Update: `status = 'paid'`, `deposit_amount = [total]`.
   - La IA responde coordinando la entrega.

### Paso 4: Cron de Expiración (El "Cobrador Automático")
n8n corre un cronograma (ej. cada 1 hora) que consulta en Supabase:
`SELECT * FROM orders WHERE status IN ('pending', 'reserved_deposit') AND expires_at < NOW()`

Para cada orden vencida:
1. Se libera el stock en `product_sizes` (+1 al inventario).
2. `status` pasa a `'cancelled'`.
3. La IA envía un mensaje final de ruptura: *"Tu reserva ha expirado y el artículo ha vuelto al stock público."*
