# Render.com Deployment Guide

## Critical Issues to Fix

### 1. Database Configuration (500 Errors)

**Problem:** Render.com uses an ephemeral filesystem, so SQLite files are not persistent. You need to use PostgreSQL.

**Solution:**

1. **Create a PostgreSQL Database on Render:**
   - Go to your Render dashboard
   - Click "New +" → "PostgreSQL"
   - Create a new database instance (free plan available)
   - **CRITICAL:** After creating, click on your database → "Connections" tab
   - **Link the database to your web service** - this automatically sets environment variables

2. **Update Environment Variables on Render:**

   **Option A: Using DATABASE_URL (Recommended - Easiest)**
   
   When you link a PostgreSQL database to your service, Render automatically provides `DATABASE_URL`. 
   Simply set this in your Render service Environment tab:
   
   ```env
   DB_CONNECTION=pgsql
   DB_URL=$DATABASE_URL
   ```
   
   Laravel will automatically parse the connection string from `DB_URL`.

   **Option B: Using Individual Variables**
   
   If Render provides individual variables (check your service's Environment tab after linking):
   
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=$DATABASE_HOST
   DB_PORT=5432
   DB_DATABASE=$DATABASE_NAME
   DB_USERNAME=$DATABASE_USER
   DB_PASSWORD=$DATABASE_PASSWORD
   ```
   
   **Option C: Manual Configuration**
   
   If you need to set values manually (not recommended, but sometimes necessary):
   
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=<your-postgres-host-from-render>  # NOT 127.0.0.1
   DB_PORT=5432
   DB_DATABASE=<your-database-name>
   DB_USERNAME=<your-username>
   DB_PASSWORD=<your-password>
   ```

   **⚠️ CRITICAL:** 
   - The `DB_HOST` must be the Render PostgreSQL host (e.g., `dpg-xxxxx-a.oregon-postgres.render.com`)
   - **NEVER use `127.0.0.1` or `localhost`** - this will cause "Connection refused" errors
   - If you see `127.0.0.1` in your error logs, `DB_HOST` is not set correctly
   - After linking the database, check the "Environment" tab in your Render service to see what variables Render provides

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

**Important:** Generate this locally and add it to Render before deployment.

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

# Cache (use file during build, database at runtime)
CACHE_STORE=database
```

**Important:** During build, cache commands may fail if database isn't available. This is normal - caching will happen after migrations in the start command.

### 4. Build & Start Commands

**If using Docker (Dockerfile):**
- Build Command: (Leave empty or use `./build.sh` if you want a custom build)
- Start Command: (Leave empty - Dockerfile CMD handles it)

**If using Native Build (no Docker):**

**Build Command:**
```bash
composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs
```

**⚠️ IMPORTANT:** Do NOT run `php artisan config:cache` or other cache commands during build - they require database connection which isn't available yet.

**Start Command:**
```bash
./start.sh
```

Or manually:
```bash
php artisan optimize:clear && php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan serve --host=0.0.0.0 --port=$PORT
```

**Note:** 
- Render sets the `$PORT` environment variable automatically.
- The `start.sh` script handles cache commands gracefully after migrations
- Cache commands run AFTER migrations when database is available

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

**Runtime Error: "Connection refused" or "connection to server at 127.0.0.1 failed":**
- **Problem:** `DB_HOST` environment variable is not set or is set to `127.0.0.1` (localhost)
- **Why it happens:** Laravel defaults to `127.0.0.1` when `DB_HOST` is not set (see `config/database.php` line 89)
- **Solution Steps:**
  1. Go to Render Dashboard → Your Web Service → Environment tab
  2. Verify database is linked (you should see `DATABASE_URL` or `DATABASE_HOST` variables)
  3. If not linked: Go to your PostgreSQL database → Connections → Link to your web service
  4. Set environment variables:
     - **If `DATABASE_URL` exists:** Set `DB_CONNECTION=pgsql` and `DB_URL=$DATABASE_URL`
     - **If `DATABASE_HOST` exists:** Set `DB_CONNECTION=pgsql`, `DB_HOST=$DATABASE_HOST`, `DB_DATABASE=$DATABASE_NAME`, `DB_USERNAME=$DATABASE_USER`, `DB_PASSWORD=$DATABASE_PASSWORD`
  5. **Verify `DB_HOST` is NOT `127.0.0.1`** - check the value in Environment tab
  6. Redeploy your service
- **Debug:** The enhanced `start.sh` script now displays database configuration on startup to help diagnose issues

**Build Error: "Connection refused" or "connection to server at 127.0.0.1 failed":**
- **Problem:** Cache commands (`config:cache`, `route:cache`, etc.) are trying to connect to database during build
- **Solution:** Remove ALL cache commands from your Build Command. Only run them in the Start Command AFTER migrations
- **Correct Build Command:**
  ```bash
  composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs
  ```
- **Correct Start Command:**
  ```bash
  ./start.sh
  ```
  Or manually:
  ```bash
  php artisan optimize:clear && php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan serve --host=0.0.0.0 --port=$PORT
  ```

**500 Errors:**
- Check Render logs for specific error messages
- Verify database connection settings
- Ensure migrations have run
- Check that all required environment variables are set

**Database Connection Errors (Connection refused to 127.0.0.1):**
- **Root Cause:** `DB_HOST` is not set or is set to `127.0.0.1` (localhost)
- **Solution Steps:**
  1. Go to Render Dashboard → Your Web Service → Environment tab
  2. Check if `DATABASE_URL` or `DATABASE_HOST` variables exist (they appear when database is linked)
  3. If `DATABASE_URL` exists, set: `DB_CONNECTION=pgsql` and `DB_URL=$DATABASE_URL`
  4. If `DATABASE_HOST` exists, set: `DB_CONNECTION=pgsql`, `DB_HOST=$DATABASE_HOST`, `DB_DATABASE=$DATABASE_NAME`, `DB_USERNAME=$DATABASE_USER`, `DB_PASSWORD=$DATABASE_PASSWORD`
  5. **Verify `DB_HOST` is NOT `127.0.0.1`** - it should be something like `dpg-xxxxx-a.oregon-postgres.render.com`
  6. If database is not linked, go to your PostgreSQL database → Connections → Link to your web service
  7. Redeploy your service after updating environment variables

**Render Free Plan Database Spin-Down:**
- Free PostgreSQL databases spin down after 90 days of inactivity
- First connection after spin-down takes ~1 minute
- The `start.sh` script now includes retry logic to wait for database to be ready
- If you see connection timeouts, wait 1-2 minutes and try again

**CORS Errors:**
- Update `config/cors.php` to include your frontend domain
- Or set `CORS_ALLOWED_ORIGINS` environment variable

### 8. Quick Checklist

- [ ] PostgreSQL database created on Render
- [ ] Database linked to your web service (check Connections tab)
- [ ] Environment variables set in Render service:
  - [ ] `DB_CONNECTION=pgsql` (required)
  - [ ] `DB_URL=$DATABASE_URL` OR individual variables (`DB_HOST`, `DB_DATABASE`, etc.)
  - [ ] Verify `DB_HOST` is NOT `127.0.0.1` (should be Render PostgreSQL host)
- [ ] `APP_KEY` generated and set
- [ ] Build command: `composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs`
- [ ] Start command: `./start.sh` (or leave empty if using Dockerfile)
- [ ] Service is deployed and running
- [ ] Check logs for "Database connection successful" message
- [ ] Test API endpoints return 200 (not 500)

### 9. Environment Variable Verification

After setting environment variables in Render, verify they're correct:

1. **Check Render Logs:** The enhanced `start.sh` script displays database configuration on startup:
   ```
   Database Configuration Check:
     DB_CONNECTION: pgsql
     DB_HOST: dpg-xxxxx-a.oregon-postgres.render.com
     DB_DATABASE: your_database_name
   ```

2. **If you see `DB_HOST: not set (defaults to 127.0.0.1)`:**
   - Your `DB_HOST` environment variable is not set
   - Set it using one of the methods in Section 1

3. **If you see `DB_HOST: 127.0.0.1`:**
   - You've explicitly set it to localhost (wrong!)
   - Change it to your Render PostgreSQL host or use `DB_URL=$DATABASE_URL`

4. **If connection test fails:**
   - Wait 1-2 minutes (free plan database may be spinning up)
   - Verify database is running in Render dashboard
   - Check database credentials are correct

### 10. Admin User Setup

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `password`

**The admin user is automatically created during deployment** via the `start.sh` script. However, if you need to create it manually:

**Option 1: Via Render Shell (Recommended)**
1. Go to your Render service dashboard
2. Click on "Shell" tab (or use Render's SSH access)
3. Run:
   ```bash
   php artisan db:seed --class=AdminSeeder
   ```

**Option 2: Wait for Next Deployment**
- The `start.sh` script automatically runs the admin seeder after migrations
- Redeploy your service to trigger the seeder

**Option 3: Create via Artisan Tinker**
1. Access Render shell
2. Run:
   ```bash
   php artisan tinker
   ```
3. Then in tinker:
   ```php
   User::updateOrCreate(
       ['email' => 'admin@example.com'],
       [
           'name' => 'Admin',
           'password' => Hash::make('password'),
       ]
   );
   ```

**Troubleshooting Login Issues:**
- **"Login failed. Please check your credentials"** usually means:
  1. Admin user doesn't exist - run the seeder (see above)
  2. Wrong email/password - use exactly `admin@example.com` / `password`
  3. Database connection issue - check logs for database errors
- Check Render logs for "Admin user seeded successfully" message
- Verify the `users` table exists and has data: Check Render PostgreSQL dashboard

