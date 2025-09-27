<?php

namespace App\Http\Services;

use App\Models\Schedule;
use App\Models\User;
use Exception;

class ScheduleService
{

    public function addSchedule(array $data): Schedule
    {
        $schedule = Schedule::create([
            'date' => $data['date'],
            'time_from' => $data['time_from'] ,
            'time_to' => $data['time_to'] ,
            'service_id' => $data['service_id'] ,
            'assigned_employees' => $data['assigned_employees']??1 
        ]);

        return $schedule;

       

    } 
    public function updateService(Service $service, array $data): Service{
        $service->update($data);
        return $service;

    }
    public function deleteService(Service $service): bool{
       return $service->delete();
    }
}
