<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isUser() {
        return $this->role === 'user';
    }

    public function isFreelancer() {
        return $this->role === 'freelancer';
    }

    public function isCompany() {
        return $this->role === 'company';
    }
    public function services(){
        if ($this->isFreelancer()||$this->isCompany()){
            return $this->hasMany(Service::class);

        }
        return null;
    }
    public function reviews(){

        return $this->hasMany(Review::class);
    }
    public function company(){
        if ($this->isCompany()){
            return $this->belongsTo(Company::class);

        }
        else return null;
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
