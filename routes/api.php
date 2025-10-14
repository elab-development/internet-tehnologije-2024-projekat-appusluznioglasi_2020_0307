<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\ServiceController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum','role:user'])->group(function () {

Route::get('/schedules', [ScheduleController::class,'showAllSchedules']);
Route::get('/schedules/service/{service_id}', [ScheduleController::class,'showForServiceId']);

Route::get('/schedules/title/{title}', [ScheduleController::class,'showAllSchedulesForServiceTitle']);

Route::post('/schedules/date', [ScheduleController::class,'showForDate']);
Route::post('/schedules/date/title', [ScheduleController::class,'showForDateForServiceName']);
Route::post("/bookings/create", [BookingController::class, 'store']);
Route::get('/services/topRated', [ServiceController::class, 'topRatedServices']);
Route::get("services/title/{title}", [ServiceController::class, 'show']);



    Route::post("/reviews", [ReviewController::class,"store"]);

});

Route::middleware(['auth:sanctum','role:company,freelancer'])->group(function () {

    Route::get('/schedules/user', [ScheduleController::class, 'showForUser']);
    Route::delete('/schedules/delete/{schedule}', [ScheduleController::class, 'destroy']);
    Route::put('/schedules/update/{schedule}', [ScheduleController::class, 'update']);
    Route::resource('/companies', CompanyController::class);
    Route::post('/services', [ServiceController::class,'store']);
    Route::put('/services/{service}', [ServiceController::class,'update']);
    Route::delete('/services/{service}', [ServiceController::class,'destroy']);
    Route::post('/schedules/date/user', [ScheduleController::class, 'showForDateForUser']);
    Route::put("/bookings/update/{booking}", [BookingController::class, 'update']);
    Route::delete("/bookings/delete/{booking}", [BookingController::class, 'destroy']);
    Route::put('/schedules/{schedule}', [ScheduleController::class, 'update']);
    Route::post('/schedules', [ScheduleController::class,'store']);

});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/services', [ServiceController::class,'index']);
    Route::get('/services/{service}', [ServiceController::class,'show']);
    Route::get('/schedules/show/{schedule}', [ScheduleController::class,'show']);


    Route::get("/user/me",[AuthController::class,"getUserForId"]);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy']);
    Route::put('/schedules/{schedule}', [ScheduleController::class, 'update']);
    Route::get("/bookings/status/{status}", [BookingController::class, 'getAllBookingsForUserForStatus']);
    Route::get("/bookings/show", [BookingController::class, 'index']);
    Route::get("/bookings/showByScheduleId", [BookingController::class, 'getBookingByScheduleId']);
    Route::get("/bookings/showForUserId", [BookingController::class, 'getAllBookingsForCurrentUser']);
    Route::get("/bookings/{booking}", [BookingController::class, 'show']);
    Route::get("/reviews/company/{company_id}", [ReviewController::class, 'getReviewsForCompany']);
    Route::get("/reviews/service/{serviceId}", [ReviewController::class, 'getReviewsForService']);

    Route::get("/reviews/freelancer/{freelancer_id}", [ReviewController::class, 'getReviewsForFreelancer']);
});

Route::middleware(['auth:sanctum','role:company'])->group(function () {
    Route::resource('/companies', CompanyController::class);

});
