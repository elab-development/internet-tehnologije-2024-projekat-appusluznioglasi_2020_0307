<?php

namespace App\Http\Services;

use App\Models\Service;
use App\Models\User;
use Exception;

class ServiceService
{

    public function addService(array $data,User $user): Service
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
    public function updateService(Service $service, array $data): Service{
        $service->update($data);
        return $service;

    }
    public function deleteService(Service $service): bool{
       return $service->delete();
    }
}
