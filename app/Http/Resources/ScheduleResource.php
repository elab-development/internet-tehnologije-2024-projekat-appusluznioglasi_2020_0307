<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'service'=>new ServiceResource($this->service)
            ,'time_from'=>$this->time_from,
            'time_to'=>$this->time_to,
            'date'=>$this->date,
            'employees_assigned'=>$this->assigned_employees
        ];
    }
}
