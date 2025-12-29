# Database Setup Guide

This guide will help you set up the database with all necessary data including the admin user and sample content.

## Quick Setup

Run these commands in the `PortfolioBackend` directory:

```bash
# 1. Run migrations to create database tables
php artisan migrate

# 2. Seed the database with admin user and sample data
php artisan db:seed
```

Or run both in one command:

```bash
php artisan migrate --seed
```

## What Gets Seeded

### Admin User
- **Email:** `admin@example.com`
- **Password:** `password`
- ⚠️ **Important:** Change this password in production!

### Sample Data
- **Profile:** Personal information and bio
- **Experiences:** Including your 5-year Google experience
- **Skills:** Comprehensive list of frontend, backend, database, and DevOps skills
- **Projects:** Sample project entries

## Fresh Start

If you need to reset everything:

```bash
# Drop all tables and recreate them
php artisan migrate:fresh --seed
```

⚠️ **Warning:** This will delete all existing data!

## Verify Setup

After seeding, you can verify the admin user exists:

```bash
php artisan tinker
```

Then in the tinker console:
```php
User::where('email', 'admin@example.com')->first();
```

You should see the admin user object.

## Troubleshooting

### Admin Login Not Working

1. **Check if admin user exists:**
   ```bash
   php artisan tinker
   User::where('email', 'admin@example.com')->count();
   ```
   Should return `1`. If it returns `0`, run the seeder again.

2. **Check API URL:**
   - Ensure `VITE_API_URL` is set in `admin-panel/.env`
   - Default: `http://localhost:8000/api` or `http://127.0.0.1:8000/api`

3. **Check backend is running:**
   ```bash
   php artisan serve
   ```
   Should be accessible at `http://localhost:8000`

4. **Check CORS configuration:**
   - Verify `PortfolioBackend/config/cors.php` allows your admin panel origin
   - Restart Laravel server after CORS changes

### No Data Showing on Portfolio

1. **Check if data exists:**
   ```bash
   php artisan tinker
   Experience::count();
   Skill::count();
   Project::count();
   ```

2. **Check API endpoints:**
   - Visit `http://localhost:8000/api/experiences` in browser
   - Should return JSON array of experiences

3. **Check frontend API URL:**
   - Ensure `VITE_API_URL` is set in `portfolio-frontend/.env`

## Production Setup

For production, make sure to:

1. Change admin password:
   ```bash
   php artisan tinker
   $user = User::where('email', 'admin@example.com')->first();
   $user->password = Hash::make('your-secure-password');
   $user->save();
   ```

2. Update environment variables in `.env`:
   - Database credentials
   - App URL
   - Mail configuration

3. Run migrations and seeders:
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

