#!/bin/bash
set -e

echo "Clearing old cache..."
php artisan optimize:clear || true
php artisan config:clear || true

echo "Running migrations..."
php artisan migrate --force

echo "Optimizing application..."
php artisan config:cache || echo "Config cache skipped (non-fatal)"
php artisan route:cache || echo "Route cache skipped (non-fatal)"
php artisan view:cache || echo "View cache skipped (non-fatal)"

echo "Starting Apache..."
exec apache2-foreground

