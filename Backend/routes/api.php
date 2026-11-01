<?php


use App\Http\Controllers\testController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register'])->name('register');
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login'])->name('login');

Route::get('/test', [testController::class, 'test'])->middleware('auth:sanctum');

// Route::get('/debug', function (Request $request) {
//     return [
//         'bearer' => $request->bearerToken(),
//     ];
// })->middleware('auth:sanctum');

// Route::get('/debug-auth', function (Request $request) {
//     return [
//         'token' => $request->bearerToken(),
//         'user' => auth('sanctum')->user(),
//         'auth_check' => auth('sanctum')->check(),
//     ];
// });

// Route::middleware('auth:sanctum')->get('/test', function () {
//     return auth('sanctum')->user();
// });

// Route::middleware('auth:sanctum')->get('/test2', function (Request $request) {
//     return $request->user();
// });

// Route::get('/whoami', function (Request $request) {
//     return [
//         'bearer' => $request->bearerToken(),
//         'default' => auth()->user(),
//         'sanctum' => auth('sanctum')->user(),
//     ];
// });
