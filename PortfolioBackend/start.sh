#!/bin/bash
set -e

echo "Clearing old cache..."
# Clear cache that doesn't require database connection
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true
php artisan event:clear || true

# Only clear database cache if database is available
php artisan cache:clear || echo "Cache clear skipped (database may not be available yet)"

echo "Running migrations..."
php artisan migrate --force

echo "Optimizing application..."
php artisan config:cache || echo "Config cache skipped (non-fatal)"
php artisan route:cache || echo "Route cache skipped (non-fatal)"
php artisan view:cache || echo "View cache skipped (non-fatal)"

echo "Starting Apache..."
exec apache2-foreground

