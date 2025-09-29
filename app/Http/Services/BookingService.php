<?php

namespace App\Http\Services;

use App\Models\Service;
use App\Models\User;
use Exception;

class BookingService
{

    public function addBooking(array $data,User $user): Service
    {
        $attributes = [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'max_employees' => $data['max_employees'] ?? 1,
        ];

        if ($user->role === 'freelancer') {
            $attributes['freelancer_id'] = $user->id;
        } elseif ($user->role === 'company') {
            $attributes['company_id'] = $user->id;
        } else {
            throw new Exception('Ovaj tip korisnika ne može da dodaje usluge.');
        }

        return Service::create($attributes);
    }
    
   
}
