<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Job;
use App\Models\Message;
use App\Models\Payment;
use App\Mail\VerificationApproved;
use App\Mail\VerificationRejected;
use App\Mail\AccountSuspended;
use App\Mail\AccountUnsuspended;
use App\Mail\DisputeResolved;

class AdminController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function getDashboardStats(Request $request)
    {
        try {
            // Total counts
            $totalUsers = User::count();
            $totalClients = User::where('type', 'client')->count();
            $totalArtisans = User::where('type', 'artisan')->count();
            $totalJobs = Job::count();
            $activeJobs = Job::whereIn('status', ['open', 'in-progress'])->count();
            $completedJobs = Job::where('status', 'completed')->count();

            // Revenue calculations
            $totalRevenue = Payment::where('status', 'completed')->sum('amount');
            $monthlyRevenue = Payment::where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('amount');

            // Platform fees (10% of total revenue)
            $platformFee = $totalRevenue * 0.10;

            // Pending verifications
            $pendingVerifications = User::where('type', 'artisan')
                ->where('is_verified', false)
                ->count();

            // Disputes
            $disputes = Payment::where('dispute_status', 'open')->count();

            // New signups (last 30 days)
            $newSignups = User::where('created_at', '>=', now()->subDays(30))->count();

            // Conversion rate (users who posted/accepted jobs vs total users)
            $activeUsers = User::whereHas('postedJobs')
                ->orWhereHas('assignedJobs')
                ->count();
            $conversionRate = $totalUsers > 0 ? ($activeUsers / $totalUsers) * 100 : 0;

            // Average job value
            $avgJobValue = Job::avg('budget') ?? 0;

            // User satisfaction (average rating)
            $avgRating = User::where('type', 'artisan')
                ->where('total_reviews', '>', 0)
                ->avg('rating') ?? 0;

            // Response time (average time to first message on jobs)
            // This is simplified - would need more complex calculation in production
            $avgResponseTime = 2.5; // hours (placeholder)

            $stats = [
                'total_users' => $totalUsers,
                'total_clients' => $totalClients,
                'total_artisans' => $totalArtisans,
                'total_jobs' => $totalJobs,
                'active_jobs' => $activeJobs,
                'completed_jobs' => $completedJobs,
                'total_revenue' => $totalRevenue,
                'monthly_revenue' => $monthlyRevenue,
                'pending_verifications' => $pendingVerifications,
                'disputes' => $disputes,
                'new_signups' => $newSignups,
                'platform_fee' => $platformFee,
                'conversion_rate' => round($conversionRate, 2),
                'avg_job_value' => round($avgJobValue, 2),
                'user_satisfaction' => round($avgRating, 2),
                'response_time' => $avgResponseTime,
            ];

            return response()->json([
                'status' => 'success',
                'message' => 'Dashboard stats retrieved successfully',
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching dashboard stats: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all users with filters (admin view)
     */
    public function getAllUsers(Request $request)
    {
        try {
            $query = User::query();

            // Filters
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('is_verified')) {
                $query->where('is_verified', $request->is_verified === 'true');
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%")
                      ->orWhere('phone', 'LIKE', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 20);
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
     * Get all jobs (admin view)
     */
    public function getAllJobs(Request $request)
    {
        try {
            $query = Job::with(['client', 'artisan']);

            // Filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            if ($request->has('priority')) {
                $query->where('priority', $request->priority);
            }

            // Date range
            if ($request->has('from_date')) {
                $query->where('created_at', '>=', $request->from_date);
            }

            if ($request->has('to_date')) {
                $query->where('created_at', '<=', $request->to_date);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 20);
            $jobs = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Jobs retrieved successfully',
                'data' => $jobs->items(),
                'pagination' => [
                    'total' => $jobs->total(),
                    'per_page' => $jobs->perPage(),
                    'current_page' => $jobs->currentPage(),
                    'last_page' => $jobs->lastPage(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching jobs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pending verifications
     */
    public function getPendingVerifications(Request $request)
    {
        try {
            $query = User::where('type', 'artisan')
                ->where('is_verified', false)
                ->whereNotNull('verification_documents');

            // Pagination
            $perPage = $request->get('per_page', 20);
            $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Pending verifications retrieved successfully',
                'data' => $users->items(),
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching pending verifications: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve verification
     */
    public function approveVerification(Request $request, $userId)
    {
        try {
            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            if ($user->type !== 'artisan') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only artisans can be verified'
                ], 400);
            }

            $user->is_verified = true;
            $user->verified_at = now();
            $user->save();

            // Send verification approval email
            try {
                Mail::to($user->email)->send(new VerificationApproved($user));
            } catch (\Exception $e) {
                \Log::error('Failed to send verification approval email: ' . $e->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'User verified successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error approving verification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject verification
     */
    public function rejectVerification(Request $request, $userId)
    {
        try {
            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            $reason = $request->input('reason', 'Documents did not meet verification requirements');

            // Send rejection email with reason
            try {
                Mail::to($user->email)->send(new VerificationRejected($user, $reason));
            } catch (\Exception $e) {
                Log::error('Failed to send verification rejection email: ' . $e->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Verification rejected',
                'data' => [
                    'user_id' => $user->id,
                    'reason' => $reason
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error rejecting verification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get analytics data
     */
    public function getAnalytics(Request $request)
    {
        try {
            $period = $request->get('period', 'month'); // day, week, month, year

            // Calculate date range
            switch ($period) {
                case 'day':
                    $startDate = now()->startOfDay();
                    break;
                case 'week':
                    $startDate = now()->startOfWeek();
                    break;
                case 'year':
                    $startDate = now()->startOfYear();
                    break;
                default: // month
                    $startDate = now()->startOfMonth();
            }

            // User growth
            $userGrowth = User::where('created_at', '>=', $startDate)
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Job statistics
            $jobStats = Job::where('created_at', '>=', $startDate)
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get();

            // Revenue by day
            $revenueByDay = Payment::where('status', 'completed')
                ->where('created_at', '>=', $startDate)
                ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Category distribution
            $categoryStats = Job::selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->get();

            // Top artisans
            $topArtisans = User::where('type', 'artisan')
                ->where('is_verified', true)
                ->orderBy('rating', 'desc')
                ->orderBy('jobs_completed', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'avatar', 'rating', 'jobs_completed', 'total_earned']);

            // Top clients
            $topClients = User::where('type', 'client')
                ->orderBy('jobs_posted', 'desc')
                ->orderBy('total_spent', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'avatar', 'jobs_posted', 'total_spent']);

            return response()->json([
                'status' => 'success',
                'message' => 'Analytics retrieved successfully',
                'data' => [
                    'period' => $period,
                    'user_growth' => $userGrowth,
                    'job_stats' => $jobStats,
                    'revenue_by_day' => $revenueByDay,
                    'category_stats' => $categoryStats,
                    'top_artisans' => $topArtisans,
                    'top_clients' => $topClients,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get disputes
     */
    public function getDisputes(Request $request)
    {
        try {
            $query = Payment::whereNotNull('dispute_status')
                ->with(['job', 'client', 'artisan']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('dispute_status', $request->status);
            }

            // Pagination
            $perPage = $request->get('per_page', 20);
            $disputes = $query->orderBy('dispute_raised_at', 'desc')->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Disputes retrieved successfully',
                'data' => $disputes->items(),
                'pagination' => [
                    'total' => $disputes->total(),
                    'per_page' => $disputes->perPage(),
                    'current_page' => $disputes->currentPage(),
                    'last_page' => $disputes->lastPage(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching disputes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resolve dispute
     */
    public function resolveDispute(Request $request, $paymentId)
    {
        try {
            $payment = Payment::find($paymentId);

            if (!$payment) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment not found'
                ], 404);
            }

            $resolution = $request->input('resolution'); // 'refund' or 'release'
            $resolutionNotes = $request->input('notes', '');

            if ($resolution === 'refund') {
                $payment->status = 'refunded';
                $payment->escrow_status = 'refunded';
            } elseif ($resolution === 'release') {
                $payment->escrow_status = 'released';
                
                // Update artisan's total earned
                $artisan = User::find($payment->artisan_id);
                if ($artisan) {
                    $artisan->total_earned += $payment->amount;
                    $artisan->save();
                }
            }

            $payment->dispute_status = 'resolved';
            $payment->dispute_resolved_at = now();
            $payment->dispute_resolution = $resolution;
            $payment->dispute_resolution_notes = $resolutionNotes;
            $payment->save();

            // Send resolution emails to both parties
            try {
                $client = User::find($payment->client_id);
                $artisan = User::find($payment->artisan_id);
                
                $disputeData = [
                    'id' => $payment->id,
                    'job_id' => $payment->job_id,
                    'amount' => $payment->amount
                ];
                
                if ($client) {
                    Mail::to($client->email)->send(new DisputeResolved($client, $disputeData, $resolution));
                }
                if ($artisan) {
                    Mail::to($artisan->email)->send(new DisputeResolved($artisan, $disputeData, $resolution));
                }
            } catch (\Exception $e) {
                Log::error('Failed to send dispute resolution emails: ' . $e->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Dispute resolved successfully',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error resolving dispute: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ban/suspend user
     */
    public function suspendUser(Request $request, $userId)
    {
        try {
            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            $reason = $request->input('reason', 'Violation of terms of service');
            $duration = $request->input('duration', 'permanent'); // days or 'permanent'

            $user->is_suspended = true;
            $user->suspension_reason = $reason;
            $user->suspended_at = now();
            
            if ($duration !== 'permanent') {
                $user->suspension_until = now()->addDays((int)$duration);
            }
            
            $user->save();

            // Send suspension email
            $durationText = $duration === 'permanent' ? null : "$duration days";
            try {
                Mail::to($user->email)->send(new AccountSuspended($user, $reason, $durationText));
            } catch (\Exception $e) {
                Log::error('Failed to send suspension email: ' . $e->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'User suspended successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error suspending user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unsuspend user
     */
    public function unsuspendUser($userId)
    {
        try {
            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            $user->is_suspended = false;
            $user->suspension_reason = null;
            $user->suspended_at = null;
            $user->suspension_until = null;
            $user->save();

            // Send unsuspension email
            try {
                Mail::to($user->email)->send(new AccountUnsuspended($user));
            } catch (\Exception $e) {
                Log::error('Failed to send unsuspension email: ' . $e->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'User unsuspended successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error unsuspending user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user (permanent)
     */
    public function deleteUser($userId)
    {
        try {
            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            // Check for active jobs
            $activeJobs = Job::where(function($query) use ($userId) {
                $query->where('client_id', $userId)
                      ->orWhere('artisan_id', $userId);
            })->whereIn('status', ['open', 'in-progress'])->count();

            if ($activeJobs > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete user with active jobs'
                ], 400);
            }

            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting user: ' . $e->getMessage()
            ], 500);
        }
    }
}
