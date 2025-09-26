<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $guarded=['id'];

    protected $fillable=['title','description','freelancer_id','max_employees','company_id','price'];

    // Service ima više rasporeda (schedule)
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    // Service može imati više booking-a
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // Service može imati više review-a
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Ako je freelancer vlasnik
    public function freelancer()
    {
        return $this->belongsTo(User::class, );
    }

    // Ako je company vlasnik
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
