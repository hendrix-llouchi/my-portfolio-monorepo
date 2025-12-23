<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/run-migrations', function () {
    Artisan::call('migrate:fresh', ['--seed' => true, '--force' => true]);
    return 'Database migrations and seeders completed successfully!';
});
