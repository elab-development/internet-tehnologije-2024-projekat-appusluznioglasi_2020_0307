<?php

namespace App\Http\Controllers;

use App\Http\Resources\ScheduleResource;
use App\Http\Services\BookingService;
use App\Http\Services\ScheduleService;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{
    protected ScheduleService $scheduleService;
    protected BookingService $bookingService;
    public function __construct(ScheduleService $scheduleService,BookingService $bookingService){
        $this->scheduleService = $scheduleService;
        $this->bookingService = $bookingService;
    }
    public function index()
    {

        $schedule = Schedule::all();
        return ScheduleResource::collection($schedule);
    }
    public function showAllSchedules(){
        $schedules =$this->scheduleService->getAllSchedulesInFuture();
        return response()->json(['schedules'=>ScheduleResource::collection($schedules),'message'=>'All Schedules Found'],200);
    }
    public function showAllSchedulesForServiceTitle(Request $request){
        $title=$request->title;
        $schedules=$this->scheduleService->getAllSchedulesForTitle($title);
        return response()->json(['schedules'=>ScheduleResource::collection($schedules),'message'=>"All Schedules for ${title} were founded"],200);

    }
    public function showForServiceId(Request $request){
        $schedules=$this->scheduleService->showForServiceId($request->service_id);
        $schedulesFiltered=$schedules->filter(function($schedule){
            $booking=$this->bookingService->getBookingByScheduleId($schedule->id);
            return !$booking;
        });
        return response()->json(['schedules'=>ScheduleResource::collection($schedulesFiltered)],200);
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
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'time_from' => ['required', 'date_format:H:i'],
            'time_to'   => ['required', 'date_format:H:i','after:time_from'],
            'assigned_employees'=> ['integer'],
            'service_id'=>['required'],
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
       $schedule=$this->scheduleService->addSchedule($request->toArray());
       return response()->json(['schedule'=>new ScheduleResource($schedule),'message'=>"Schedule added successfully"],201);
    }
    public function show(Schedule $schedule)
    {
        return new ScheduleResource($schedule);
    }
    public function showForDate(Request $request)
    {
        $date=$request->input('date');
        $schedules=$this->scheduleService->getAllSchedulesForDate($date);
        return response()->json(["schedules"=>ScheduleResource::collection($schedules)],200);
    }
    public function showForDateForServiceName(Request $request)
    {
        $date=$request->input('date');
        $title=$request->input('title');

        $schedules=$this->scheduleService->getAllSchedulesForDateAndTitle($date,$title);
        return response()->json(["schedules"=>ScheduleResource::collection($schedules)],200);
    }
     public function showForDateForUser(Request $request)
    {
        $date=$request->input('date');
        $user=$request->user();
        if($user->role=='company'){
                    $schedules=$this->scheduleService->getAllSchedulesForDateAndUser($date,companyUserId:$user->id);

        }else{
                $schedules=$this->scheduleService->getAllSchedulesForDateAndUser($date,freelancerId: $user->id);

        }

        return response()->json(["schedules"=>ScheduleResource::collection($schedules)],200);
    }
    public function showForUser(Request $request)
    {
        $schedules = collect();
        $user=$request->user();
        if($user->role=='company'){
                    $schedules=$this->scheduleService->getAllSchedulesForUser(companyUserId:$user->id,freelancerId: null);

        }
        if ($user->role=='freelancer'){
            $schedules=$this->scheduleService->getAllSchedulesForUser(freelancerId: $user->id,companyUserId: null);
        }
        return response()->json(["schedules"=>ScheduleResource::collection($schedules),'message'=>"Schedules founded successfully"],200);
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

        $schedule=$this->scheduleService->updateSchedule($schedule,$request->toArray());
        return response()->json(['schedule'=>new ScheduleResource($schedule),'message'=>"Schedule updated successfully"]);
    }

    public function destroy(Schedule $schedule)
    {
        $this->scheduleService->deleteSchedule($schedule);
        return response()->json(["message"=>"Schedule deleted successfully"],200);
    }

}
