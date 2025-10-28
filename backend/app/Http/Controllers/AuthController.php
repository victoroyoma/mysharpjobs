<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use App\Mail\PasswordResetMail;

class AuthController extends Controller
{
    /**
     * Register a new user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(6)->letters()->mixedCase()->numbers()],
            'type' => 'required|in:artisan,client',
            'location' => 'required|string|min:2|max:200',
            'phone' => 'nullable|string',
            // Artisan specific (basic info only - detailed profile completed later)
            'skills' => 'required_if:type,artisan|array|min:1',
            'experience' => 'required_if:type,artisan|numeric|min:0',
            'hourlyRate' => 'nullable|numeric|min:0', // Optional during registration, required in profile setup
            'bio' => 'nullable|string|max:1000',
            'certifications' => 'nullable|array',
            // Client specific
            'businessType' => 'nullable|in:individual,business',
            'companyName' => 'nullable|string|max:200',
            'preferredPaymentMethod' => 'nullable|in:Credit Card,Bank Transfer,Wallet',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Create user data
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password, // Will be hashed by model
                'type' => $request->type,
                'location' => $request->location,
                'phone' => $request->phone,
                'is_verified' => false,
                'is_email_verified' => false,
                'last_active' => now(),
            ];

            // Add type-specific fields
            if ($request->type === 'artisan') {
                $userData['skills'] = $request->skills;
                $userData['experience'] = $request->experience;
                $userData['hourly_rate'] = $request->hourlyRate ?? 0; // Default to 0, will be set in profile setup
                $userData['bio'] = $request->bio ?? '';
                $userData['certifications'] = $request->certifications ?? [];
                $userData['is_available'] = true;
                $userData['rating'] = 0;
                $userData['review_count'] = 0;
                $userData['completed_jobs'] = 0;
            } else {
                $userData['business_type'] = $request->businessType ?? 'individual';
                $userData['company_name'] = $request->companyName ?? '';
                $userData['preferred_payment_method'] = $request->preferredPaymentMethod ?? 'Credit Card';
                $userData['jobs_posted'] = 0;
                $userData['total_spent'] = 0;
            }

            // Create user
            $user = User::create($userData);

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Generate refresh token
            $refreshToken = Str::random(64);
            $user->refresh_token = $refreshToken;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully',
                'data' => [
                    'user' => $user->makeHidden(['password', 'refresh_token']),
                    'token' => $token,
                    'refreshToken' => $refreshToken,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Find user by email
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Update last active
            $user->updateLastActive();

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Generate refresh token
            $refreshToken = Str::random(64);
            $user->refresh_token = $refreshToken;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => [
                    'user' => $user->makeHidden(['password', 'refresh_token']),
                    'token' => $token,
                    'refreshToken' => $refreshToken,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            // Revoke current token
            $request->user()->currentAccessToken()->delete();

            // Clear refresh token
            $request->user()->refresh_token = null;
            $request->user()->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Logout successful'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authenticated user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request)
    {
        try {
            $user = $request->user();
            $user->updateLastActive();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'user' => $user->makeHidden(['password', 'refresh_token'])
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refresh token
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function refreshToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'refreshToken' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::where('refresh_token', $request->refreshToken)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid refresh token'
                ], 401);
            }

            // Generate new tokens
            $token = $user->createToken('auth_token')->plainTextToken;
            $refreshToken = Str::random(64);
            $user->refresh_token = $refreshToken;
            $user->save();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'token' => $token,
                    'refreshToken' => $refreshToken,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token refresh failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update password
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'currentPassword' => 'required|string',
            'newPassword' => ['required', Password::min(6)->letters()->mixedCase()->numbers()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();

            // Verify current password
            if (!Hash::check($request->currentPassword, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Current password is incorrect'
                ], 401);
            }

            // Update password
            $user->password = $request->newPassword;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Password updated successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Forgot password - send reset token
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            // Generate reset token
            $resetToken = Str::random(64);
            $user->password_reset_token = $resetToken;
            $user->password_reset_expires = now()->addHours(1);
            $user->save();

            // Send email with reset token
            try {
                Mail::to($user->email)->send(new PasswordResetMail($user->email, $resetToken, $user->name));
            } catch (\Exception $e) {
                Log::error('Failed to send password reset email: ' . $e->getMessage());
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to send reset email. Please try again later.'
                ], 500);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Password reset instructions sent to your email',
                'data' => []
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate reset token',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset password with token
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'resetToken' => 'required|string',
            'newPassword' => ['required', Password::min(6)->letters()->mixedCase()->numbers()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::where('password_reset_token', $request->resetToken)
                ->where('password_reset_expires', '>', now())
                ->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid or expired reset token'
                ], 401);
            }

            // Update password
            $user->password = $request->newPassword;
            $user->password_reset_token = null;
            $user->password_reset_expires = null;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Password reset successful'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password reset failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
