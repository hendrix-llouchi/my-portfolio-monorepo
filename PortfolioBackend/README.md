# Portfolio Backend - Contact Form API

A Laravel 12 backend API for handling portfolio contact form submissions with rate limiting, CORS support, and asynchronous email processing.

## Features

- ✅ RESTful API endpoint for contact form submissions
- ✅ Input validation and sanitization
- ✅ Rate limiting (5 requests/minute per IP)
- ✅ CORS configuration for frontend integration
- ✅ Asynchronous email queue processing
- ✅ Database-driven job queue
- ✅ Email notifications via Gmail SMTP

## API Endpoint

### POST `/api/contact`

Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",  // optional
  "message": "Your message here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon."
}
```

**Rate Limit Exceeded (429):**
Returns HTTP 429 Too Many Requests when exceeding 5 requests per minute per IP address.

## Local Development Setup

### Prerequisites

- PHP 8.2 or higher
- Composer
- SQLite (or MySQL/PostgreSQL)
- Node.js and NPM (for frontend assets)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   composer install
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Update `.env` file:**
   - Set database connection
   - Configure Gmail SMTP credentials (see Email Configuration below)
   - Set `QUEUE_CONNECTION=database`

4. **Run migrations:**
   ```bash
   php artisan migrate
   ```

5. **Build frontend assets (if applicable):**
   ```bash
   npm run build
   ```

### Running the Application

1. **Start the Laravel development server:**
   ```bash
   php artisan serve
   ```

2. **Start the queue worker (REQUIRED for email processing):**
   ```bash
   php artisan queue:work --tries=3
   ```

   **Alternative for development with auto-restart:**
   ```bash
   php artisan queue:listen --tries=3
   ```

   > **Important:** The queue worker must be running for emails to be sent. Without it, emails will be queued but never processed.

### Development Queue Worker Options

- `--tries=3`: Attempts to process a job 3 times before marking it as failed
- `--timeout=60`: Maximum seconds a job can run (default: 60)
- `--sleep=3`: Seconds to wait before checking for new jobs (default: 3)
- `--max-jobs=1000`: Restart worker after processing N jobs (prevents memory leaks)

**Recommended development command:**
```bash
php artisan queue:work --tries=3 --timeout=60
```

## Email Configuration

### Gmail SMTP Setup

1. **Enable 2-Step Verification** on your Google Account
2. **Generate an App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and generate a 16-character password
3. **Update `.env` file:**
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-character-app-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=your-email@gmail.com
   MAIL_FROM_NAME="Your Name"
   ```

## Production Deployment

### Critical Deployment Steps

1. **Set environment to production:**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

2. **Optimize application:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan event:cache
   ```

3. **Run migrations:**
   ```bash
   php artisan migrate --force
   ```

4. **Set up queue worker with Supervisor** (see Supervisor Configuration below)

5. **Configure web server** (Nginx/Apache) to point to `public/` directory

6. **Set proper file permissions:**
   ```bash
   chmod -R 755 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

### Production Queue Worker

**DO NOT** use `php artisan queue:work` directly in production. Use a process monitor like Supervisor to ensure the worker:
- Automatically restarts if it crashes
- Starts on server boot
- Handles memory leaks by restarting periodically

### Supervisor Configuration

Supervisor is a process monitor that ensures your queue worker stays running in production.

#### Why Supervisor is Required

- **Reliability:** Automatically restarts the worker if it crashes
- **Persistence:** Starts the worker on server boot
- **Memory Management:** Can restart workers periodically to prevent memory leaks
- **Monitoring:** Provides logs and status monitoring

#### Installing Supervisor (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install supervisor
```

#### Creating Supervisor Configuration

Create a configuration file: `/etc/supervisor/conf.d/laravel-worker.conf`

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/project/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/your/project/storage/logs/worker.log
stopwaitsecs=3600
```

**Configuration Notes:**
- `command`: Full path to `artisan queue:work` with your queue connection
- `user`: Web server user (usually `www-data` or `nginx`)
- `numprocs`: Number of worker processes (adjust based on server capacity)
- `stdout_logfile`: Path to worker log file

#### Managing Supervisor

```bash
# Reload configuration
sudo supervisorctl reread
sudo supervisorctl update

# Start worker
sudo supervisorctl start laravel-worker:*

# Stop worker
sudo supervisorctl stop laravel-worker:*

# Restart worker
sudo supervisorctl restart laravel-worker:*

# Check status
sudo supervisorctl status
```

## Queue Management Commands

### View Queue Status

```bash
# Check pending jobs
php artisan queue:monitor database

# View failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Clear failed jobs
php artisan queue:flush
```

### Testing Queue Processing

```bash
# Process a single job (for testing)
php artisan queue:work --once

# Process jobs with verbose output
php artisan queue:work --verbose
```

## Security Considerations

### Production Checklist

- [ ] `APP_DEBUG=false` in `.env`
- [ ] `APP_ENV=production` in `.env`
- [ ] Strong `APP_KEY` generated
- [ ] Database credentials secured
- [ ] Gmail App Password (not regular password)
- [ ] CORS configured for specific origins (not `*`) in production
- [ ] Rate limiting active
- [ ] HTTPS enabled
- [ ] File permissions set correctly
- [ ] Queue worker running via Supervisor

### CORS Configuration for Production

Update `config/cors.php` to restrict origins:

```php
'allowed_origins' => [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
],
```

## Troubleshooting

### Emails Not Sending

1. **Check queue worker is running:**
   ```bash
   php artisan queue:work
   ```

2. **Check failed jobs:**
   ```bash
   php artisan queue:failed
   ```

3. **Verify email configuration in `.env`**

4. **Check logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

### Queue Worker Issues

1. **Clear configuration cache:**
   ```bash
   php artisan config:clear
   ```

2. **Restart queue worker:**
   ```bash
   php artisan queue:restart
   ```

3. **Check Supervisor status:**
   ```bash
   sudo supervisorctl status laravel-worker:*
   ```

## Project Structure

```
PortfolioBackend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── ContactController.php
│   │   └── Requests/
│   │       └── ContactFormRequest.php
│   ├── Mail/
│   │   └── ContactMail.php
│   ├── Models/
│   │   └── ContactMessage.php
│   └── Providers/
│       ├── AppServiceProvider.php
│       └── RouteServiceProvider.php
├── config/
│   ├── cors.php
│   └── mail.php
├── database/
│   └── migrations/
│       ├── 0001_01_01_000002_create_jobs_table.php
│       └── 2025_11_22_040757_create_contact_messages_table.php
├── routes/
│   └── api.php
└── .env
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
