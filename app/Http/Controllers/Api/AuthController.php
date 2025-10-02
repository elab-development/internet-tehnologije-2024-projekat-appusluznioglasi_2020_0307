<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyResource;
use App\Http\Resources\UserResource;
use App\Http\Services\CompanyService;
use App\Http\Services\UserService;
use Illuminate\Http\Request;
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
        $user=$this->authService->getUser($request);

        $token=$user->createToken('authToken')->plainTextToken;
        return response()->json(['token'=>$token,'user'=>new UserResource($user)],200);
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

        if ($request->role === 'company') {
            $company = $this->companyService->addCompany([
                'name' => $request->company_name,
                'user_id' => $user->id,
                'badge_verified' => $request->badge_verified,
                'description'=>$request->description
            ]);

        }
        $token=$user->createToken('authToken')->plainTextToken;
        return response()->json(['token'=>$token,'user'=>new UserResource($user)],201);
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'You have been logged out!']);

    }
}
