<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class testController extends Controller
{
    public function test(Request $request)
    {

        $user = User::first();

        return response()->json($user->properties()->get());
    }
}
