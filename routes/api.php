<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\ServiceController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
Route::resource('/companies', CompanyController::class);
Route::resource('/services', ServiceController::class);
Route::get('/schedules', [ScheduleController::class,'index']);
Route::get('/schedules/{id}', [ScheduleController::class,'show']);
Route::put('/schedules', [ScheduleController::class,'update']);
Route::delete('/schedules/{id}', [ScheduleController::class,'destroy']);



    Route::post('/schedules/date', [ScheduleController::class,'showForDate']);
Route::post('/schedules/date', [ScheduleController::class,'showForDateForServiceName']);
Route::post('/schedules/date/user', [ScheduleController::class,'showForDateForUser']);
Route::get('/schedules/user', [ScheduleController::class,'showForUser']);
Route::post("/bookings/create", [BookingController::class,'store']);
Route::put("/bookings/update", [BookingController::class,'update']);
Route::delete("/bookings/delete", [BookingController::class,'destroy']);
Route::get("/bookings/show", [BookingController::class,'show']);
Route::get("/bookings/showByScheduleId", [BookingController::class,'getAllBookingsForSchedule']);
    Route::get("/bookings/showForUserId", [BookingController::class,'getAllBookingsForCurrentUser']);
    Route::get("/bookings/{id}", [BookingController::class,'index']);
    Route::get("/bookings/status/{status}", [BookingController::class,'getAllBookingsForUserForStatus']);


});

