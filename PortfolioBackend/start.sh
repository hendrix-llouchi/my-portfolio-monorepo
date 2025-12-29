#!/bin/bash
set -e

echo "Clearing old cache..."
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true
php artisan event:clear || true
php artisan cache:clear || echo "Cache clear skipped"

echo "Running migrations..."
php artisan migrate --force

echo "Optimizing application..."
php artisan config:cache || echo "Config cache skipped"
php artisan route:cache || echo "Route cache skipped"
php artisan view:cache || echo "View cache skipped"

echo "Starting Apache..."
exec apache2-foreground

