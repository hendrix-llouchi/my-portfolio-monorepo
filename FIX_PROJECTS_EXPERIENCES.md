# Fix: Projects and Experiences Not Showing

## The Problem

Your projects and experiences aren't showing on your portfolio because the frontend doesn't know where to find your backend API.

## The Solution

You need to configure the `VITE_API_URL` environment variable to point to your backend.

### For Production (Vercel) - DO THIS NOW:

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Select your portfolio project (`henry-cobbinah`)

2. **Add Environment Variable:**
   - Go to **Settings** → **Environment Variables**
   - Click **Add New**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://my-portfolio-monorepo.onrender.com/api`
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click the **⋯** menu on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger redeploy

### For Local Development:

1. **Create `.env` file** in `portfolio-frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

2. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   cd portfolio-frontend
   npm run dev
   ```

## Verify It's Working

After setting the environment variable:

1. **Open your portfolio** (https://henry-cobbinah.vercel.app)
2. **Open browser DevTools** (F12)
3. **Check Console tab:**
   - You should see: `Fetching experiences from: https://my-portfolio-monorepo.onrender.com/api/experiences`
   - You should see: `Fetching projects from: https://my-portfolio-monorepo.onrender.com/api/projects`
   - If you see errors, check the error message

4. **Check Network tab:**
   - Look for requests to `/api/experiences` and `/api/projects`
   - They should return 200 OK with JSON data

## If Data Still Doesn't Show

1. **Check if data exists in database:**
   - Log into admin panel: https://henry-admin-panel.vercel.app
   - Go to Experiences and Projects sections
   - Verify you have data there

2. **Test API directly:**
   - Visit: https://my-portfolio-monorepo.onrender.com/api/experiences
   - Visit: https://my-portfolio-monorepo.onrender.com/api/projects
   - You should see JSON arrays with your data

3. **Check browser console:**
   - Look for CORS errors
   - Look for network errors
   - The enhanced error messages will show what's wrong

## What I Changed

I've added better error logging to help debug:
- Console logs show which API URL is being used
- Error messages include the API URL
- Better error handling for missing configuration

## Summary

**The fix:** Set `VITE_API_URL=https://my-portfolio-monorepo.onrender.com/api` in Vercel environment variables and redeploy.

That's it! Once the environment variable is set, your projects and experiences should appear.

