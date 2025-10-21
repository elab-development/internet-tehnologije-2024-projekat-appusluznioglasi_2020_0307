<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class UserService
{

    public function addUser(Request $request):User{
        return User::create([
            'name'=>$request['name'],
            'email'=>$request['email'],
            'password'=>Hash::make($request['password']),
            'role'=>$request['role'],
        ]);
    }
    public function getUser(Request $request): ?User
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return null; // ili baci grešku
        }

        return $user;
    }

    public function getUserForId( $request):User{
        return User::where('id',$request)->firstOrFail();
    }
}
