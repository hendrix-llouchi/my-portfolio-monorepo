# Email Troubleshooting Guide

## Issue: Email Not Received

### Most Common Cause: Queue Worker Not Running

Your `ContactMail` class implements `ShouldQueue`, which means emails are queued and require a queue worker to process them.

## Quick Fix Options

### Option 1: Start Queue Worker (Recommended for Production)

**In a separate terminal window:**
```bash
cd PortfolioBackend
php artisan queue:work --tries=3
```

Keep this terminal running. The queue worker will process emails as they come in.

### Option 2: Check for Failed Jobs

```bash
# Check failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Clear failed jobs (if needed)
php artisan queue:flush
```

### Option 3: Check Queue Status

```bash
# Check if there are pending jobs
php artisan queue:monitor database
```

### Option 4: Check Laravel Logs

```bash
# View recent logs
tail -f storage/logs/laravel.log

# Or on Windows PowerShell:
Get-Content storage/logs/laravel.log -Tail 50 -Wait
```

## Verify Email Configuration

### 1. Check `.env` File

Ensure these are set correctly:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-character-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Portfolio Backend"
QUEUE_CONNECTION=database
```

### 2. Verify Gmail App Password

- Must be a 16-character App Password (not your regular Gmail password)
- Generate at: https://myaccount.google.com/apppasswords
- Requires 2-Step Verification to be enabled

### 3. Test Email Configuration

```bash
php artisan tinker
```

Then run:
```php
Mail::raw('Test email', function ($message) {
    $message->to('your-email@gmail.com')
            ->subject('Test Email');
});
```

## Check Database

Verify the contact message was saved:
```bash
php artisan tinker
```

```php
\App\Models\ContactMessage::latest()->first();
```

## Alternative: Send Emails Synchronously (For Testing)

If you want emails to send immediately without a queue worker, you can temporarily modify the code. See the code modification option below.

