<?php

namespace App\Http\Controllers;

use App\Http\Resources\ServiceResource;
use App\Http\Services\ServiceService;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{

    protected ServiceService $serviceService;
    public function __construct(ServiceService $service){
        $this->serviceService=$service;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Service::all();
        return  ServiceResource::collection($services);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'title'=>'required',
            'price'=>'required|numeric',
            'max_employees'=>'numeric',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
        $service=$this->serviceService->addService($request->toArray(),$request->user());
        return response()->json(['data'=>new ServiceResource($service),'message'=>"Service added successfully"],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        return new ServiceResource($service);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        $validator=Validator::make($request->all(),[
            'title'=>'required',
            'price'=>'required|numeric',
            'max_employees'=>'numeric',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
        $updated=$this->serviceService->updateService($service,$request->toArray());
        return response()->json(['data'=>new ServiceResource($updated),'message'=>"Service updated successfully"],201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $this->serviceService->deleteService($service);
        return response()->json(['data'=>new ServiceResource($service),'message'=>"Service deleted successfully"],201);
    }
}
