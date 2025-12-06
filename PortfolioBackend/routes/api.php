<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SkillController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/profile', [ProfileController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/skills', [SkillController::class, 'index']);
Route::get('/experiences', [ExperienceController::class, 'index']);

// Contact form route with rate limiting
Route::middleware('throttle:contact')->group(function () {
    Route::post('/contact', [ContactController::class, 'submit']);
});

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);

// Protected admin routes
Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Projects CRUD (except GET which is public)
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

    // Skills CRUD (except GET which is public)
    Route::post('/skills', [SkillController::class, 'store']);
    Route::put('/skills/{skill}', [SkillController::class, 'update']);
    Route::delete('/skills/{skill}', [SkillController::class, 'destroy']);

    // Experiences CRUD (except GET which is public)
    Route::post('/experiences', [ExperienceController::class, 'store']);
    Route::put('/experiences/{experience}', [ExperienceController::class, 'update']);
    Route::delete('/experiences/{experience}', [ExperienceController::class, 'destroy']);

    // Contact messages (admin only)
    Route::get('/messages', [ContactController::class, 'messages']);

    // Profile management (admin only)
    Route::post('/profile', [ProfileController::class, 'update']);
});

