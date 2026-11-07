<?php


use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\testController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// auth api route

Route::post('/auth/register', [AuthController::class, 'register'])->name('register');
Route::post('/auth/login', [AuthController::class, 'login'])->name('login');


// general api route for user

Route::post('/user/add-property', [PropertyController::class, 'addPost'])->name('add-property');





// testing api route
Route::get('/test', [testController::class, 'test']);

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
