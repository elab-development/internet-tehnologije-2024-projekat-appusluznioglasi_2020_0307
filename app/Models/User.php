<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable,HasApiTokens;
    /**
     * The attributes that are mass assignable.
     * @var list<string>
     */
    protected $fillable = ['name','email','password','role',
    ];
    /**
     * The attributes that should be hidden for serialization.
     * @var list<string>
     */
    protected $hidden = [   'password', 'remember_token',];
    /**
     * Get the attributes that should be cast.
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime','password' => 'hashed' ];
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    // User može ostaviti više review-a
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    // Ako je freelancer → može nuditi više servisa
    public function services()
    {
        return $this->hasMany(Service::class)->where('role', 'freelancer');
    }
    // Ako je company → ima 1:1 Company
    public function company()
    {
        return $this->hasOne(Company::class);
    }


}
