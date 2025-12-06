# Portfolio Backend - Local Development Setup Guide

## Quick Setup Checklist

### 1. Environment Configuration

**If you don't have a `.env` file:**

```bash
cd PortfolioBackend
cp .env.example .env
php artisan key:generate
```

**Required `.env` Configuration:**

#### SQLite Database (Default - Already Configured)
```env
DB_CONNECTION=sqlite
```
No additional configuration needed. The database file is at `database/database.sqlite`.

#### Gmail SMTP Configuration
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-character-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Portfolio Backend"
```

**To get a Gmail App Password:**
1. Enable 2-Step Verification on your Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and generate a 16-character password
4. Use this password (not your regular Gmail password) in `MAIL_PASSWORD`

#### Queue Configuration (Required for Email)
```env
QUEUE_CONNECTION=database
```

### 2. Database Setup

```bash
# Ensure database file exists
touch database/database.sqlite

# Run migrations
php artisan migrate
```

### 3. Start the Application

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```
Server will run at: `http://localhost:8000`

**Terminal 2 - Queue Worker (REQUIRED for emails):**
```bash
php artisan queue:work --tries=3
```

**Terminal 3 - Frontend (if testing integration):**
```bash
cd ../portfolio-frontend
npm run dev
```

### 4. Test the API

Use the `test_api.http` file or run:

```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
```

### 5. Verify Database Entry

```bash
php artisan tinker
```

Then in tinker:
```php
\App\Models\ContactMessage::latest()->first();
```

## Troubleshooting

### CORS Issues
- Ensure your frontend URL is in `config/cors.php` `allowed_origins`
- Default ports: `http://localhost:5173` (Vite default) or `http://localhost:3000`

### Emails Not Sending
- **Check queue worker is running:** `php artisan queue:work`
- **Check failed jobs:** `php artisan queue:failed`
- **Verify Gmail credentials in `.env`**
- **Check logs:** `tail -f storage/logs/laravel.log`

### Database Issues
- Ensure `database/database.sqlite` exists
- Run migrations: `php artisan migrate:fresh`
- Check permissions on `database/` directory

### Rate Limiting
- Default: 5 requests per minute per IP
- To test, make 6 rapid requests - 6th should return 429

## API Endpoint

**POST** `/api/contact`

**Request:**
```json
{
  "name": "string (required, max:255)",
  "email": "string (required, email, max:255)",
  "phone": "string (optional, max:20)",
  "message": "string (required, max:2000)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon."
}
```

## Next Steps

1. ✅ CORS configured for localhost:5173 and localhost:3000
2. ✅ Environment variables documented
3. ✅ Endpoint verified and ready
4. ✅ Test file created (`test_api.http`)
5. 🔄 Connect your React frontend to `http://localhost:8000/api/contact`

