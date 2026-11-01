<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request) {



        $this->validator($request);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

       $token = $user->createToken('my-app-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function validator($data) {
        $data->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();


        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email သို့မဟုတ် Password မှားနေပါသည်'], 401);
        }


        $token = $user->createToken('my-app-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }


}
