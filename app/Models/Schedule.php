<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
// Schedule pripada jednom servisu
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    // Schedule ima više booking-a
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
