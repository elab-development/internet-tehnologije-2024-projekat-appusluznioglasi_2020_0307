<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingResource;
use App\Http\Services\BookingService;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    protected BookingService $bookingService;
    public function __construct(BookingService $bookingService){
        $this->bookingService = $bookingService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->status;
        $bookings = Booking::query()
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->paginate(5);
        return BookingResource::collection($bookings);
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

            'schedule_id'=>'required',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(),400);
        }
        if($this->bookingService->getBookingsByScheduleId($request->schedule_id)!=null){
            return response()->json(['message'=> 'This schedule is already booked.'],400);
        }
        $userId = $request->user()->id;
        $booking =$this->bookingService->addBooking($request->toArray(), $userId);
        return response()->json(['booking'=>new BookingResource($booking),'message'=>'Booking created successfully'],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        return new BookingResource($booking);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {

        $bookingUpdated =$this->bookingService->updateBooking($booking,$request->toArray());
        return response()->json(['booking'=>new BookingResource($bookingUpdated),'message'=>'Booking updated successfully'],201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        $this->bookingService->deleteBooking($booking);
    }


    public function getAllBookingsForCurrentUser(Request $request)
    {
        $userId = $request->user()->id;
        $bookings=$this->bookingService->getBookingsByUserId($userId);
        return response()->json(['bookings'=>BookingResource::collection($bookings),'message'=>"All booking for retrieved successfully"],201);
    }
    public function getAllBookingsForSchedule(Request $request)
    {
        $scheduleId=$request->schedule_id;
        $bookings=$this->bookingService->getBookingsByScheduleId($scheduleId);
        return response()->json(['bookings'=>BookingResource::collection($bookings),'message'=>"All booking for retrieved successfully"],201);

    }
    public function getAllBookingsForUserForStatus(Request $request){
        $user = $request->user();
        $status=$request->status;
        $bookings=$this->bookingService->getBookingsByStatusForUserId($status,$user);
        return response()->json(['bookings'=> BookingResource::collection($bookings),'message'=>"All booking for  status ${status} retrieved successfully"],201);
    }

}
