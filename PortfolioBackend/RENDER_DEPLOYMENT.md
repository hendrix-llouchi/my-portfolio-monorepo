# Render.com Deployment Guide

## Critical Issues to Fix

### 1. Database Configuration (500 Errors)

**Problem:** Render.com uses an ephemeral filesystem, so SQLite files are not persistent. You need to use PostgreSQL.

**Solution:**

1. **Create a PostgreSQL Database on Render:**
   - Go to your Render dashboard
   - Click "New +" → "PostgreSQL"
   - Create a new database instance
   - Note the connection details

2. **Update Environment Variables on Render:**
   In your Render service settings, add these environment variables:

   ```env
   DB_CONNECTION=pgsql
   DB_HOST=<your-postgres-host>
   DB_PORT=5432
   DB_DATABASE=<your-database-name>
   DB_USERNAME=<your-username>
   DB_PASSWORD=<your-password>
   ```

   **Important:** Render provides these values automatically if you link the database to your service. Check the "Environment" tab in your Render service.

3. **Run Migrations:**
   Add a build command in your Render service settings:
   ```bash
   php artisan migrate --force
   ```

   Or add it to your build script.

### 2. Application Key

Ensure `APP_KEY` is set in Render environment variables:
```bash
php artisan key:generate
```
Copy the generated key to Render environment variables as `APP_KEY`.

### 3. Required Environment Variables

Set these in your Render service:

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=<your-application-key>

# Database (PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=<from-render-postgres>
DB_PORT=5432
DB_DATABASE=<from-render-postgres>
DB_USERNAME=<from-render-postgres>
DB_PASSWORD=<from-render-postgres>

# CORS (if needed)
# Add your frontend URL to allowed origins in config/cors.php

# Mail Configuration (if using email)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Portfolio Backend"

# Queue (if using email)
QUEUE_CONNECTION=database
```

### 4. Build & Start Commands

**Build Command:**
```bash
composer install --no-dev --optimize-autoloader --no-interaction
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Start Command:**
```bash
php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
```

**Note:** Render sets the `$PORT` environment variable automatically.

### 5. Queue Worker (Optional - for emails)

If you need email functionality, create a separate Background Worker service on Render:

**Start Command:**
```bash
php artisan queue:work --tries=3 --timeout=60
```

### 6. Verify Deployment

After deployment, test these endpoints:
- `https://your-service.onrender.com/api/profile`
- `https://your-service.onrender.com/api/skills`
- `https://your-service.onrender.com/api/experiences`
- `https://your-service.onrender.com/api/projects`

### 7. Common Issues

**500 Errors:**
- Check Render logs for specific error messages
- Verify database connection settings
- Ensure migrations have run
- Check that all required environment variables are set

**Database Connection Errors:**
- Verify PostgreSQL database is created and linked
- Check database credentials match Render's provided values
- Ensure `DB_CONNECTION=pgsql` is set

**CORS Errors:**
- Update `config/cors.php` to include your frontend domain
- Or set `CORS_ALLOWED_ORIGINS` environment variable

### 8. Quick Checklist

- [ ] PostgreSQL database created on Render
- [ ] Database linked to your service
- [ ] All environment variables set
- [ ] `APP_KEY` generated and set
- [ ] `DB_CONNECTION=pgsql` set
- [ ] Build command includes migrations
- [ ] Service is deployed and running
- [ ] Test API endpoints return 200 (not 500)

