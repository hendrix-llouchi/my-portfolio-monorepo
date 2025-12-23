#!/bin/bash
set -e

echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs

echo "Build completed successfully!"
echo "Note: Cache optimization will happen after migrations in the start command."

