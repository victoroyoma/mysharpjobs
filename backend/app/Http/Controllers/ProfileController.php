<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Job;

class ProfileController extends Controller
{
    /**
     * Get current user's profile
     */
    public function getMyProfile(Request $request)
    {
        try {
            $user = $request->user();

            // Load relationships
            $user->load([
                'postedJobs' => function($query) {
                    $query->latest()->limit(5);
                },
                'assignedJobs' => function($query) {
                    $query->latest()->limit(5);
                }
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile retrieved successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user profile (unified method for all fields)
     */
    public function update(Request $request)
    {
        try {
            $user = $request->user();

            // Base validation rules
            $rules = [
                'name' => 'sometimes|required|string|max:255',
                'phone' => 'sometimes|nullable|string|max:20',
                'bio' => 'sometimes|nullable|string|max:2000',
                'location' => 'sometimes|required|string|max:500',
            ];

            // Artisan-specific rules
            if ($user->type === 'artisan') {
                $rules = array_merge($rules, [
                    'skills' => 'sometimes|nullable|array',
                    'skills.*.name' => 'required_with:skills|string|max:100',
                    'skills.*.level' => 'required_with:skills|string|in:Beginner,Intermediate,Expert',
                    'experience' => 'sometimes|nullable|integer|min:0|max:100',
                    'hourly_rate' => 'sometimes|nullable|numeric|min:0|max:999999.99',
                    'certifications' => 'sometimes|nullable|array',
                    'certifications.*.name' => 'required_with:certifications|string|max:255',
                    'certifications.*.issuer' => 'required_with:certifications|string|max:255',
                    'certifications.*.date' => 'required_with:certifications|date',
                    'service_radius' => 'sometimes|nullable|integer|min:5|max:100',
                    'is_available' => 'sometimes|boolean',
                ]);
            }

            // Client-specific rules
            if ($user->type === 'client') {
                $rules = array_merge($rules, [
                    'company_name' => 'sometimes|nullable|string|max:255',
                    'business_type' => 'sometimes|nullable|string|max:100',
                ]);
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Collect validated data
            $validatedData = $validator->validated();
            
            // Ensure we don't try to mass-assign fields that don't exist
            $fillableData = array_intersect_key($validatedData, array_flip($user->getFillable()));

            if (empty($fillableData)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No valid fields provided for update.',
                ], 400);
            }

            // Add timestamp and update
            $fillableData['profile_updated_at'] = now();
            $user->update($fillableData);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully!',
                'data' => $user->fresh() // Return the updated user model
            ]);

        } catch (\Exception $e) {
            \Log::error('Profile update exception for user ' . $user->id, [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred while updating the profile.'
            ], 500);
        }
    }

    /**
     * Update availability status (quick toggle)
     */
    public function updateAvailability(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->type !== 'artisan') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only artisans can update availability'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'is_available' => 'required|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update([
                'is_available' => $request->is_available,
                'profile_updated_at' => now()
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Availability updated successfully',
                'data' => [
                    'is_available' => $user->is_available
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating availability: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update client profile
     */
    public function updateClientProfile(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->type !== 'client') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only clients can update client profile'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:20',
                'avatar' => 'sometimes|url|max:500',
                'bio' => 'sometimes|string|max:1000',
                'location' => 'sometimes|array',
                'location.address' => 'sometimes|string|max:500',
                'location.city' => 'sometimes|string|max:100',
                'location.state' => 'sometimes|string|max:100',
                'location.country' => 'sometimes|string|max:100',
                'location.coordinates' => 'sometimes|array',
                'company_name' => 'sometimes|string|max:255',
                'business_type' => 'sometimes|string|max:100',
                'preferred_categories' => 'sometimes|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update($request->only([
                'name', 'phone', 'avatar', 'bio', 'location',
                'company_name', 'business_type'
            ]));

            return response()->json([
                'status' => 'success',
                'message' => 'Client profile updated successfully',
                'data' => $user->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating client profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update artisan profile
     */
    public function updateArtisanProfile(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->type !== 'artisan') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only artisans can update artisan profile'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:20',
                'avatar' => 'sometimes|url|max:500',
                'bio' => 'sometimes|string|max:1000',
                'location' => 'sometimes|array',
                'location.address' => 'sometimes|string|max:500',
                'location.city' => 'sometimes|string|max:100',
                'location.state' => 'sometimes|string|max:100',
                'location.country' => 'sometimes|string|max:100',
                'location.coordinates' => 'sometimes|array',
                'skills' => 'sometimes|array',
                'experience' => 'sometimes|integer|min:0|max:100',
                'hourly_rate' => 'sometimes|numeric|min:0',
                'certifications' => 'sometimes|array',
                'portfolio_images' => 'sometimes|array',
                'is_available' => 'sometimes|boolean',
                'service_radius' => 'sometimes|integer|min:0|max:500',
                'emergency_service' => 'sometimes|boolean',
                'insurance_verified' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update($request->only([
                'name', 'phone', 'avatar', 'bio', 'location',
                'skills', 'experience', 'hourly_rate', 'certifications',
                'portfolio_images', 'is_available', 'service_radius',
                'emergency_service', 'insurance_verified'
            ]));

            return response()->json([
                'status' => 'success',
                'message' => 'Artisan profile updated successfully',
                'data' => $user->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating artisan profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get client dashboard data
     */
    public function getClientDashboard(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->type !== 'client') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only clients can access client dashboard'
                ], 403);
            }

            // Get statistics
            $stats = [
                'total_jobs_posted' => $user->jobs_posted,
                'active_jobs' => Job::where('client_id', $user->id)
                    ->whereIn('status', ['open', 'in-progress'])
                    ->count(),
                'completed_jobs' => Job::where('client_id', $user->id)
                    ->where('status', 'completed')
                    ->count(),
                'total_spent' => $user->total_spent,
            ];

            // Get recent jobs
            $recentJobs = Job::where('client_id', $user->id)
                ->with(['artisan:id,name,avatar,rating'])
                ->latest()
                ->limit(10)
                ->get();

            // Get active jobs with details
            $activeJobs = Job::where('client_id', $user->id)
                ->whereIn('status', ['open', 'in-progress'])
                ->with(['artisan:id,name,avatar,rating,phone'])
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Dashboard data retrieved successfully',
                'data' => [
                    'user' => $user,
                    'stats' => $stats,
                    'recent_jobs' => $recentJobs,
                    'active_jobs' => $activeJobs,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching dashboard data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get artisan dashboard data
     */
    public function getArtisanDashboard(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->type !== 'artisan') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only artisans can access artisan dashboard'
                ], 403);
            }

