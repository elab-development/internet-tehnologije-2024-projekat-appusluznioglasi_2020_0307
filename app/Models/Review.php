<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
     use HasFactory;
    protected $guarded=['id'];
    protected $fillable=['user_id','service_id','rating','comment'];


// Review pripada jednom user-u (ko je ostavio)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

   public function service(){
        return $this->belongsTo(Service::class);
   }
}
