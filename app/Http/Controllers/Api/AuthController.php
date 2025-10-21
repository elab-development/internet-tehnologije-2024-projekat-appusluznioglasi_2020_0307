<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyResource;
use App\Http\Resources\UserResource;
use App\Http\Services\CompanyService;
use App\Http\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected UserService $authService;
    protected CompanyService $companyService;
    public function __construct(UserService $authService,CompanyService $companyService){
        $this->authService = $authService;
        $this->companyService =$companyService;
    }
    public function login(Request $request){
        $validator=Validator::make($request->only('email','password'),[
            'email'=>'required|string|email|max:255',
            'password'=>'required|string|min:8',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(),400);
        }
        $user = $this->authService->getUser($request);

        if (!$user) {
            return response()->json(['error' => 'Neispravan email ili lozinka'], 401);
        }

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user)
        ], 200);
    }
    public function register(Request $request){
        $validator=Validator::make($request->all(),[
            'name'=>'required|string|max:255',
            'email'=>'required|string|email|max:255|unique:users',
            'password'=>'required|string|min:8',
            'company_name' => 'required_if:role,company|string|max:255',
            'description' => 'nullable|string',
            'badge_verified' => 'boolean',
            'role'=>"required|string",
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(),400);
        }

        $user = $this->authService->addUser($request);
        $geocodedData = ['address' => null, 'latitude' => null, 'longitude' => null];

        if ($request->role === 'company') {
            $geocodedData = $this->geocodeAddress($request->address);

            // Provera da li je geokodiranje uspešno
            if (is_null($geocodedData['latitude'])) {
                // Ako adresa nije pronađena, obrišite korisnika (ili vratite grešku)
                $user->delete();
                return response()->json(['address' => 'Navedena adresa nije validna ili nije pronađena.'], 422);
            }
            $companyData = array_merge([
                'name' => $request->company_name,
                'description'=>$request->description,
                'badge_verified' => $request->badge_verified,
                'user_id' => $user->id,
            ], $geocodedData);

            $company = $this->companyService->addCompany($companyData);

        }
        $token=$user->createToken('authToken')->plainTextToken;
        return response()->json(['token'=>$token,'user'=>new UserResource($user)],201);
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'You have been logged out!']);

    }
    public function getUserForId(Request $request){
        $user=$request->user();
        return response()->json(['user'=>$user],200);
    }
    protected function geocodeAddress(string $address): array
    {
        $apiKey = env('GOOGLE_MAPS_API_KEY');

        if (!$apiKey || empty($address)) {
            return ['address' => $address, 'latitude' => null, 'longitude' => null];
        }

        try {
            $response = Http::timeout(5)->get('https://maps.googleapis.com/maps/api/geocode/json', [
                'address' => $address,
                'key' => $apiKey,
            ]);

            $data = $response->json();

            if ($data['status'] === 'OK' && !empty($data['results'])) {
                $location = $data['results'][0]['geometry']['location'];

                return [
                    'address' => $address,
                    'latitude' => $location['lat'],
                    'longitude' => $location['lng'],
                ];
            }

        } catch (\Exception $e) {
            \Log::error("Geocoding API Error: " . $e->getMessage());
        }

        // Vraćanje null koordinata ako geokodiranje nije uspelo
        return ['address' => $address, 'latitude' => null, 'longitude' => null];
    }
}
