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
                'jobs_completed' => $user->jobs_completed,
                'active_jobs' => Job::where('artisan_id', $user->id)
                    ->where('status', 'in-progress')
                    ->count(),
                'pending_applications' => Job::where('status', 'open')
                    ->whereJsonContains('applicants', ['user_id' => $user->id])
                    ->count(),
                'total_earned' => $user->total_earned,
                'rating' => $user->rating,
                'total_reviews' => $user->total_reviews,
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
        try {
            $validator = Validator::make($request->all(), [
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();

            // Delete old avatar if exists (if stored locally)
            if ($user->avatar && str_starts_with($user->avatar, 'storage/')) {
                Storage::delete('public/' . str_replace('storage/', '', $user->avatar));
            }

            // Store new image
            $path = $request->file('image')->store('avatars', 'public');
            $url = Storage::url($path);

            // Update user avatar
            $user->avatar = $url;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Profile picture uploaded successfully',
                'data' => [
                    'avatar' => $url
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error uploading profile picture: ' . $e->getMessage()
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
     * Delete portfolio image
     */
    public function deletePortfolioImage(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->type !== 'artisan') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only artisans can delete portfolio images'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'image_url' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $portfolioImages = $user->portfolio_images ?? [];
            
            // Remove the image URL from array
            $portfolioImages = array_values(array_filter($portfolioImages, function($img) use ($request) {
                return $img !== $request->image_url;
            }));

            // Delete file if stored locally
            if (str_starts_with($request->image_url, 'storage/')) {
                Storage::delete('public/' . str_replace('storage/', '', $request->image_url));
            }

            $user->portfolio_images = $portfolioImages;
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
