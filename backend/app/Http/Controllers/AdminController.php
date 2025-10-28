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
                ->where('review_count', '>', 0)
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
     * Get system health metrics
     */
    public function getSystemHealth()
    {
        try {
            // Database health check
            $dbStatus = 'online';
            $dbResponseTime = 0;
            try {
                $start = microtime(true);
                \DB::connection()->getPdo();
                $dbResponseTime = round((microtime(true) - $start) * 1000, 2); // in milliseconds
            } catch (\Exception $e) {
                $dbStatus = 'offline';
            }

            // Cache health check (if using Redis/Memcached)
            $cacheStatus = 'online';
            $cacheResponseTime = 0;
            try {
                $start = microtime(true);
                \Cache::has('health_check_key');
                $cacheResponseTime = round((microtime(true) - $start) * 1000, 2);
            } catch (\Exception $e) {
                $cacheStatus = 'offline';
            }

            // Queue health check
            $queueStatus = 'online';
            $pendingJobs = 0;
            $failedJobs = 0;
            try {
                $pendingJobs = \DB::table('jobs')->where('queue', 'default')->count();
                $failedJobs = \DB::table('failed_jobs')->count();
            } catch (\Exception $e) {
                $queueStatus = 'offline';
            }

            // Server metrics
            $uptime = 0;
            $memoryUsage = [
                'used' => 0,
                'free' => 0,
                'total' => 0,
                'percentage' => 0
            ];
            
            // Get PHP memory usage
            $memoryUsage['used'] = memory_get_usage(true);
            $memoryLimit = ini_get('memory_limit');
            if (preg_match('/^(\d+)(.)$/', $memoryLimit, $matches)) {
                if ($matches[2] == 'M') {
                    $memoryUsage['total'] = $matches[1] * 1024 * 1024;
                } elseif ($matches[2] == 'K') {
                    $memoryUsage['total'] = $matches[1] * 1024;
                } elseif ($matches[2] == 'G') {
                    $memoryUsage['total'] = $matches[1] * 1024 * 1024 * 1024;
                }
            }
            $memoryUsage['free'] = $memoryUsage['total'] - $memoryUsage['used'];
            $memoryUsage['percentage'] = $memoryUsage['total'] > 0 
                ? round(($memoryUsage['used'] / $memoryUsage['total']) * 100, 2) 
                : 0;

            // Active database connections
            $activeConnections = 0;
            try {
                $activeConnections = \DB::select('SHOW STATUS WHERE variable_name = "Threads_connected"')[0]->Value ?? 0;
            } catch (\Exception $e) {
                // Fallback if query fails
                $activeConnections = 1;
            }

            // Storage health
            $storageStatus = 'online';
            $diskUsage = [
                'total' => disk_total_space('/'),
                'free' => disk_free_space('/'),
                'used' => 0,
                'percentage' => 0
            ];
            $diskUsage['used'] = $diskUsage['total'] - $diskUsage['free'];
            $diskUsage['percentage'] = $diskUsage['total'] > 0 
                ? round(($diskUsage['used'] / $diskUsage['total']) * 100, 2) 
                : 0;

            // API response times (sample recent activities)
            $avgApiResponseTime = 0;
            try {
                $start = microtime(true);
                User::limit(10)->get();
                $avgApiResponseTime = round((microtime(true) - $start) * 1000, 2);
            } catch (\Exception $e) {
                $avgApiResponseTime = 0;
            }

            // Determine overall system status
            $overallStatus = 'healthy';
            if ($dbStatus === 'offline' || $cacheStatus === 'offline') {
                $overallStatus = 'critical';
            } elseif ($memoryUsage['percentage'] > 90 || $diskUsage['percentage'] > 90) {
                $overallStatus = 'warning';
            } elseif ($failedJobs > 10) {
                $overallStatus = 'warning';
            }

            $health = [
                'status' => $overallStatus,
                'timestamp' => now()->toIso8601String(),
                'database' => [
                    'status' => $dbStatus,
                    'response_time' => $dbResponseTime,
                    'connections' => $activeConnections
                ],
                'cache' => [
                    'status' => $cacheStatus,
                    'response_time' => $cacheResponseTime
                ],
                'queue' => [
                    'status' => $queueStatus,
                    'pending_jobs' => $pendingJobs,
                    'failed_jobs' => $failedJobs
                ],
                'server' => [
                    'status' => 'online',
                    'uptime' => $uptime,
                    'memory_usage' => $memoryUsage,
                    'disk_usage' => $diskUsage,
                    'active_connections' => $activeConnections
                ],
                'api' => [
                    'avg_response_time' => $avgApiResponseTime
                ]
            ];

            return response()->json([
                'status' => 'success',
                'message' => 'System health retrieved successfully',
                'data' => $health
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching system health: ' . $e->getMessage()
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

            // Sorting with field mapping and validation
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            
            // Map frontend field names to database column names
            $sortFieldMap = [
                'lastUpdate' => 'last_active',
                'createdAt' => 'created_at',
                'created_at' => 'created_at',
                'name' => 'name',
                'email' => 'email',
                'type' => 'type',
                'last_active' => 'last_active',
                'is_verified' => 'is_verified',
            ];
            
            // Use mapped field or default to created_at if invalid
            $sortColumn = $sortFieldMap[$sortBy] ?? 'created_at';
            $query->orderBy($sortColumn, $sortOrder);

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

            // Sorting with field mapping and validation
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            
            // Map frontend field names to database column names
            $sortFieldMap = [
                'lastUpdate' => 'updated_at',
                'createdAt' => 'created_at',
                'created_at' => 'created_at',
                'updated_at' => 'updated_at',
                'amount' => 'budget',
                'budget' => 'budget',
                'status' => 'status',
                'title' => 'title',
                'category' => 'category',
                'priority' => 'priority',
            ];
            
            // Use mapped field or default to created_at if invalid
            $sortColumn = $sortFieldMap[$sortBy] ?? 'created_at';
            $query->orderBy($sortColumn, $sortOrder);

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

            // User growth with breakdown by type
            $userGrowthRaw = User::where('created_at', '>=', $startDate)
                ->selectRaw('DATE(created_at) as date, type, COUNT(*) as count')
                ->groupBy('date', 'type')
                ->orderBy('date')
                ->get();

            // Transform user growth data to include client_count, artisan_count, and total
            $userGrowth = $userGrowthRaw->groupBy('date')->map(function ($group) {
                return [
                    'date' => $group->first()->date,
                    'client_count' => $group->where('type', 'client')->sum('count'),
                    'artisan_count' => $group->where('type', 'artisan')->sum('count'),
                    'total' => $group->sum('count'),
                ];
            })->values();

            // Job statistics
            $jobStats = Job::where('created_at', '>=', $startDate)
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get();

            // Revenue by day
            $revenueByDay = Payment::where('status', 'completed')
                ->where('created_at', '>=', $startDate)
                ->selectRaw('DATE(created_at) as date, SUM(amount) as total_revenue')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Category distribution
            $categoryStats = Job::selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->orderBy('count', 'desc')
                ->get();

            // Top artisans - Calculate jobs completed and total earned from relationships
            $topArtisans = User::where('type', 'artisan')
                ->where('is_verified', true)
                ->select('users.id', 'users.name', 'users.avatar', 'users.rating')
                ->selectRaw('(SELECT COUNT(*) FROM jobs_custom WHERE jobs_custom.artisan_id = users.id AND jobs_custom.status = "completed") as completed_jobs')
                ->selectRaw('(SELECT COALESCE(SUM(amount), 0) FROM payments WHERE payments.artisan_id = users.id AND payments.status = "completed") as total_earned')
                ->orderBy('users.rating', 'desc')
                ->orderBy('completed_jobs', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($artisan) {
                    return [
                        'id' => $artisan->id,
                        'name' => $artisan->name,
                        'avatar' => $artisan->avatar,
                        'avg_rating' => $artisan->rating ?? 0,
                        'completed_jobs' => $artisan->completed_jobs ?? 0,
                        'total_earned' => $artisan->total_earned ?? 0,
                    ];
                });

            // Top clients - Calculate jobs posted and total spent from relationships
            $topClients = User::where('type', 'client')
                ->select('users.id', 'users.name', 'users.avatar')
                ->selectRaw('(SELECT COUNT(*) FROM jobs_custom WHERE jobs_custom.client_id = users.id) as jobs_posted')
                ->selectRaw('(SELECT COALESCE(SUM(amount), 0) FROM payments WHERE payments.client_id = users.id AND payments.status = "completed") as total_spent')
                ->orderBy('jobs_posted', 'desc')
                ->orderBy('total_spent', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($client) {
                    return [
                        'id' => $client->id,
                        'name' => $client->name,
                        'avatar' => $client->avatar,
                        'jobs_posted' => $client->jobs_posted ?? 0,
                        'total_spent' => $client->total_spent ?? 0,
                    ];
                });

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

    /**
     * Get detailed user information
     */
    public function getUserDetails($userId)
    {
        try {
            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            // Base user data
            $userData = $user->toArray();

            // Get job statistics based on user type
            if ($user->type === 'client') {
                $postedJobs = Job::where('client_id', $userId)->count();
                $activeJobs = Job::where('client_id', $userId)
                    ->whereIn('status', ['open', 'in-progress'])
                    ->count();
                $completedJobs = Job::where('client_id', $userId)
                    ->where('status', 'completed')
                    ->count();
                $totalSpent = Payment::where('client_id', $userId)
                    ->where('status', 'completed')
                    ->sum('amount');

                // Recent jobs posted
                $recentJobs = Job::where('client_id', $userId)
                    ->with('artisan')
                    ->orderBy('created_at', 'desc')
                    ->limit(10)
                    ->get();

                $userData['stats'] = [
                    'posted_jobs' => $postedJobs,
                    'active_jobs' => $activeJobs,
                    'completed_jobs' => $completedJobs,
                    'total_spent' => $totalSpent,
                ];
                $userData['recent_jobs'] = $recentJobs;

            } elseif ($user->type === 'artisan') {
                $assignedJobs = Job::where('artisan_id', $userId)->count();
                $activeJobs = Job::where('artisan_id', $userId)
                    ->whereIn('status', ['in-progress'])
                    ->count();
                $completedJobs = Job::where('artisan_id', $userId)
                    ->where('status', 'completed')
                    ->count();
                $totalEarnings = Payment::where('artisan_id', $userId)
                    ->where('status', 'completed')
                    ->sum('amount');

                // Recent jobs worked on
                $recentJobs = Job::where('artisan_id', $userId)
                    ->with('client')
                    ->orderBy('created_at', 'desc')
                    ->limit(10)
                    ->get();

                $userData['stats'] = [
                    'assigned_jobs' => $assignedJobs,
                    'active_jobs' => $activeJobs,
                    'completed_jobs' => $completedJobs,
                    'total_earnings' => $totalEarnings,
                    'rating' => $user->rating ?? 0,
                    'total_reviews' => $user->review_count ?? 0,
                ];
                $userData['recent_jobs'] = $recentJobs;
            }

            // Payment history
            $payments = Payment::where(function($query) use ($userId, $user) {
                if ($user->type === 'client') {
                    $query->where('client_id', $userId);
                } else {
                    $query->where('artisan_id', $userId);
                }
            })
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

            $userData['recent_payments'] = $payments;

            // Account activity
            $userData['account_info'] = [
                'is_verified' => $user->is_verified,
                'is_suspended' => $user->is_suspended ?? false,
                'suspension_reason' => $user->suspension_reason ?? null,
                'verified_at' => $user->verified_at ?? null,
                'last_login' => $user->last_login_at ?? null,
                'profile_completed' => $user->profile_completed ?? false,
            ];

            return response()->json([
                'status' => 'success',
                'message' => 'User details retrieved successfully',
                'data' => $userData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching user details: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activities across the platform
     */
    public function getRecentActivities(Request $request)
    {
        try {
            $limit = $request->get('limit', 50);
            $activities = [];

            // Get recent user registrations
            $recentUsers = User::orderBy('created_at', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'email', 'type', 'created_at']);

            foreach ($recentUsers as $user) {
                $activities[] = [
                    'id' => 'user_' . $user->id,
                    'type' => 'user_registered',
                    'user' => $user->name,
                    'user_id' => $user->id,
                    'user_type' => $user->type,
                    'description' => "{$user->name} registered as {$user->type}",
                    'timestamp' => $user->created_at,
                    'priority' => 'low',
                ];
            }

            // Get recent jobs
            $recentJobs = Job::with(['client', 'artisan'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            foreach ($recentJobs as $job) {
                $activities[] = [
                    'id' => 'job_' . $job->id,
                    'type' => 'job_posted',
                    'user' => $job->client->name ?? 'Unknown',
                    'user_id' => $job->client_id,
                    'job_id' => $job->id,
                    'description' => "New job posted: {$job->title}",
                    'timestamp' => $job->created_at,
                    'priority' => 'medium',
                    'amount' => $job->budget,
                ];
            }

            // Get recent payments
            $recentPayments = Payment::with(['client', 'artisan'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            foreach ($recentPayments as $payment) {
                $activities[] = [
                    'id' => 'payment_' . $payment->id,
                    'type' => 'payment_processed',
                    'user' => $payment->client->name ?? 'Unknown',
                    'user_id' => $payment->client_id,
                    'description' => "Payment of \${$payment->amount} processed",
                    'timestamp' => $payment->created_at,
                    'priority' => 'high',
                    'amount' => $payment->amount,
                ];
            }

            // Sort all activities by timestamp
            usort($activities, function($a, $b) {
                return strtotime($b['timestamp']) - strtotime($a['timestamp']);
            });

            // Limit to requested amount
            $activities = array_slice($activities, 0, $limit);

            return response()->json([
                'status' => 'success',
                'message' => 'Recent activities retrieved successfully',
                'data' => $activities
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching activities: ' . $e->getMessage()
            ], 500);
        }
    }
}
