#!/bin/bash
set -e

echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs

echo "Build completed successfully!"

