@echo off
echo ========================================
echo Portfolio Backend Database Setup
echo ========================================
echo.

echo [1/2] Running database migrations...
php artisan migrate
if %errorlevel% neq 0 (
    echo ERROR: Migration failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Seeding database with admin user and sample data...
php artisan db:seed
if %errorlevel% neq 0 (
    echo ERROR: Seeding failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Admin Credentials:
echo   Email: admin@example.com
echo   Password: password
echo.
echo Next steps:
echo   1. Start the Laravel server: php artisan serve
echo   2. Make sure your admin panel has VITE_API_URL configured
echo   3. Try logging in to the admin panel
echo.
pause