            // Get statistics
            $stats = [
                'completed_jobs' => $user->completed_jobs ?? 0,
                'active_jobs' => Job::where('artisan_id', $user->id)
                    ->where('status', 'in-progress')
                    ->count(),
                'pending_applications' => Job::where('status', 'open')
                    ->whereJsonContains('applicants', ['user_id' => $user->id])
                    ->count(),
                'total_earnings' => 0, // TODO: Calculate from completed jobs
                'rating' => $user->rating ?? 0,
                'review_count' => $user->review_count ?? 0,
            ];

            // Get current jobs
            $currentJobs = Job::where('artisan_id', $user->id)
                ->where('status', 'in-progress')
                ->with(['client:id,name,avatar,phone'])
                ->get();

            // Get available jobs matching artisan's skills
            $availableJobs = Job::where('status', 'open')
                ->where(function($query) use ($user) {
                    if ($user->skills && is_array($user->skills)) {
                        foreach ($user->skills as $skill) {
                            $query->orWhereJsonContains('requirements', ['skill' => $skill]);
                        }
                    }
                })
                ->with(['client:id,name,avatar'])
                ->limit(10)
                ->get();

            // Get recent completed jobs
            $recentJobs = Job::where('artisan_id', $user->id)
                ->where('status', 'completed')
                ->with(['client:id,name,avatar'])
                ->latest()
                ->limit(10)
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Dashboard data retrieved successfully',
                'data' => [
                    'user' => $user,
                    'stats' => $stats,
                    'current_jobs' => $currentJobs,
                    'available_jobs' => $availableJobs,
                    'recent_jobs' => $recentJobs,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching dashboard data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload profile picture
     */
    public function uploadProfilePicture(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
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

            // Delete old avatar if it exists and is a local file
            if ($user->avatar && str_starts_with($user->avatar, 'storage/')) {
                Storage::disk('public')->delete(str_replace('storage/', '', $user->avatar));
            }

            // Store new image and get URL
            $path = $request->file('image')->store('avatars', 'public');
            $url = Storage::disk('public')->url($path);

            // Update user avatar
            $user->update(['avatar' => $url]);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile picture uploaded successfully!',
                'data' => ['avatar' => $url]
            ]);

        } catch (\Exception $e) {
            \Log::error('Avatar upload failed for user ' . $request->user()->id, [
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to upload profile picture.'
            ], 500);
        }
    }

    /**
     * Upload portfolio images (for artisans)
     */
    public function uploadPortfolioImages(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->type !== 'artisan') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only artisans can upload portfolio images'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'images' => 'required|array|max:10',
                'images.*' => 'image|mimes:jpeg,png,jpg|max:5120', // 5MB per image
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $uploadedImages = [];
            
            foreach ($request->file('images') as $image) {
                $path = $image->store('portfolios', 'public');
                $url = Storage::url($path);
                $uploadedImages[] = $url;
            }

            // Add to existing portfolio images
            $portfolioImages = $user->portfolio_images ?? [];
            $portfolioImages = array_merge($portfolioImages, $uploadedImages);
            
            $user->portfolio_images = $portfolioImages;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Portfolio images uploaded successfully',
                'data' => [
                    'portfolio_images' => $portfolioImages
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error uploading portfolio images: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete portfolio image by index
     */
    public function deletePortfolioImage(Request $request, $index = null)
    {
        try {
            $user = $request->user();

            if ($user->type !== 'artisan') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only artisans can delete portfolio images'
                ], 403);
            }

            // Accept index from route parameter or request body
            $imageIndex = $index ?? $request->input('index');

            if ($imageIndex === null) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Image index is required'
                ], 422);
            }

            $portfolioImages = $user->portfolio_images ?? [];
            
            // Validate index exists
            if (!isset($portfolioImages[$imageIndex])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Image not found at index ' . $imageIndex
                ], 404);
            }

            $imageUrl = $portfolioImages[$imageIndex];

            // Delete file if stored locally
            if (str_starts_with($imageUrl, '/storage/')) {
                $filePath = str_replace('/storage/', '', $imageUrl);
                Storage::disk('public')->delete($filePath);
            } elseif (str_starts_with($imageUrl, 'storage/')) {
                Storage::disk('public')->delete(str_replace('storage/', '', $imageUrl));
            }

            // Remove the image from array
            unset($portfolioImages[$imageIndex]);
            
            // Re-index array to maintain sequential keys
            $portfolioImages = array_values($portfolioImages);

            $user->portfolio_images = $portfolioImages;
            $user->portfolio_updated_at = now();
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Portfolio image deleted successfully',
                'data' => [
                    'portfolio_images' => $portfolioImages
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting portfolio image: ' . $e->getMessage()
            ], 500);
        }
    }
}
