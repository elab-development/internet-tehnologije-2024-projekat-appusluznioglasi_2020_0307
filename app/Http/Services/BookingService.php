<?php

namespace App\Http\Services;

use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Exception;

class BookingService
{

    public function addBooking(array $data): Booking
    {
        return Booking::create(
            [
                'user_id' => $data['user_id'],
                'schedule_id' => $data['schedule_id'],
                'status' => $data['status']??'pending',
            ]
        );
    }
    public function updateBooking(Booking $booking, array $data): Booking{
        $booking->update($data);
        return $booking;
    }
    public function deleteBooking(Booking $booking): bool{
        return $booking->delete();
    }
  
    public function getBookingByScheduleId( $scheduleId): Booking{
        return Booking::where('schedule_id',$scheduleId);
    }
    public function getBookingByUserId($userId): Booking{
        return Booking::where('user',function ($query) use ($userId){
            $query->where('id',$userId);
        });
    }



}
