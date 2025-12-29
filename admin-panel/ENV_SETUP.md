# Environment Configuration for Admin Panel

## Required Environment Variable

To connect your admin panel to the Laravel backend, you need to set the `VITE_API_URL` environment variable.

### Setup Steps

1. **Create a `.env` file** in the `admin-panel` directory (if it doesn't exist)

2. **Add the following line:**
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

   **Note:** 
   - If your Laravel backend runs on a different port, update accordingly
   - For production, replace with your production API URL (e.g., `https://your-backend.onrender.com/api`)

3. **Restart your Vite dev server** after creating/updating the `.env` file:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

### Example `.env` file

```env
# Laravel Backend API URL
VITE_API_URL=http://localhost:8000/api

# For production deployment:
# VITE_API_URL=https://your-backend.onrender.com/api
```

### Production Deployment

When deploying to production (Netlify, Vercel, Render, etc.), set the environment variable in your hosting platform's settings:

- **Netlify**: Site settings → Environment variables
- **Vercel**: Project settings → Environment Variables
- **Render**: Environment tab in your service settings

Set `VITE_API_URL` to your production backend URL (e.g., `https://your-backend.onrender.com/api`)

### Verification

After setting up, the admin panel will make requests to:
- Development: `http://localhost:8000/api/*`
- Production: `https://your-api-domain.com/api/*`

### Troubleshooting

**Error: API requests failing or 404 errors**
- Ensure `.env` file exists in `admin-panel` directory
- Ensure `VITE_API_URL` is set correctly
- For production, verify the environment variable is set in your hosting platform
- Restart the Vite dev server after creating/updating `.env`
- Check browser console for detailed error messages

**CORS Errors**
- Ensure your Laravel backend CORS configuration allows your admin panel origin
- Check `PortfolioBackend/config/cors.php` includes your admin panel URL

**Network Errors**
- Ensure Laravel backend is running (`php artisan serve` for local development)
- Verify the API URL matches your Laravel server URL
- Check that the backend is accessible from your deployment URL

**404 Errors on Routes (React Router)**
- Ensure deployment configuration is set up:
  - Netlify: `public/_redirects` file should exist
  - Vercel: `vercel.json` file should exist
  - Render: Configure routing in service settings

