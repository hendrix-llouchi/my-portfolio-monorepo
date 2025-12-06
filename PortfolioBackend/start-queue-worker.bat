@echo off
echo Starting Laravel Queue Worker...
echo.
echo This will process queued emails. Keep this window open.
echo Press Ctrl+C to stop.
echo.
cd /d "%~dp0"
php artisan queue:work --tries=3 --timeout=60
pause

