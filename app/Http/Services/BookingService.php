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
    public function getBookingsByStatusForUserId($status,User $user): Booking{
        if($user->role == 'user'){
            return Booking::where('status',$status)
                ->where('user_id',$user->id)->get();
        }
        if ($user->role === 'company') {
            return Booking::where('status', $status)
                ->whereHas('schedule.service', function ($query) use ($user) {
                    $query->where('company_id', $user->id);
                })
                ->get();
        }

        return Booking::where('status', $status)
                ->whereHas('schedule.service', function ($query) use ($user) {
                    $query->where('freelancer_id', $user->id);
                })
                ->get();


    }



}
