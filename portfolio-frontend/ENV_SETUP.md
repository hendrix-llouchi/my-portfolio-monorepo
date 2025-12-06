# Environment Configuration for Frontend

## Required Environment Variable

To connect your React frontend to the Laravel backend, you need to set the `VITE_API_URL` environment variable.

### Setup Steps

1. **Create a `.env` file** in the `portfolio-frontend` directory (if it doesn't exist)

2. **Add the following line:**
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

   **Note:** 
   - If your Laravel backend runs on a different port, update accordingly
   - For production, replace with your production API URL (e.g., `https://api.yourdomain.com/api`)

3. **Restart your Vite dev server** after creating/updating the `.env` file:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

### Example `.env` file

```env
# Laravel Backend API URL
VITE_API_URL=http://localhost:8000/api

# Other environment variables (if needed)
# GEMINI_API_KEY=your-key-here
```

### Verification

After setting up, the Contact form will make requests to:
- Development: `http://localhost:8000/api/contact`
- Production: `https://your-api-domain.com/api/contact`

### Troubleshooting

**Error: "API URL is not configured"**
- Ensure `.env` file exists in `portfolio-frontend` directory
- Ensure `VITE_API_URL` is set correctly
- Restart the Vite dev server after creating/updating `.env`

**CORS Errors**
- Ensure your Laravel backend CORS configuration allows your frontend origin
- Check `PortfolioBackend/config/cors.php` includes your frontend URL

**Network Errors**
- Ensure Laravel backend is running (`php artisan serve`)
- Verify the API URL matches your Laravel server URL
- Check browser console for detailed error messages

