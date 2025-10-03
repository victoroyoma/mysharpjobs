<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class JobController extends Controller
{
    /**
     * Get all jobs (with filters)
     */
    public function index(Request $request)
    {
        try {
            $query = Job::with(['client', 'artisan']);

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            if ($request->has('location')) {
                $query->where('location', 'LIKE', "%{$request->location}%");
            }

            if ($request->has('minBudget')) {
                $query->where('budget', '>=', $request->minBudget);
            }

            if ($request->has('maxBudget')) {
                $query->where('budget', '<=', $request->maxBudget);
            }

            if ($request->has('priority')) {
                $query->where('priority', $request->priority);
            }

            // Sorting
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('perPage', 15);
            $jobs = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'data' => $jobs
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch jobs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single job by ID
     */
    public function show($id)
    {
        try {
            $job = Job::with(['client', 'artisan'])->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => ['job' => $job]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Job not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create new job
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:5|max:200',
            'description' => 'required|string|min:10|max:2000',
            'category' => 'required|in:carpentry,electrical,plumbing,painting,welding,masonry,gardening,cleaning,automobile,tailoring',
            'budget' => 'required|numeric|min:1000',
            'location' => 'required|string|max:200',
            'deadline' => 'nullable|date|after:today',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'requirements' => 'nullable|array',
            'materials' => 'nullable|array',
            'images' => 'nullable|array',
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

            // Only clients can create jobs
            if (!$user->isClient()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only clients can create jobs'
                ], 403);
            }

            $job = Job::create([
                'title' => $request->title,
                'description' => $request->description,
                'category' => $request->category,
                'budget' => $request->budget,
                'location' => $request->location,
                'client_id' => $user->id,
                'deadline' => $request->deadline,
                'priority' => $request->priority ?? 'medium',
                'requirements' => $request->requirements ?? [],
                'materials' => $request->materials ?? [],
                'images' => $request->images ?? [],
                'status' => 'open',
            ]);

            // Update client's jobs_posted count
            $user->increment('jobs_posted');

            return response()->json([
                'status' => 'success',
                'message' => 'Job created successfully',
                'data' => ['job' => $job]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create job',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update job
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|min:5|max:200',
            'description' => 'nullable|string|min:10|max:2000',
            'budget' => 'nullable|numeric|min:1000',
            'deadline' => 'nullable|date',
            'priority' => 'nullable|in:low,medium,high,urgent',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only job owner can update
            if ($job->client_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $job->update($request->only([
                'title', 'description', 'budget', 'deadline', 'priority',
                'requirements', 'materials', 'images'
            ]));

            return response()->json([
                'status' => 'success',
                'message' => 'Job updated successfully',
                'data' => ['job' => $job]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update job',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete job
     */
    public function destroy(Request $request, $id)
    {
        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only job owner can delete
            if ($job->client_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $job->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Job deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete job',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Apply for job
     */
    public function apply(Request $request, $id)
    {
        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only artisans can apply
            if (!$user->isArtisan()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only artisans can apply for jobs'
                ], 403);
            }

            // Check if already applied
            if ($job->hasApplicant($user->id)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You have already applied for this job'
                ], 400);
            }

            // Add applicant
            $job->addApplicant($user->id);

            return response()->json([
                'status' => 'success',
                'message' => 'Application submitted successfully',
                'data' => ['job' => $job]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to apply for job',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Accept application
     */
    public function acceptApplication(Request $request, $id, $artisanId)
    {
        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only job owner can accept
            if ($job->client_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Check if artisan applied
            if (!$job->hasApplicant($artisanId)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Artisan has not applied for this job'
                ], 400);
            }

            // Assign artisan and update status
            $job->artisan_id = $artisanId;
            $job->status = 'in-progress';
            $job->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Application accepted successfully',
                'data' => ['job' => $job]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to accept application',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Start job
     */
    public function start(Request $request, $id)
    {
        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only assigned artisan can start
            if ($job->artisan_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $job->status = 'in-progress';
            $job->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Job started successfully',
                'data' => ['job' => $job]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to start job',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete job
     */
    public function complete(Request $request, $id)
    {
        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only client can mark as complete
            if ($job->client_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $job->status = 'completed';
            $job->completion_date = now();
            $job->save();

            // Update artisan's completed jobs count
            if ($job->artisan) {
                $job->artisan->increment('completed_jobs');
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Job completed successfully',
                'data' => ['job' => $job]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to complete job',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel job
     */
    public function cancel(Request $request, $id)
    {
        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only client can cancel
            if ($job->client_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $job->status = 'cancelled';
            $job->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Job cancelled successfully',
                'data' => ['job' => $job]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to cancel job',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add review
     */
    public function addReview(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only client can review
            if ($job->client_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Job must be completed
            if ($job->status !== 'completed') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Can only review completed jobs'
                ], 400);
            }

            $job->rating = $request->rating;
            $job->review = $request->review;
            $job->save();

            // Update artisan's rating
            if ($job->artisan) {
                $artisan = $job->artisan;
                $totalRating = ($artisan->rating * $artisan->review_count) + $request->rating;
                $artisan->review_count += 1;
                $artisan->rating = $totalRating / $artisan->review_count;
                $artisan->save();
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Review added successfully',
                'data' => ['job' => $job]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to add review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add milestone
     */
    public function addMilestone(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'amount' => 'required|numeric|min:0',
            'dueDate' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only client can add milestones
            if ($job->client_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $milestones = $job->milestones ?? [];
            $milestones[] = [
                'title' => $request->title,
                'description' => $request->description,
                'amount' => $request->amount,
                'status' => 'pending',
                'dueDate' => $request->dueDate,
            ];

            $job->milestones = $milestones;
            $job->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Milestone added successfully',
                'data' => ['job' => $job]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to add milestone',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update milestone
     */
    public function updateMilestone(Request $request, $id, $milestoneId)
    {
        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only client or assigned artisan can update
            if ($job->client_id !== $user->id && $job->artisan_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $milestones = $job->milestones ?? [];
            if (isset($milestones[$milestoneId])) {
                if ($request->has('status')) {
                    $milestones[$milestoneId]['status'] = $request->status;
                }
                if ($request->status === 'completed') {
                    $milestones[$milestoneId]['completedAt'] = now()->toIso8601String();
                }

                $job->milestones = $milestones;
                $job->save();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Milestone updated successfully',
                    'data' => ['job' => $job]
                ], 200);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Milestone not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update milestone',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add progress update
     */
    public function addProgressUpdate(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:500',
            'images' => 'nullable|array',
            'type' => 'nullable|in:update,milestone,completion',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only assigned artisan can add progress
            if ($job->artisan_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $progressUpdates = $job->progress_updates ?? [];
            $progressUpdates[] = [
                'message' => $request->message,
                'images' => $request->images ?? [],
                'timestamp' => now()->toIso8601String(),
                'type' => $request->type ?? 'update',
            ];

            $job->progress_updates = $progressUpdates;
            $job->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Progress update added successfully',
                'data' => ['job' => $job]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to add progress update',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's jobs
     */
    public function myJobs(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->isClient()) {
                $jobs = Job::where('client_id', $user->id)
                    ->with(['artisan'])
                    ->orderBy('created_at', 'desc')
                    ->paginate(15);
            } else {
                $jobs = Job::where('artisan_id', $user->id)
                    ->with(['client'])
                    ->orderBy('created_at', 'desc')
                    ->paginate(15);
            }

            return response()->json([
                'status' => 'success',
                'data' => $jobs
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch jobs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get artisan's job applications
     */
    public function myApplications(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user->isArtisan()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only artisans can view applications'
                ], 403);
            }

            $jobs = Job::whereJsonContains('applicants', $user->id)
                ->with(['client'])
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            return response()->json([
                'status' => 'success',
                'data' => $jobs
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch applications',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
