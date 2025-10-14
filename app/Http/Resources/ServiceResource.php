<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
            'title'=>$this->title,
            'price'=>$this->price,
            'description'=>$this->description,
            'company'=>new CompanyResource($this->company),
            'freelancer'=>new UserResource($this->freelancer),
            'max_employees'=>$this->max_employees,
            'reviews_avg_rating'=>round($this->reviews_avg_rating??0,2)

        ];
    }
}
