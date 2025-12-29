#!/bin/bash
set -e

echo "=== Starting Application ==="

# Display database configuration for debugging (without sensitive data)
echo "Database Configuration Check:"
echo "  DB_CONNECTION: ${DB_CONNECTION:-not set}"
echo "  DB_HOST: ${DB_HOST:-not set (defaults to 127.0.0.1)}"
echo "  DB_DATABASE: ${DB_DATABASE:-not set}"
if [ -n "$DB_URL" ]; then
    echo "  DB_URL: set (using connection string)"
fi

# Verify database connection is configured
if [ -z "$DB_CONNECTION" ]; then
    echo "WARNING: DB_CONNECTION is not set. Defaulting to sqlite."
    echo "For Render deployment, set DB_CONNECTION=pgsql"
fi

if [ "$DB_CONNECTION" = "pgsql" ]; then
    if [ -z "$DB_HOST" ] && [ -z "$DB_URL" ]; then
        echo "ERROR: DB_CONNECTION=pgsql but DB_HOST and DB_URL are not set!"
        echo "Please set DB_HOST to your Render PostgreSQL host (NOT 127.0.0.1)"
        echo "Or set DB_URL to your Render PostgreSQL connection string"
        exit 1
    fi
    
    if [ -n "$DB_HOST" ] && [ "$DB_HOST" = "127.0.0.1" ]; then
        echo "ERROR: DB_HOST is set to 127.0.0.1 (localhost)"
        echo "This will not work on Render. Set DB_HOST to your Render PostgreSQL host."
        exit 1
    fi
fi

echo "Clearing old cache..."
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true
php artisan event:clear || true
php artisan cache:clear || echo "Cache clear skipped"

# Test database connection before running migrations
echo "Testing database connection..."
if php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database connection successful';" 2>/dev/null; then
    echo "✓ Database connection verified"
else
    echo "⚠ Database connection test failed, but continuing..."
    echo "This may be normal if the database is spinning up (Render free plan)"
fi

# Wait for database to be ready (for Render free plan spin-up)
echo "Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if php artisan migrate:status --no-interaction 2>/dev/null; then
        echo "✓ Database is ready"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        echo "  Waiting for database... ($RETRY_COUNT/$MAX_RETRIES)"
        sleep 2
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "⚠ Database connection timeout after $MAX_RETRIES attempts"
    echo "Continuing with migration attempt..."
fi

echo "Running migrations..."
if php artisan migrate --force; then
    echo "✓ Migrations completed successfully"
    
    # Seed admin user (will create or update if exists)
    echo "Seeding admin user..."
    if php artisan db:seed --class=AdminSeeder --force; then
        echo "✓ Admin user seeded successfully (email: admin@example.com, password: password)"
    else
        echo "⚠ Admin seeder failed - you may need to create admin user manually"
        echo "Run: php artisan db:seed --class=AdminSeeder"
    fi
else
    echo "⚠ Migration failed. Check database connection and credentials."
    echo "Continuing anyway - application may not function correctly."
fi

echo "Optimizing application..."
php artisan config:cache || echo "Config cache skipped"
php artisan route:cache || echo "Route cache skipped"
php artisan view:cache || echo "View cache skipped"

echo "Starting Apache..."
exec apache2-foreground

