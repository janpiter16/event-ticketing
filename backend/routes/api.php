<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventCategoryController;
use App\Http\Controllers\Api\EventController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// Public endpoints
Route::get('events/public', [EventController::class, 'publicIndex']);
Route::get('categories', [EventCategoryController::class, 'index']);
Route::get('categories/{category}', [EventCategoryController::class, 'show']);

// Protected endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::post('events/{event}/publish', [EventController::class, 'publish']);
    Route::post('events/{event}/unpublish', [EventController::class, 'unpublish']);
    Route::post('events/{event}/cancel', [EventController::class, 'cancel']);
    Route::post('events/{event}/archive', [EventController::class, 'archive']);
    Route::apiResource('events', EventController::class);
});
