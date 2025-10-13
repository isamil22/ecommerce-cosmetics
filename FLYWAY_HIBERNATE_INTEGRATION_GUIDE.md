# Flyway + Hibernate Integration Guide

## Overview

This project now uses **Flyway** for database schema versioning and **Hibernate in validate mode** to ensure schema consistency. This approach provides:

- ✅ **Version-controlled database migrations**
- ✅ **Safe schema changes without data loss**
- ✅ **Automatic validation on startup**
- ✅ **Team collaboration with consistent schemas**

---

## What Changed

### 1. Dependencies Added (`pom.xml`)

Two Flyway dependencies were added:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

### 2. Configuration Updated (`application.properties`)

**Before:**
```properties
spring.jpa.hibernate.ddl-auto=update
```

**After:**
```properties
# Flyway Configuration
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
spring.flyway.baseline-version=0

# Hibernate Configuration (validate mode - Flyway manages schema)
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
```

**Key Changes:**
- `spring.jpa.hibernate.ddl-auto=validate` - Hibernate will only validate the schema, not modify it
- `spring.flyway.enabled=true` - Enables Flyway migrations
- `spring.flyway.baseline-on-migrate=true` - Allows Flyway to work with existing databases
- `spring.jpa.show-sql=true` - Logs SQL queries for debugging

### 3. Migration Files Created

Created folder structure:
```
demo/src/main/resources/db/migration/
└── V1__init_schema.sql
```

The migration file includes all tables for:
- **Core Entities**: Users, Categories, Products
- **Product Variants**: VariantType, VariantOption, ProductVariant
- **Cart System**: Cart, CartItem
- **Coupon System**: Coupons, CouponDailyUsage, and join tables
- **Order System**: Orders, OrderItem
- **Pack System**: Packs, PackItems, CustomPack, and related tables
- **Content**: Reviews, Comments
- **Settings**: Hero, Countdown, Announcement, Settings, NotificationSettings, EnhancedVisitorCounterSettings

### 4. Docker Configuration Verified

The `docker-compose.yml` already has persistent volume configured:

```yaml
volumes:
  - db_data:/var/lib/mysql

volumes:
  db_data:
```

This ensures **no data loss** when containers restart.

---

## How It Works

### On First Startup (New Database)

1. **Flyway** checks if the database exists
2. Creates `flyway_schema_history` table to track migrations
3. Runs all migration files in order (V1, V2, V3, etc.)
4. **Hibernate** validates that entities match the schema
5. Application starts successfully

### On Existing Database

1. **Flyway** checks `flyway_schema_history`
2. With `baseline-on-migrate=true`, it baselines the existing database
3. Only runs new migrations (if any)
4. **Hibernate** validates the schema
5. Application starts successfully

### On Subsequent Restarts

1. **Flyway** checks if any new migrations need to run
2. Applies only pending migrations
3. **Hibernate** validates the schema
4. All existing data remains intact

---

## Testing Instructions

### Test 1: Fresh Start (Clean Database)

```bash
# Stop and remove existing containers
docker-compose down

# Remove the database volume (optional - only if you want a fresh start)
docker volume rm ecommerce-basic_db_data

# Start the services
docker-compose up --build

# Expected output in backend logs:
# - "Flyway Community Edition x.x.x by Redgate"
# - "Successfully validated x migrations"
# - "Migrating schema `sms` to version 1 - init schema"
# - "Successfully applied 1 migration to schema `sms`"
# - Application starts successfully
```

### Test 2: With Existing Data (Safe Migration)

```bash
# Keep existing containers and data
docker-compose down

# Rebuild and restart (data persists in volume)
docker-compose up --build

# Expected output:
# - Flyway baselines existing database
# - No migrations run (already up to date)
# - Hibernate validates schema successfully
# - All existing data intact
```

### Test 3: Verify Data Persistence

1. Access phpMyAdmin at `http://localhost:8083`
   - Host: `db`
   - Username: `user`
   - Password: `password`

2. Check the `flyway_schema_history` table:
   ```sql
   SELECT * FROM flyway_schema_history;
   ```
   
   You should see entries for each migration run.

3. Verify your data tables still contain all records

### Test 4: Adding New Migrations

When you need to add a new column or table:

1. Create a new migration file (e.g., `V2__add_product_rating.sql`):
   ```sql
   -- V2__add_product_rating.sql
   ALTER TABLE product ADD COLUMN average_rating DECIMAL(3,2);
   ```

2. Update your JPA entity:
   ```java
   @Entity
   public class Product {
       // ... existing fields ...
       private BigDecimal averageRating;
   }
   ```

