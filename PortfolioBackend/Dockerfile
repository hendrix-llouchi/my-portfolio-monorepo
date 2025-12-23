# Use PHP with Apache
FROM php:8.2-apache

# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql zip

# 2. Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 3. Set working directory
WORKDIR /var/www/html

# 4. Copy dependency files first
COPY composer.json composer.lock ./

# 5. Install PHP packages (ADDED --no-scripts to fix your error)
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs --no-scripts

# 6. Copy the rest of the application (including 'artisan')
COPY . .

# 7. Now run the scripts (since artisan is finally here)
RUN composer dump-autoload --optimize

# 8. Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Configure Apache DocumentRoot
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# ⚠️ NEW LINE HERE: Enable Apache mod_rewrite for Laravel routes
RUN a2enmod rewrite

# 9. Use Render's dynamic port
RUN sed -i 's/80/${PORT}/g' /etc/apache2/ports.conf /etc/apache2/sites-available/*.conf