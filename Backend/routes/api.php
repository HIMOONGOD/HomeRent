<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth');
    Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
});

Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{property}', [PropertyController::class, 'show']);

Route::middleware(['auth:sanctum', 'role:owner'])->prefix('owner')->group(function (): void {
    Route::get('/properties', [OwnerController::class, 'properties']);
    Route::post('/properties', [OwnerController::class, 'store']);
    Route::post('/uploads', [OwnerController::class, 'upload']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function (): void {
    Route::get('/properties', [AdminController::class, 'properties']);
    Route::delete('/properties/{property}', [AdminController::class, 'removeProperty']);
    Route::get('/overview', [AdminController::class, 'overview']);
    Route::get('/owners', [AdminController::class, 'owners']);
});

Route::get('/test', fn () => response()->noContent());
