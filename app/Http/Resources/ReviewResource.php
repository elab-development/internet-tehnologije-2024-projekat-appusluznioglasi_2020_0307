<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'user' => new UserResource($this->user),
            'service' => [
                'id' => $this->service->id,
                'title' => $this->service->title,
                'price' => $this->service->price,
            ],
            'created_at' => Carbon::parse($this->created_at)->format('d.m.Y. H:i'),
        ];
    }
}
