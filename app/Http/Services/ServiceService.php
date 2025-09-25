<?php

namespace App\Http\Services;

use App\Models\Service;

class ServiceService
{

    public function addService(array $data): Service
    {
        $service=Service::create(
            [
                'title'=>$data['title'],
                'description'=>$data['description']??null,
                'price'=>$data['price'],
                'company_id'=>$data['company_id']??null,
                'freelancer_id'=>$data['freelancer_id']??null,
                'max_employees'=>$data['max_employees']??1,
            ]
        );
        return $service;
    }
    public function updateService(Service $service, array $data): Service{
        $service->update($data);
        return $service;

    }
    public function deleteService(Service $service): bool{
       return $service->delete();
    }
}
