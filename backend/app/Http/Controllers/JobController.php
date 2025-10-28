<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class JobController extends Controller
{
    // A trait could be used here for standardized API responses
    protected function sendResponse($data, $message, $status = 200)
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], $status);
    }

    protected function sendError($message, $errors = [], $status = 400)
    {
        $response = [
            'status' => 'error',
            'message' => $message,
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }
    
    /**
     * Get all jobs (with filters)
     */
    public function index(Request $request)
    {
        try {
            $query = Job::with(['client', 'artisan'])->where('status', 'open');

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
            return $this->sendError('Failed to create job', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Apply for a job.
     */
    public function apply(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'proposal' => 'required|string|min:20|max:5000',
            'amount' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        try {
            $user = $request->user();
            $job = Job::findOrFail($id);

            if (!$user->isArtisan()) {
                return $this->sendError('Only artisans can apply for jobs.', [], 403);
            }

            if ($job->status !== 'open') {
                return $this->sendError('This job is no longer open for applications.', [], 400);
            }

            // Check if artisan has already applied
            $applications = $job->applications ?? [];
            foreach ($applications as $application) {
                if ($application['artisan_id'] === $user->id) {
                    return $this->sendError('You have already applied for this job.', [], 409);
                }
            }

            $applications[] = [
                'artisan_id' => $user->id,
                'proposal' => $request->proposal,
                'amount' => $request->amount,
                'status' => 'pending',
                'applied_at' => now()->toIso8601String(),
            ];

            $job->applications = $applications;
            $job->save();
            
            // Log activity
            ActivityLog::create([
                'user_id' => $user->id,
                'activity_type' => 'job_application',
                'description' => "Artisan {$user->name} applied for job: {$job->title}",
                'resource_id' => $job->id,
                'resource_type' => 'Job',
            ]);

            return $this->sendResponse(['job' => $job], 'Application submitted successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Failed to apply for job.', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get all applications for a specific job
     */
    public function getApplications(Request $request, $id)
    {
        try {
            $user = $request->user();
            $job = Job::findOrFail($id);

            // Only the client who posted the job can see applications
            if ($job->client_id !== $user->id) {
                return $this->sendError('You are not authorized to view applications for this job.', [], 403);
            }

            $applicationData = $job->applications ?? [];
            $artisanIds = array_column($applicationData, 'artisan_id');
            
            $artisans = User::whereIn('id', $artisanIds)->get()->keyBy('id');

            $applications = array_map(function($app) use ($artisans) {
                $artisan = $artisans->get($app['artisan_id']);
                if ($artisan) {
                    // Return a read-only profile view
                    $app['artisan'] = [
                        'id' => $artisan->id,
                        'name' => $artisan->name,
                        'email' => $artisan->email,
                        'avatar' => $artisan->avatar,
                        'role' => $artisan->role,
                        'location' => $artisan->location,
                        'skills' => $artisan->skills,
                        'bio' => $artisan->bio,
                        'rating' => $artisan->rating,
                        'review_count' => $artisan->review_count,
                        'completed_jobs' => $artisan->completed_jobs,
                    ];
                }
                return $app;
            }, $applicationData);

            return $this->sendResponse(['applications' => $applications], 'Applications retrieved successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve applications.', ['error' => $e->getMessage()], 500);
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
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only job owner can update
            if ($job->client_id !== $user->id) {
                return $this->sendError('Unauthorized', [], 403);
            }

            $job->update($request->only([
                'title', 'description', 'budget', 'deadline', 'priority',
                'requirements', 'materials', 'images'
            ]));

            return $this->sendResponse(['job' => $job], 'Job updated successfully');

        } catch (\Exception $e) {
            return $this->sendError('Failed to update job', ['error' => $e->getMessage()], 500);
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
                return $this->sendError('Unauthorized', [], 403);
            }

            $job->delete();

            return $this->sendResponse(null, 'Job deleted successfully');

        } catch (\Exception $e) {
            return $this->sendError('Failed to delete job', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Accept an artisan's application for a job
     */
    public function acceptApplication(Request $request, $id, $artisanId)
    {
        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only the client who posted the job can accept applications
            if ($job->client_id !== $user->id) {
                return $this->sendError('You are not authorized to accept applications for this job.', [], 403);
            }

            if ($job->status !== 'open') {
                return $this->sendError('This job is no longer open for applications.', [], 400);
            }

            $applications = $job->applications ?? [];
            $applicationFound = false;
            foreach ($applications as &$application) {
                if ($application['artisan_id'] == $artisanId) {
                    $application['status'] = 'accepted';
                    $applicationFound = true;
                } else {
                    $application['status'] = 'rejected'; // Reject other applications
                }
            }

            if (!$applicationFound) {
                return $this->sendError('This artisan has not applied for the job.', [], 404);
            }

            $job->applications = $applications;
            $job->artisan_id = $artisanId; // Assign the artisan to the job
            $job->status = 'in-progress'; // Update job status
            $job->save();

            // Log activity
            ActivityLog::create([
                'user_id' => $user->id,
                'activity_type' => 'application_accepted',
                'description' => "Client {$user->name} accepted application for job: {$job->title}",
                'resource_id' => $job->id,
                'resource_type' => 'Job',
            ]);

            return $this->sendResponse(['job' => $job], 'Application accepted successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Failed to accept application.', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Complete a job
     */
    public function complete(Request $request, $id)
    {
        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only the client who posted the job can mark it as complete
            if ($job->client_id !== $user->id) {
                return $this->sendError('You are not authorized to complete this job.', [], 403);
            }

            if ($job->status !== 'in-progress') {
                return $this->sendError('This job cannot be completed from its current state.', [], 400);
            }

            $job->status = 'completed';
            $job->completion_date = now();
            $job->save();

            // Update artisan's completed jobs count
            if ($job->artisan) {
                $job->artisan->increment('completed_jobs');
            }
            
            // Log activity
            ActivityLog::create([
                'user_id' => $user->id,
                'activity_type' => 'job_completed',
                'description' => "Job '{$job->title}' was marked as completed.",
                'resource_id' => $job->id,
                'resource_type' => 'Job',
            ]);

            return $this->sendResponse(['job' => $job], 'Job marked as completed.');

        } catch (\Exception $e) {
            return $this->sendError('Failed to complete job.', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Cancel a job
     */
    public function cancel(Request $request, $id)
    {
        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only the client who posted the job can cancel it
            if ($job->client_id !== $user->id) {
                return $this->sendError('You are not authorized to cancel this job.', [], 403);
            }

            $job->status = 'cancelled';
            $job->save();
            
            // Log activity
            ActivityLog::create([
                'user_id' => $user->id,
                'activity_type' => 'job_cancelled',
                'description' => "Job '{$job->title}' was cancelled.",
                'resource_id' => $job->id,
                'resource_type' => 'Job',
            ]);

            return $this->sendResponse(['job' => $job], 'Job has been cancelled.');

        } catch (\Exception $e) {
            return $this->sendError('Failed to cancel job.', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Add a review for a completed job
     */
    public function addReview(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'required|string|min:10|max:2000',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        try {
            $job = Job::findOrFail($id);
            $user = $request->user();

            // Only the client who posted the job can leave a review
            if ($job->client_id !== $user->id) {
                return $this->sendError('You are not authorized to review this job.', [], 403);
            }

            if ($job->status !== 'completed') {
                return $this->sendError('You can only review completed jobs.', [], 400);
            }

            $job->rating = $request->rating;
            $job->review = $request->review;
            $job->save();

            // Update the artisan's average rating
            if ($job->artisan) {
                $artisan = $job->artisan;
                $newReviewCount = $artisan->review_count + 1;
                $newTotalRating = ($artisan->rating * $artisan->review_count) + $request->rating;
                
                $artisan->review_count = $newReviewCount;
                $artisan->rating = $newTotalRating / $newReviewCount;
                $artisan->save();
            }

            return $this->sendResponse(['job' => $job], 'Thank you for your review.');

        } catch (\Exception $e) {
            return $this->sendError('Failed to add review.', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get jobs posted by the authenticated client
     */
    public function myJobs(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user->isClient()) {
                return $this->sendError('You are not authorized to view this page.', [], 403);
            }

            $jobs = Job::where('client_id', $user->id)
                ->with(['artisan'])
                ->orderBy('created_at', 'desc')
                ->get();
            
            // Manually count applications for each job
            $jobs->each(function ($job) {
                $job->applications_count = count($job->applications ?? []);
            });

            return $this->sendResponse(['jobs' => $jobs], 'Your jobs retrieved successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve your jobs.', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get jobs the authenticated artisan has applied for
     */
    public function myApplications(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user->isArtisan()) {
                return $this->sendError('You are not authorized to view this page.', [], 403);
            }

            // This is inefficient for large datasets. A dedicated 'applications' table would be better.
            $jobs = Job::whereJsonContains('applications', [['artisan_id' => $user->id]])
                ->with(['client'])
                ->get();
            
            // Add application details to each job object
            $jobs->each(function ($job) use ($user) {
                $application = collect($job->applications)->firstWhere('artisan_id', $user->id);
                $job->my_application = $application;
            });

            return $this->sendResponse(['applications' => $jobs], 'Your applications retrieved successfully.');

        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve your applications.', ['error' => $e->getMessage()], 500);
        }
    }
}
