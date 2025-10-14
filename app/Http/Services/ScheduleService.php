<?php

namespace App\Http\Services;

use App\Models\Schedule;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use phpDocumentor\Reflection\PseudoTypes\List_;
use function Laravel\Prompts\text;

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
    public function showForServiceId( $serviceId){
        return Schedule::where('service_id',$serviceId)->get();
    }

    public function deleteSchedule(Schedule $schedule): bool{
       return $schedule->delete();
    }
    public function getAllSchedulesForDate($date):Collection{
        return Schedule::where('date', $date)
            ->whereDoesntHave('booking', function ($q) {
                $q->whereIn('status', ['pending', 'accepted']);
            })
            ->get();
    }
     public function getAllSchedulesForDateAndTitle($date,$title):Collection{
         $schedules = Schedule::where('date', $date)
        ->whereHas('service', function ($query) use ($title) {
          $query->where('title', $title);
         })->whereDoesntHave(
          'booking', function ($q){
              $q->whereIn('status', ['pending', 'accepted']);
          }
          )->get();
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

    public function getAllSchedulesInFuture():Collection{
        $today = Carbon::today()->toDateString();
        $nowTime = Carbon::now()->toTimeString();

        return Schedule::where(function ($query) use ($today, $nowTime) {
            $query->where('date', '>', $today)
                ->orWhere(function ($q) use ($today, $nowTime) {
                    $q->where('date', $today)
                        ->where('time_from', '>', $nowTime);
                });
        })
            ->whereDoesntHave('booking', function ($q) {
                $q->whereIn('status', ['pending', 'accepted']);
            })
            ->get();
    }
    public function getAllSchedulesForTitle($title):Collection
    {
        $today = Carbon::today()->toDateString();
        $nowTime = Carbon::now()->toTimeString();
        $schedules = Schedule::where('date','>=', $today)
            ->when('date' === $today, function ($q) use ($nowTime) {
                $q->where('time_from', '>', $nowTime);
            })
            ->whereHas('service', function ($query) use ($title) {
                $query->where('title', $title);
            })->whereDoesntHave(
                'booking', function ($q){
                $q->whereIn('status', ['pending', 'accepted']);
            }
            )->get();
        return $schedules;
    }
}
