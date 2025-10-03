<?php

namespace App\Http\Services;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use function Pest\Laravel\get;

class ReviewService
{

    public function addReview(array $data,$userId): Review
    {
        return Review::create([
          "user_id"=> $userId,
          "service_id"=>$data ["service_id"],
          "comment"=>$data["comment"]??null,
          "rating"=>$data["rating"],
        ]);
       
    }
    public function getReviewsForCompany($companyId): Collection
    {
      return Review::with('service')
        ->whereHas('service', function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        })
        ->get();
   
  }
       public function getReviewsForFreelancer($freelancerId): Collection
    {
      return Review::with('service')
        ->whereHas('service', function ($q) use ($freelancerId) {
            $q->where('freelancer_id', $freelancerId);
        })
        ->get();
   
  }
  
  
   





}
