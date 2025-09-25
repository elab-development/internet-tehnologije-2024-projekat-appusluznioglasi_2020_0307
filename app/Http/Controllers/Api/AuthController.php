<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected UserService $authService;
    public function __construct(UserService $authService){
        $this->authService = $authService;
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
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(),400);
        }

        $user=$this->authService->addUser($request);
        $token=$user->createToken('authToken')->plainTextToken;
        return response()->json(['token'=>$token,'user'=>new UserResource($user)],201);

    }
}
