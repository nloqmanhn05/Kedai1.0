# Normalized ER Diagram and Schema

This file contains the normalized ER diagram (Mermaid) for the app and a compact Postgres schema.

## Mermaid ER Diagram

```mermaid
erDiagram
    APP_USER ||--o{ TRANSACTION_TBL : "creates"
    APP_USER {
        uuid id PK
        text email
        text password_hash
        text role
        timestamptz created_at
    }

    TRANSACTION_TBL ||--o{ ORDER_ITEM : "includes"
    TRANSACTION_TBL ||--o{ LEDGER_ENTRY : "records"
    TRANSACTION_TBL {
        uuid id PK
        uuid user_id FK
        numeric total_amount
        text payment_method
        text status
        timestamptz timestamp
    }

    ORDER_ITEM {
        uuid id PK
        uuid transaction_id FK
        uuid menu_item_id FK
        int quantity
        numeric unit_price
        numeric subtotal
    }

    MENU_CATEGORY ||--o{ MENU_ITEM : "contains"
    MENU_CATEGORY {
        uuid id PK
        text name
        text description
    }

    MENU_ITEM ||--o{ ORDER_ITEM : "ordered in"
    MENU_ITEM {
        uuid id PK
        uuid category_id FK
        text name
        numeric price
        boolean is_available
        text image_url
    }

    STAFF ||--o{ SHIFT : "works"
    STAFF {
        uuid id PK
        text full_name
        text ic_number
        text phone
        text email
        text role
        date join_date
        numeric hourly_rate
    }

    SHIFT {
        uuid id PK
        uuid staff_id FK
        timestamptz start_time
        timestamptz end_time
        text status
    }

    LEDGER_ENTRY {
        uuid id PK
        uuid transaction_id FK
        text type
        numeric amount
        text description
        timestamptz date
    }
```

## Compact Postgres Schema (recommended)

```sql
-- Enable extension if needed:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE app_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE menu_category (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text
);

CREATE TABLE menu_item (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES menu_category(id) ON DELETE SET NULL,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  image_url text
);

CREATE TABLE transaction_tbl (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES app_user(id) ON DELETE SET NULL,
  total_amount numeric(12,2) NOT NULL,
  payment_method text,
  status text,
  timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_item (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transaction_tbl(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_item(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL,
  subtotal numeric(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

CREATE TABLE ledger_entry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transaction_tbl(id) ON DELETE SET NULL,
  type text NOT NULL,
  amount numeric(12,2) NOT NULL,
  description text,
  date timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  ic_number text,
  phone text,
  email text,
  role text,
  join_date date,
  hourly_rate numeric(10,2)
);

CREATE TABLE shift (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  start_time timestamptz,
  end_time timestamptz,
  status text
);

-- Indexes
CREATE INDEX idx_menu_item_category ON menu_item(category_id);
CREATE INDEX idx_transaction_user ON transaction_tbl(user_id);
CREATE INDEX idx_order_item_transaction ON order_item(transaction_id);
CREATE INDEX idx_ledger_transaction ON ledger_entry(transaction_id);
CREATE INDEX idx_shift_staff ON shift(staff_id);
```

---
If you'd like, I can also export this diagram as PNG/SVG or add the SQL to a migration file.
