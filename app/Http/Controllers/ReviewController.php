<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReviewResource;
use App\Http\Services\ReviewService;
use App\Models\Company;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;


class ReviewController extends Controller
{
    protected ReviewService $reviewService;
    public function __construct(ReviewService $reviewService){
        $this->reviewService = $reviewService;
    }
    public function index()
    {

    }


    public function create()
    {

    }

    public function store(Request $request)
    {
        $validator=Validator::make($request->all(),[

            'service_id'=>'required',
            'rating'=>'required|numeric|between:1,5',
            'comment'=>'nullable|string',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(),400);
        }
        $userId = $request->user()->id;
        $review = $this->reviewService->addReview($request->toArray(),$userId);
        return response()->json(["review"=>new ReviewResource($review),"message"=>"Review added successfully"],200);
    }


    public function getReviewsForService(Request $request)
    {
        $reviews=$this->reviewService->getReviewsForService($request->serviceId);
        return response()->json(["reviews"=>ReviewResource::collection($reviews)],200);
    }
    public function show(Review $review)
    {

    }
    /*
    public function getReviewsForCompany(Request $request){
        $companyId= $request->company_id;
        $reviews=$this->reviewService->getReviewsForCompany($companyId);
        return response()->json(["reviews"=> ReviewResource::collection($reviews),"message"=>"Reviews were founded successfully"],202);
    }*/

     public function getReviewsForFreelancer(Request $request){
        $freelancer_id= $request->freelancer_id;
        $reviews=$this->reviewService->getReviewsForFreelancer($freelancer_id);
        return response()->json(["reviews"=> ReviewResource::collection($reviews),"message"=>"Reviews were founded successfully"],202);
    }


    public function edit(Review $review)
    {

    }

    public function update(Request $request, Review $review)
    {
    }


    public function destroy(Review $review)
    {

    }

public function getReviewsForCompanyByUserId(Request $request)
{
    // ulogovani korisnik
    $userId = auth()->id();

    // da li ovaj user ima kompaniju?
    $company = Company::where('user_id', $userId)->first();

    if (!$company) {
        return response()->json([
            'message' => 'Ovaj korisnik nema povezanu kompaniju.'
        ], 404);
    }

    // dohvati sve review-e za tu kompaniju
    $reviews = $this->reviewService->getReviewsForCompany($company->id);

    return response()->json([
        'company_id' => $company->id,
        'reviews' => ReviewResource::collection($reviews)
    ], 200);
}
}


