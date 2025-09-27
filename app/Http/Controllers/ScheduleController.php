<?php

namespace App\Http\Controllers;

use App\Http\Resources\ScheduleResource;
use App\Http\Services\ScheduleService;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Validator;

class ScheduleController extends Controller
{
    protected ScheduleService $scheduleService;
    public function __construct(ScheduleService $scheduleService){
        $this->scheduleService = $scheduleService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        $schedule = Schedule::all();
        return ScheduleResource::collection($schedule);
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
            'date'=>['required', 'date_format:Y-m-d'],
            'time_from' => ['required', 'date_format:H:i'],
            'time_to'   => ['required', 'date_format:H:i'],
            'assigned_employees'=> ['integer'],
            'service_id'=>['required'],
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
       $schedule=$this->scheduleService->addSchedule($request->toArray());
       return response()->json(['schedule'=>new ScheduleResource($schedule),'message'=>"Schedule added successfully"],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Schedule $schedule)
    {
        return new ScheduleResource($schedule);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schedule $schedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Schedule $schedule)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        //
    }
}
