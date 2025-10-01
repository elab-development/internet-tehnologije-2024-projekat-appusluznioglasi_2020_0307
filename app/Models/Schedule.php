<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;
    protected $guarded=['id'];

    protected $fillable=['service_id','time_from','time_to','date','assigned_employees'];
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
