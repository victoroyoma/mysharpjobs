<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfileSetupController extends Controller
{
    /**
     * Complete artisan profile setup.
     */
    public function completeArtisanProfile(Request $request)
    {
        $user = $request->user();

        // Ensure user is an artisan
        if ($user->type !== 'artisan') {
            return response()->json([
                'success' => false,
                'message' => 'Only artisans can complete artisan profile setup'
            ], 403);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'bio' => 'required|string|min:100|max:1000',
            'skills' => 'required|array|min:3',
            'skills.*' => 'required|string',
            'hourly_rate' => 'required|numeric|min:10|max:100000',
            'service_radius' => 'required|integer|min:5|max:100',
            'working_hours' => 'nullable|string|max:100',
            'portfolio_images' => 'nullable|array|min:3|max:10',
            'portfolio_images.*' => 'string|url',
            'certifications' => 'nullable|array|max:10',
            'certifications.*' => 'string',
            'emergency_service' => 'nullable|boolean',
            'bank_details' => 'required|array',
            'bank_details.account_name' => 'required|string',
            'bank_details.account_number' => 'required|string',
            'bank_details.bank_name' => 'required|string',
            'bank_details.bank_code' => 'nullable|string',
            'avatar' => 'nullable|string|url',
            'preferred_categories' => 'nullable|array',
            'preferred_categories.*' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        try {
            // Update user profile
            $user->update([
                'bio' => $validated['bio'],
                'skills' => json_encode($validated['skills']),
                'hourly_rate' => $validated['hourly_rate'],
                'service_radius' => $validated['service_radius'],
                'working_hours' => $validated['working_hours'] ?? 'Flexible',
                'portfolio_images' => isset($validated['portfolio_images']) ? json_encode($validated['portfolio_images']) : null,
                'certifications' => isset($validated['certifications']) ? json_encode($validated['certifications']) : null,
                'emergency_service' => $validated['emergency_service'] ?? false,
                'bank_details' => json_encode($validated['bank_details']),
                'avatar' => $validated['avatar'] ?? $user->avatar,
                'preferred_categories' => isset($validated['preferred_categories']) ? json_encode($validated['preferred_categories']) : null,
            ]);

            // Mark profile as completed
            $user->markProfileAsCompleted();

            return response()->json([
                'success' => true,
                'message' => 'Artisan profile completed successfully!',
                'data' => [
                    'user' => $user->fresh(),
                    'completion_percentage' => $user->profile_completion_percentage
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete profile setup',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete client profile setup.
     */
    public function completeClientProfile(Request $request)
    {
        $user = $request->user();

        // Ensure user is a client
        if ($user->type !== 'client') {
            return response()->json([
                'success' => false,
                'message' => 'Only clients can complete client profile setup'
            ], 403);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'business_type' => ['required', Rule::in(['individual', 'business'])],
            'company_name' => 'required_if:business_type,business|nullable|string|max:200',
            'company_registration_number' => 'nullable|string|max:100',
            'tax_id' => 'nullable|string|max:100',
            'preferred_payment_method' => ['required', Rule::in(['Credit Card', 'Bank Transfer', 'Wallet'])],
            'avatar' => 'nullable|string|url',
            'location' => 'required|string|max:200',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        try {
            // Update user profile
            $user->update([
                'business_type' => $validated['business_type'],
                'company_name' => $validated['company_name'] ?? null,
                'company_registration_number' => $validated['company_registration_number'] ?? null,
                'tax_id' => $validated['tax_id'] ?? null,
                'preferred_payment_method' => $validated['preferred_payment_method'],
                'avatar' => $validated['avatar'] ?? $user->avatar,
                'location' => $validated['location'],
            ]);

            // Mark profile as completed
            $user->markProfileAsCompleted();

            return response()->json([
                'success' => true,
                'message' => 'Client profile completed successfully!',
                'data' => [
                    'user' => $user->fresh(),
                    'completion_percentage' => $user->profile_completion_percentage
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete profile setup',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get profile completion status.
     */
    public function getCompletionStatus(Request $request)
    {
        $user = $request->user();

        $completionPercentage = $user->calculateProfileCompletion();
        $isComplete = $user->hasCompleteProfile();

        // Get missing fields based on user type
        $missingFields = $this->getMissingFields($user);

        return response()->json([
            'success' => true,
            'data' => [
                'profile_completed' => $user->profile_completed,
                'completion_percentage' => $completionPercentage,
                'is_complete' => $isComplete,
                'profile_completed_at' => $user->profile_completed_at,
                'missing_fields' => $missingFields,
                'user_type' => $user->type
            ]
        ], 200);
    }

    /**
     * Skip profile setup for now (with limitations).
     */
    public function skipSetup(Request $request)
    {
        $user = $request->user();

        // Don't mark as completed, just acknowledge the skip
        $user->update([
            'profile_completion_percentage' => $user->calculateProfileCompletion()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile setup skipped. You can complete it later from your dashboard.',
            'data' => [
                'completion_percentage' => $user->profile_completion_percentage,
                'limitations' => [
                    'artisan' => $user->type === 'artisan' ? 'You cannot apply to jobs until your profile is complete.' : null,
                    'client' => $user->type === 'client' ? 'You cannot post jobs until your profile is complete.' : null,
                ]
            ]
        ], 200);
    }

    /**
     * Update profile completion percentage.
     */
    public function updateCompletionPercentage(Request $request)
    {
        $user = $request->user();
        
        $percentage = $user->calculateProfileCompletion();
        $user->profile_completion_percentage = $percentage;
        $user->save();

        // Auto-complete if percentage reaches 100%
        if ($percentage >= 100 && !$user->profile_completed) {
            $user->markProfileAsCompleted();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'completion_percentage' => $percentage,
                'profile_completed' => $user->profile_completed
            ]
        ], 200);
    }

    /**
     * Get missing fields for profile completion.
     */
    private function getMissingFields(User $user): array
    {
        $missing = [];

        if ($user->type === 'artisan') {
            if (empty($user->bio) || strlen($user->bio) < 100) {
                $missing[] = 'bio';
            }
            
            $skills = json_decode($user->skills, true) ?? [];
            if (count($skills) < 3) {
                $missing[] = 'skills';
            }
            
            if (!$user->hourly_rate || $user->hourly_rate <= 0) {
                $missing[] = 'hourly_rate';
            }
            
            $portfolio = json_decode($user->portfolio_images, true) ?? [];
            if (count($portfolio) < 3) {
                $missing[] = 'portfolio_images';
            }
            
            if (empty($user->bank_details)) {
                $missing[] = 'bank_details';
            }
            
            if (empty($user->avatar)) {
                $missing[] = 'avatar';
            }
            
            if (!$user->service_radius || $user->service_radius <= 0) {
                $missing[] = 'service_radius';
            }
        } elseif ($user->type === 'client') {
            if (empty($user->business_type)) {
                $missing[] = 'business_type';
            }
            
            if (empty($user->preferred_payment_method)) {
                $missing[] = 'preferred_payment_method';
            }
            
            if ($user->business_type === 'business' && empty($user->company_name)) {
                $missing[] = 'company_name';
            }
            
            if (empty($user->avatar)) {
                $missing[] = 'avatar';
            }
            
            if (empty($user->location)) {
                $missing[] = 'location';
            }
        }

        return $missing;
    }
}
