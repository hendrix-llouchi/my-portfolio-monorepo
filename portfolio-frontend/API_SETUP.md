# API Configuration Guide

## Problem: Projects and Experiences Not Showing

If your projects and experiences aren't showing on your portfolio, it's likely because the frontend isn't configured to connect to your backend API.

## Quick Fix

### For Local Development

1. **Create a `.env` file** in the `portfolio-frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

2. **Restart your dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### For Production (Vercel)

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add a new environment variable:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://my-portfolio-monorepo.onrender.com/api` (or your actual backend URL)
   - **Environment:** Production, Preview, Development (select all)
4. **Redeploy your site** (Vercel will automatically redeploy when you add env vars, or you can trigger a manual redeploy)

## Finding Your Backend URL

Your backend URL should be:
- **Render.com:** `https://my-portfolio-monorepo.onrender.com/api`
- **Local:** `http://localhost:8000/api`

Check your `PortfolioBackend/config/cors.php` file to see what origins are allowed - your backend URL should match one of those.

## Verify It's Working

1. **Open browser DevTools (F12)**
2. **Go to Console tab**
3. **Look for errors** when the page loads
4. **Go to Network tab**
5. **Refresh the page**
6. **Look for requests to `/api/experiences` and `/api/projects`**
   - If you see 404 or CORS errors, the API URL is wrong
   - If you see 200 OK but empty arrays, the database is empty

## Testing the API Directly

You can test if your backend is working by visiting these URLs in your browser:

- `https://your-backend-url.com/api/experiences`
- `https://your-backend-url.com/api/projects`
- `https://your-backend-url.com/api/skills`

You should see JSON data. If you see errors, check:
1. Backend is deployed and running
2. Database has data (check admin panel)
3. CORS is configured correctly

## Common Issues

### "API URL is not configured"
- **Solution:** Set `VITE_API_URL` in `.env` (local) or Vercel environment variables (production)

### CORS Errors
- **Solution:** Add your frontend URL to `PortfolioBackend/config/cors.php` and redeploy backend

### Empty Data
- **Solution:** 
  1. Log into admin panel
  2. Add projects and experiences
  3. Verify they appear in the admin panel
  4. Check API endpoints return data

### Network Errors
- **Solution:** Verify backend is running and accessible

