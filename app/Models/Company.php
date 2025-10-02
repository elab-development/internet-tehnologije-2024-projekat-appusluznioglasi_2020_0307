<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable=['name','description','user_id','badge_verified'];
    protected $guarded=['id'];
    // Svaka kompanija pripada jednom user-u
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Company nudi više servisa
    public function services()
    {
        return $this->hasMany(Service::class);
    }

    // Review-i ostavljeni na company
    public function reviews()
    {
        return $this->hasMany(Review::class, 'target_id')
        ->where('target_type', 'company');
    }
}
