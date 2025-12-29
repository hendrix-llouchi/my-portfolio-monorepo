# Portfolio Backend

Laravel backend API for portfolio contact form submissions.

## Features

- RESTful API endpoint
- Input validation
- Rate limiting (5 requests/minute per IP)
- CORS support
- Asynchronous email queue processing
- Gmail SMTP email notifications

## API Endpoint

### POST `/api/contact`

Submit a contact form message.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon."
}
```

## Setup

### Prerequisites

- PHP 8.2+
- Composer
- SQLite (or MySQL/PostgreSQL)
- Node.js and NPM

### Installation

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Configuration

Update `.env`:
- Database connection
- Gmail SMTP credentials
- `QUEUE_CONNECTION=database`

### Running

```bash
php artisan serve
php artisan queue:work --tries=3
```

## Email Configuration

1. Enable 2-Step Verification on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Your Name"
```

## Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

Use Supervisor for queue worker in production.

## License

MIT
