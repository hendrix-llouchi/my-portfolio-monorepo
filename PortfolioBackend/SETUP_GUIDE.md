# Local Development Setup

## Environment Configuration

```bash
cd PortfolioBackend
cp .env.example .env
php artisan key:generate
```

### Required `.env` Settings

**SQLite Database:**
```env
DB_CONNECTION=sqlite
```

**Gmail SMTP:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Portfolio Backend"
QUEUE_CONNECTION=database
```

Get Gmail App Password: https://myaccount.google.com/apppasswords

## Database Setup

```bash
touch database/database.sqlite
php artisan migrate
```

## Running

**Terminal 1:**
```bash
php artisan serve
```

**Terminal 2:**
```bash
php artisan queue:work --tries=3
```

**Terminal 3 (Frontend):**
```bash
cd ../portfolio-frontend
npm run dev
```

## Test API

```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
```

## Troubleshooting

**CORS Issues:** Add frontend URL to `config/cors.php`

**Emails Not Sending:**
- Check queue worker is running
- Verify Gmail credentials
- Check logs: `tail -f storage/logs/laravel.log`

**Database:** Ensure `database/database.sqlite` exists and has proper permissions
