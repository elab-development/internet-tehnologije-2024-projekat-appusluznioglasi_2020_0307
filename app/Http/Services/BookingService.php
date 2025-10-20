<?php

namespace App\Http\Services;

use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use function Pest\Laravel\get;

class BookingService
{

    public function addBooking(array $data,$userId): Booking
    {
        return Booking::create(
            [
                'user_id' => $userId,
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

    public function getBookingByScheduleId($scheduleId): ?Booking{
        return Booking::where('schedule_id',$scheduleId)->first();
    }
    public function getBookingsByUserId(User $user, $perPage = 10)
    {
        if ($user->role === 'user') {
            // običan korisnik vidi svoje bookings
            return Booking::where('user_id', $user->id)
                ->with(['schedule.service']) // eager load da smanjimo broj upita
                ->paginate($perPage);
        }

        if ($user->role === 'company') {
            // company vidi bookings gde je company vlasnik servisa
            return Booking::whereHas('schedule.service', function ($query) use ($user) {
                $query->where('company_id', $user->id);
            })
                ->with(['schedule.service'])
                ->paginate($perPage);
        }

        if ($user->role === 'freelancer') {
            // freelancer vidi bookings gde je freelancer vlasnik servisa
            return Booking::whereHas('schedule.service', function ($query) use ($user) {
                $query->where('freelancer_id', $user->id);
            })
                ->with(['schedule.service'])
                ->paginate($perPage);
        }


        return Booking::paginate($perPage);
    }

    public function getBookingsByStatusForUserId($status,User $user): Collection{
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
