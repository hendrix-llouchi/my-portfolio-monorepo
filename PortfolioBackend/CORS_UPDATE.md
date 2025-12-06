# CORS Configuration Updated for Admin Panel

## Changes Made

The CORS configuration has been updated to allow requests from the Admin Panel.

### Added Origins:
- `http://localhost:5174` - Admin Panel (Vite default when 5173 is taken)
- `http://127.0.0.1:5174` - Admin Panel (alternative localhost format)

### Current Allowed Origins:
- `http://localhost:5173` - Portfolio Frontend
- `http://localhost:5174` - Admin Panel ✅ NEW
- `http://localhost:3000` - Alternative frontend port
- `http://127.0.0.1:5173` - Portfolio Frontend (alternative)
- `http://127.0.0.1:5174` - Admin Panel (alternative) ✅ NEW
- `http://127.0.0.1:3000` - Alternative frontend port

## Important: Restart Laravel Backend

After updating CORS configuration, you **must restart** the Laravel server for changes to take effect:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
php artisan serve
```

## Verify Admin Panel Port

The admin panel Vite config is set to use port **5174**. 

To check what port your admin panel is actually running on:
1. Look at the terminal where you ran `npm run dev` in the admin-panel directory
2. You should see: `Local: http://localhost:5174/`

If it's running on a different port, update `PortfolioBackend/config/cors.php` accordingly.

## Testing

After restarting the backend, test the admin panel login:
1. Open http://localhost:5174 (or your actual port)
2. Try logging in with:
   - Email: `admin@example.com`
   - Password: `password`
3. If you see CORS errors in the browser console, verify:
   - The port matches in both Vite config and CORS config
   - Laravel backend has been restarted
   - Both servers are running

