<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{


// Review pripada jednom user-u (ko je ostavio)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Ako je target freelancer
    public function freelancer()
    {
        return $this->belongsTo(User::class, 'target_id')->where('target_type', 'freelancer');
    }

    // Ako je target company
    public function company()
    {
        return $this->belongsTo(Company::class, 'target_id')->where('target_type', 'company');
    }
}
