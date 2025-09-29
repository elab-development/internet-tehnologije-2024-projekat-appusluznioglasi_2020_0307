<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use NunoMaduro\Collision\Provider;

class Booking extends Model
{
    protected $guarded=['id'];
    protected $fillable=['service_id','user_id','schedule_id','status'];


    // Booking pripada user-u
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Booking pripada servisu
   /* public function service()
    {
        return $this->belongsTo(Service::class);
    }*/

    // Booking pripada rasporedu
    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }


}
