<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'string', 'email:rfc', 'max:254'],
            'password' => ['required', 'string', 'min:8', 'max:128'],
        ]);

        $email = strtolower(trim($validated['email']));

        if (User::query()->where('email', $email)->exists()) {
            return response()->json(['message' => 'An account with this email already exists.', 'code' => 'EMAIL_ALREADY_EXISTS'], 409);
        }

        $user = User::create([
            'name' => trim($validated['name']),
            'email' => $email,
            'password' => $validated['password'],
            'pointsBalance' => 0,
            'status' => 'active',
            'role' => 'renter',
        ]);

        return $this->tokenResponse($user, 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email:rfc', 'max:254'],
            'password' => ['required', 'string', 'max:128'],
        ]);

        $user = User::where('email', strtolower(trim($credentials['email'])))->first();

        if (! $user || ($user->status ?? 'active') !== 'active' || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are invalid.',
                'code' => 'INVALID_CREDENTIALS',
            ], 401);
        }

        return $this->tokenResponse($user);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'user' => $this->userData($user),
            'pointsBalance' => (int) ($user->pointsBalance ?? 0),
        ]);
    }

    private function tokenResponse(User $user, int $status = 200): JsonResponse
    {
        $token = $user->createToken('fontrent-access-token')->plainTextToken;

        return response()->json([
            'accessToken' => $token,
            'user' => $this->userData($user),
        ], $status);
    }

    /** @return array{id: string, name: string, email: string, role: string} */
    private function userData(User $user): array
    {
        return [
            'id' => (string) $user->getKey(),
            'name' => (string) $user->name,
            'email' => (string) $user->email,
            'role' => $user->role === 'user' ? 'renter' : (string) $user->role,
        ];
    }
}
