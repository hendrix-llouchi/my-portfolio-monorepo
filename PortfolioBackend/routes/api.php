<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/profile', [ProfileController::class, 'index']);
Route::get('/skills', [SkillController::class, 'index']);
Route::get('/experiences', [ExperienceController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);

Route::middleware('throttle:contact')->group(function () {
    Route::post('/contact', [ContactController::class, 'submit']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/projects', [ProjectController::class, 'store']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
    Route::match(['put', 'post'], '/projects/{project}', [ProjectController::class, 'update']);

    Route::post('/skills', [SkillController::class, 'store']);
    Route::put('/skills/{skill}', [SkillController::class, 'update']);
    Route::delete('/skills/{skill}', [SkillController::class, 'destroy']);

    Route::post('/experiences', [ExperienceController::class, 'store']);
    Route::put('/experiences/{experience}', [ExperienceController::class, 'update']);
    Route::delete('/experiences/{experience}', [ExperienceController::class, 'destroy']);

    Route::get('/messages', [ContactController::class, 'messages']);
    Route::delete('/messages/{message}', [ContactController::class, 'destroy']);

    Route::post('/profile', [ProfileController::class, 'update']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
});