3. Restart the application:
   - Flyway runs V2 migration
   - Hibernate validates the updated schema
   - All existing data remains intact

---

## Important Notes

### ✅ Data Safety

- **Existing data is preserved** - Flyway only modifies schema structure
- **Persistent volumes** ensure data survives container restarts
- **Baseline migration** allows integration with existing databases

### ✅ Schema Validation

- Hibernate's `validate` mode catches mismatches between entities and database
- Application won't start if schema doesn't match entities
- Forces you to create proper migrations

### ⚠️ Migration Best Practices

1. **Never modify existing migrations** - Once applied, they're immutable
2. **Always create new migrations** for schema changes
3. **Test migrations locally** before deploying
4. **Use descriptive names** for migration files
5. **Keep migrations small** and focused on one change

### 📝 Naming Convention

Flyway migration files follow this pattern:
```
V{version}__{description}.sql

Examples:
V1__init_schema.sql
V2__add_product_rating.sql
V3__create_wishlist_table.sql
V4__add_user_preferences.sql
```

### 🔍 Troubleshooting

**Error: "Validate failed: Migration checksum mismatch"**
- A migration file was modified after being applied
- Solution: Never modify applied migrations; create a new one

**Error: "Schema validation failed"**
- Entity structure doesn't match database schema
- Solution: Create a migration to update the schema or fix the entity

**Error: "Table already exists"**
- Database already has tables but no Flyway history
- Solution: `baseline-on-migrate=true` handles this automatically

---

## Local Development vs Docker

### Local Development (localhost:3306)

When running Spring Boot locally (without Docker):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sms?useSSL=false&serverTimezone=UTC
```

Flyway will run against your local MySQL instance.

### Docker Development (db:3306)

When running in Docker Compose:

```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/sms
```

Flyway will run against the containerized MySQL instance.

---

## Next Steps

1. **Run the tests** above to verify integration
2. **Check application logs** for Flyway execution
3. **View `flyway_schema_history` table** in phpMyAdmin
4. **Create new migrations** as your schema evolves

---

## Database Schema Covered

The initial migration (`V1__init_schema.sql`) creates all tables for:

### Core Tables
- `users` - User accounts with roles and authentication
- `categories` - Product categories
- `product` - Products with pricing and inventory
- `product_images` - Product image URLs

### Product Variants
- `variant_type` - Variant types (e.g., Size, Color)
- `variant_option` - Variant options (e.g., Small, Medium, Large)
- `product_variant` - Specific product variants with pricing
- `product_variant_attributes` - Variant attribute mappings

### Cart & Orders
- `cart` - Shopping carts
- `cart_item` - Items in carts
- `orders` - Customer orders
- `order_item` - Items in orders

### Coupons
- `coupons` - Discount coupons
- `coupon_products` - Product-specific coupons
- `coupon_categories` - Category-specific coupons
- `coupon_daily_usage` - Coupon usage analytics

### Packs
- `packs` - Pre-configured product bundles
- `pack_items` - Items in packs
- `pack_item_variations` - Alternative products for pack items
- `custom_pack` - User-configurable packs
- `custom_pack_allowed_products` - Products allowed in custom packs
- `pack_recommended_products` - Product recommendations for packs
- `pack_recommended_packs` - Pack recommendations
- `pack_recommended_custom_packs` - Custom pack recommendations

### Reviews & Comments
- `review` - Product reviews
- `comment` - Comments on products/packs
- `comment_images` - Comment images

### Settings & Content
- `settings` - Key-value configuration
- `announcement` - Site announcements
- `hero` - Hero section content
- `countdown` - Countdown timers
- `notification_settings` - Notification preferences
- `enhanced_visitor_counter_settings` - Visitor counter configuration

### Associations
- `product_frequently_bought_together` - FBT recommendations

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `docker-compose up --build` | Start services with latest code |
| `docker-compose down` | Stop services (keeps data) |
| `docker volume rm ecommerce-basic_db_data` | Delete database (⚠️ loses all data) |
| `docker-compose logs backend` | View backend logs |

Access Points:
- **Backend API**: http://localhost:8082
- **Frontend**: http://localhost:8081
- **phpMyAdmin**: http://localhost:8083

---

## Success Criteria ✅

- [x] Flyway dependency added to pom.xml
- [x] Application.properties configured correctly
- [x] Migration folder structure created
- [x] V1 migration file created with all tables
- [x] Docker volumes persist data
- [x] Hibernate set to validate mode
- [x] Documentation complete

**Your project is now ready to run with Flyway + Hibernate validation!**

