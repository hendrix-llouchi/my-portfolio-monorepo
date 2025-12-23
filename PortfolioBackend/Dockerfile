FROM php:8.2-apache

# 1. Install dependencies & extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql zip

# 2. Enable Apache Rewrite Module (REQUIRED for Laravel)
RUN a2enmod rewrite

# 3. Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Set working directory
WORKDIR /var/www/html

# 5. Copy Composer files
COPY composer.json composer.lock ./

# 6. Install PHP packages (No scripts yet)
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs --no-scripts

# 7. Copy the rest of the app
COPY . .

# 8. Run Composer scripts now that files are present
RUN composer dump-autoload --optimize

# 9. Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 10. Configure Apache DocumentRoot
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# 11. ⚠️ CRITICAL FIX: Force AllowOverride All so .htaccess works
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# 12. Use Render's dynamic port
RUN sed -i 's/80/${PORT}/g' /etc/apache2/ports.conf /etc/apache2/sites-available/*.conf