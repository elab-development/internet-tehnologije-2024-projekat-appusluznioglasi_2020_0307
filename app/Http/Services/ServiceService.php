<?php

namespace App\Http\Services;

use App\Models\Service;
use App\Models\User;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;

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
    public function getTopRatedServices(int $limit)
    {
        return Service::with('reviews')
            ->withAvg('reviews', 'rating')
            ->orderByDesc('reviews_avg_rating')
            ->take($limit)
            ->get();
    }
    public function searchAndFilter(array $filters):LengthAwarePaginator{
        $query=Service::withAvg("reviews", "rating");
        if (!empty($filters['query'])) {
            $query->where('title','like','%' .$filters['query'] . "%");
        }
        if (!empty($filters['price_min'])) {
            $query->where('price','>=',$filters['price_min']);
        }
        if (!empty($filters['price_max'])) {
            $query->where('price','<=',$filters['price_max']);
        }
        if(!empty($filters['rating_min'])){
            $query->having('reviews_avg_rating' ,'>=',$filters['rating_min']);
        }
        $limit=$filters['limit']??6;
        return $query->orderByDesc('id')->paginate($limit);
    }
}
