<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\ServiceController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware(['auth:sanctum','role:user'])->group(function () {

Route::get('/schedules', [ScheduleController::class,'showAllSchedules']);
Route::get('/schedules/title', [ScheduleController::class,'showAllSchedulesForServiceTitle']);
Route::get('/schedules/show/{schedule}', [ScheduleController::class,'show']);

Route::post('/schedules/date', [ScheduleController::class,'showForDate']);
Route::post('/schedules/date/title', [ScheduleController::class,'showForDateForServiceName']);





    Route::post("/reviews", [ReviewController::class,"store"]);



});

Route::middleware(['auth:sanctum','role:company,freelancer'])->group(function () {
    Route::get('/schedules/user', [ScheduleController::class, 'showForUser']);

    Route::delete('/schedules/delete/{schedule}', [ScheduleController::class, 'destroy']);
    Route::put('/schedules/update/{schedule}', [ScheduleController::class, 'update']);

    Route::post('/schedules/date/user', [ScheduleController::class, 'showForDateForUser']);
    Route::post("/bookings/create", [BookingController::class, 'store']);
    Route::put("/bookings/update", [BookingController::class, 'update']);
    Route::delete("/bookings/delete", [BookingController::class, 'destroy']);

});


Route::middleware('auth:sanctum')->group(function () {

    Route::resource('/companies', CompanyController::class);
    Route::resource('/services', ServiceController::class);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy']);
    Route::put('/schedules/{schedule}', [ScheduleController::class, 'update']);
    Route::get("/bookings/status/{status}", [BookingController::class, 'getAllBookingsForUserForStatus']);
    Route::get("/bookings/show", [BookingController::class, 'show']);
    Route::get("/bookings/showByScheduleId", [BookingController::class, 'getAllBookingsForSchedule']);
    Route::get("/bookings/showForUserId", [BookingController::class, 'getAllBookingsForCurrentUser']);
    Route::get("/bookings/{id}", [BookingController::class, 'index']);
    Route::get("/bookings/{id}", [BookingController::class, 'index']);
    Route::get("/reviews/company/{company_id}", [ReviewController::class, 'getReviewsForCompany']);
    Route::get("/reviews/freelancer/{freelancer_id}", [ReviewController::class, 'getReviewsForFreelancer']);
});
