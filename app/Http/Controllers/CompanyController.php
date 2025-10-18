<?php

namespace App\Http\Controllers;

use App\Http\Resources\CompanyResource;
use App\Http\Services\CompanyService;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    protected  CompanyService $service;

    public function __construct(CompanyService $service){
        $this->service = $service;
    }
 
    public function index()
    {
        $companies = Company::all();
        return CompanyResource::collection($companies);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator=Validator::make(request()->all(),[
            'name'=>'required',
            'user_id'=>'required',
            'badge_verified'=>'boolean',

        ]);
        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
        $company=$this->service->addCompany($request);
        return response()->json(['data'=>new CompanyResource($company),'message'=>"Company added successfully"],201);
    }

    public function show(Company $company)
    {
        return new CompanyResource($company);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company)
    {
        $validator=Validator::make(request()->all(),[
            'name'=>'required',
            'badge_verified'=>'boolean',

        ]);
        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
        $updated=$this->service->updateCompany($company,$request->toArray());
        return response()->json(['data'=>new CompanyResource($updated),'message'=>"Company updated successfully"],201);
    }

    public function destroy(Company $company)
    {
         $this->service->deleteCompany($company);
         return response()->json(['data'=>new CompanyResource($company),'message'=>"Company deleted successfully"],201);
    }


    public function getMyCompany(Request $request)
{
    $user = $request->user(); // 🔹 Ulogovani korisnik preko Sanctum-a

    $company = $this->service->getCompanyByUserId($user->id);

    if (!$company) {
        return response()->json(['message' => 'Company not found for this user'], 404);
    }

    return response()->json(['company' => new CompanyResource($company)], 200);
}
}
