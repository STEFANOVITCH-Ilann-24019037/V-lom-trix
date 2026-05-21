<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BikeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MobileController;
use App\Http\Controllers\PartController;
use App\Http\Controllers\StravaController;
use Illuminate\Support\Facades\Route;

// Authentification (publique)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes authentifiées
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Strava
    Route::get('/strava/redirect', [StravaController::class, 'redirect']);
    Route::get('/strava/callback', [StravaController::class, 'callback']);
    Route::post('/sync', [StravaController::class, 'sync']);

    // Vélos
    Route::apiResource('bikes', BikeController::class);

    // Pièces
    Route::get('/bikes/{bike}/parts', [PartController::class, 'index']);
    Route::put('/parts/{part}', [PartController::class, 'update']);
    Route::post('/parts/{part}/change', [PartController::class, 'change']);

    // Mobile
    Route::prefix('mobile')->group(function () {
        Route::get('/dashboard', [MobileController::class, 'dashboard']);
        Route::post('/register-device', [MobileController::class, 'registerDevice']);
        Route::get('/bikes/{bike}/parts/simple', [MobileController::class, 'simpleParts']);
    });
});
