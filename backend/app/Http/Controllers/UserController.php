<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Job;

class UserController extends Controller
{
    /**
     * Get all users with pagination and filters
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();

            // Filter by type
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Filter by verification status
            if ($request->has('is_verified')) {
                $query->where('is_verified', $request->is_verified === 'true' || $request->is_verified === '1');
            }

            // Filter by availability (for artisans)
            if ($request->has('is_available')) {
                $query->where('is_available', $request->is_available === 'true' || $request->is_available === '1');
            }

            // Search by name or email
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $users = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Users retrieved successfully',
                'data' => $users->items(),
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching users: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user by ID (public profile)
     */
    public function show($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            // Get recent completed jobs with reviews
            $recentJobs = Job::where(function($query) use ($id) {
                $query->where('client_id', $id)
                      ->orWhere('artisan_id', $id);
            })
            ->where('status', 'completed')
            ->whereNotNull('review')
            ->with(['client:id,name,avatar', 'artisan:id,name,avatar'])
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

            // Transform to review format
            $reviews = $recentJobs->map(function($job) {
                return [
                    'job_id' => $job->id,
                    'title' => $job->title,
                    'review' => $job->review,
                    'rating' => $job->rating,
                    'completion_date' => $job->updated_at,
                ];
            });

            // Hide sensitive information
            $userData = $user->makeHidden(['email', 'phone', 'password', 'remember_token']);

            return response()->json([
                'status' => 'success',
                'message' => 'User retrieved successfully',
                'data' => array_merge($userData->toArray(), [
                    'recent_reviews' => $reviews
                ])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user profile (authenticated user)
     */
    public function update(Request $request, $id)
    {
        try {
            // Check if user is updating their own profile or is admin
            if ($request->user()->id != $id && !$request->user()->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to update this profile'
                ], 403);
            }

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            // Validation rules
            $rules = [
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
            ];

            // Add type-specific validation
            if ($user->type === 'artisan') {
                $rules = array_merge($rules, [
                    'skills' => 'sometimes|array',
                    'experience' => 'sometimes|integer|min:0|max:100',
                    'hourly_rate' => 'sometimes|numeric|min:0',
                    'certifications' => 'sometimes|array',
                    'portfolio_images' => 'sometimes|array',
                    'is_available' => 'sometimes|boolean',
                    'service_radius' => 'sometimes|integer|min:0|max:500',
                    'emergency_service' => 'sometimes|boolean',
                ]);
            } elseif ($user->type === 'client') {
                $rules = array_merge($rules, [
                    'company_name' => 'sometimes|string|max:255',
                    'business_type' => 'sometimes|string|max:100',
                ]);
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Remove protected fields that shouldn't be updated via this endpoint
            $updates = $request->except([
                'password',
                'email',
                'type',
                'is_verified',
                'is_email_verified',
                'rating',
                'total_reviews',
                'jobs_posted',
                'jobs_completed',
                'total_spent',
                'total_earned',
                'remember_token'
            ]);

            $user->update($updates);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'data' => $user->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user account
     */
    public function destroy(Request $request, $id)
    {
        try {
            // Check if user is deleting their own account or is admin
            if ($request->user()->id != $id && !$request->user()->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to delete this account'
                ], 403);
            }

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            // Check if user has active jobs
            $activeJobs = Job::where(function($query) use ($id) {
                $query->where('client_id', $id)
                      ->orWhere('artisan_id', $id);
            })
            ->whereIn('status', ['open', 'in-progress'])
            ->count();

            if ($activeJobs > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete account with active jobs. Please complete or cancel all active jobs first.'
                ], 400);
            }

            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Account deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting account: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update password
     */
    public function updatePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();

            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Current password is incorrect'
                ], 400);
            }

            // Update password
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Password updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating password: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's own profile (authenticated)
     */
    public function profile(Request $request)
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
}
