<?php

namespace App\Http\Services;

use App\Models\Schedule;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use phpDocumentor\Reflection\PseudoTypes\List_;

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
    public function updateSchedule(Schedule $schedule, array $data): Schedule{
        $schedule->update($data);
        return $schedule;

    }
    public function deleteSchedule(Schedule $schedule): bool{
       return $$schedule->delete();
    }
    public function getAllSchedulesForDate($date):Collection{
      $schedules = Schedule::where('date', $date)->get();
      return $schedules;
    }
     public function getAllSchedulesForDateAndTitle($date,$title):Collection{
      $schedules = Schedule::where('date', $date)
      ->whereHas('service', function ($query) use ($title) {
        $query->where('title', $title);
      })->get();
      return $schedules;
    }
     public function getAllSchedulesForDateAndUser($date,$freelancerId=null,$companyUserId=null):Collection{
      return Schedule::where('date', $date)
        ->whereHas('service', function ($q) use ($freelancerId, $companyUserId) {
            if ($freelancerId) {
                $q->whereNull('company_id')
                  ->where('freelancer_id', $freelancerId);
            }

            if ($companyUserId) {
                $q->whereNull('freelancer_id')
                  ->whereHas('company', function ($q2) use ($companyUserId) {
                      $q2->where('user_id', $companyUserId);
                  });
            }
        })
        ->get();
    }
    public function getAllSchedulesForUser($freelancerId=null,$companyUserId=null):Collection{
      return Schedule::whereHas('service', function ($q) use ($freelancerId, $companyUserId) {
            if ($freelancerId) {
                $q->where('freelancer_id', $freelancerId);
            }

            if ($companyUserId) {
                $q->whereHas('company', function ($q2) use ($companyUserId) {
                      $q2->where('user_id', $companyUserId);
                  });
            }
        })
        ->get();
    }
}
