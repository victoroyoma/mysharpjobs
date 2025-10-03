<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Job;

class SearchController extends Controller
{
    /**
     * Search jobs with advanced filters
     */
    public function searchJobs(Request $request)
    {
        try {
            $query = Job::query();

            // Keyword search
            if ($request->has('keyword')) {
                $keyword = $request->keyword;
                $query->where(function($q) use ($keyword) {
                    $q->where('title', 'LIKE', "%{$keyword}%")
                      ->orWhere('description', 'LIKE', "%{$keyword}%");
                });
            }

            // Category filter
            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            // Status filter
            if ($request->has('status')) {
                $query->where('status', $request->status);
            } else {
                // Default to open jobs
                $query->where('status', 'open');
            }

            // Budget range filter
            if ($request->has('min_budget')) {
                $query->where('budget', '>=', $request->min_budget);
            }
            if ($request->has('max_budget')) {
                $query->where('budget', '<=', $request->max_budget);
            }

            // Priority filter
            if ($request->has('priority')) {
                $query->where('priority', $request->priority);
            }

            // Location-based search
            if ($request->has('lat') && $request->has('lng')) {
                $lat = $request->lat;
                $lng = $request->lng;
                $radius = $request->get('radius', 10); // Default 10km

                // Using Haversine formula for distance calculation
                $query->whereRaw("
                    (6371 * acos(
                        cos(radians(?)) * 
                        cos(radians(JSON_EXTRACT(location, '$.coordinates[0]'))) * 
                        cos(radians(JSON_EXTRACT(location, '$.coordinates[1]')) - radians(?)) + 
                        sin(radians(?)) * 
                        sin(radians(JSON_EXTRACT(location, '$.coordinates[0]')))
                    )) <= ?
                ", [$lat, $lng, $lat, $radius]);
            }

            // Skills filter (search in requirements JSON)
            if ($request->has('skills')) {
                $skills = is_array($request->skills) ? $request->skills : explode(',', $request->skills);
                foreach ($skills as $skill) {
                    $query->orWhereJsonContains('requirements', ['skill' => $skill]);
                }
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            
            switch ($sortBy) {
                case 'budget':
                    $query->orderBy('budget', $sortOrder);
                    break;
                case 'priority':
                    $query->orderByRaw("FIELD(priority, 'urgent', 'high', 'medium', 'low')");
                    break;
                case 'deadline':
                    $query->orderBy('deadline', $sortOrder);
                    break;
                default:
                    $query->orderBy('created_at', $sortOrder);
            }

            // Pagination
            $perPage = $request->get('limit', 20);
            $jobs = $query->with(['client:id,name,avatar,rating'])->paginate($perPage);

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
                'message' => 'Error searching jobs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search artisans with advanced filters
     */
    public function searchArtisans(Request $request)
    {
        try {
            $query = User::where('type', 'artisan');

            // Keyword search
            if ($request->has('keyword')) {
                $keyword = $request->keyword;
                $query->where(function($q) use ($keyword) {
                    $q->where('name', 'LIKE', "%{$keyword}%")
                      ->orWhere('bio', 'LIKE', "%{$keyword}%");
                });
            }

            // Skills filter
            if ($request->has('skills')) {
                $skills = is_array($request->skills) ? $request->skills : explode(',', $request->skills);
                foreach ($skills as $skill) {
                    $query->whereJsonContains('skills', $skill);
                }
            }

            // Rating filter
            if ($request->has('min_rating')) {
                $query->where('rating', '>=', $request->min_rating);
            }

            // Availability filter
            if ($request->has('availability')) {
                if ($request->availability === 'available') {
                    $query->where('is_available', true);
                }
            }

            // Verification filter
            if ($request->has('verification')) {
                if ($request->verification === 'verified') {
                    $query->where('is_verified', true);
                }
            }

            // Experience range
            if ($request->has('min_experience')) {
                $query->where('experience', '>=', $request->min_experience);
            }

            // Hourly rate range
            if ($request->has('min_rate')) {
                $query->where('hourly_rate', '>=', $request->min_rate);
            }
            if ($request->has('max_rate')) {
                $query->where('hourly_rate', '<=', $request->max_rate);
            }

            // Location-based search
            if ($request->has('lat') && $request->has('lng')) {
                $lat = $request->lat;
                $lng = $request->lng;
                $radius = $request->get('radius', 10); // Default 10km

                // Using Haversine formula
                $query->whereRaw("
                    (6371 * acos(
                        cos(radians(?)) * 
                        cos(radians(JSON_EXTRACT(location, '$.coordinates[0]'))) * 
                        cos(radians(JSON_EXTRACT(location, '$.coordinates[1]')) - radians(?)) + 
                        sin(radians(?)) * 
                        sin(radians(JSON_EXTRACT(location, '$.coordinates[0]')))
                    )) <= ?
                ", [$lat, $lng, $lat, $radius]);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'rating');
            $sortOrder = $request->get('sort_order', 'desc');
            
            switch ($sortBy) {
                case 'rating':
                    $query->orderBy('rating', $sortOrder);
                    break;
                case 'experience':
                    $query->orderBy('experience', $sortOrder);
                    break;
                case 'hourly_rate':
                    $query->orderBy('hourly_rate', $sortOrder);
                    break;
                case 'jobs_completed':
                    $query->orderBy('jobs_completed', $sortOrder);
                    break;
                default:
                    $query->orderBy('created_at', $sortOrder);
            }

            // Pagination
            $perPage = $request->get('limit', 20);
            $artisans = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Artisans retrieved successfully',
                'data' => $artisans->items(),
                'pagination' => [
                    'total' => $artisans->total(),
                    'per_page' => $artisans->perPage(),
                    'current_page' => $artisans->currentPage(),
                    'last_page' => $artisans->lastPage(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error searching artisans: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get job-artisan matches (AI-powered recommendation)
     */
    public function getJobMatches(Request $request, $jobId)
    {
        try {
            $job = Job::find($jobId);

            if (!$job) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Job not found'
                ], 404);
            }

            $limit = $request->get('limit', 10);

            // Build matching query
            $query = User::where('type', 'artisan')
                ->where('is_available', true);

            // Match by skills (if requirements contain skills)
            if ($job->requirements && is_array($job->requirements)) {
                $requiredSkills = array_column(
                    array_filter($job->requirements, function($req) {
                        return isset($req['skill']);
                    }),
                    'skill'
                );

                if (!empty($requiredSkills)) {
                    $query->where(function($q) use ($requiredSkills) {
                        foreach ($requiredSkills as $skill) {
                            $q->orWhereJsonContains('skills', $skill);
                        }
                    });
                }
            }

            // Match by location (within job's service area)
            if ($job->location && isset($job->location['coordinates'])) {
                $lat = $job->location['coordinates'][0];
                $lng = $job->location['coordinates'][1];
                $radius = 50; // 50km radius

                $query->whereRaw("
                    (6371 * acos(
                        cos(radians(?)) * 
                        cos(radians(JSON_EXTRACT(location, '$.coordinates[0]'))) * 
                        cos(radians(JSON_EXTRACT(location, '$.coordinates[1]')) - radians(?)) + 
                        sin(radians(?)) * 
                        sin(radians(JSON_EXTRACT(location, '$.coordinates[0]')))
                    )) <= ?
                ", [$lat, $lng, $lat, $radius]);
            }

            // Order by rating and experience
            $matches = $query->orderBy('rating', 'desc')
                ->orderBy('jobs_completed', 'desc')
                ->limit($limit)
                ->get();

            // Calculate match score for each artisan
            $matchesWithScore = $matches->map(function($artisan) use ($job) {
                $score = 0;
                
                // Rating contribution (0-40 points)
                $score += ($artisan->rating / 5) * 40;
                
                // Experience contribution (0-30 points)
                $score += min(($artisan->experience / 20) * 30, 30);
                
                // Jobs completed contribution (0-20 points)
                $score += min(($artisan->jobs_completed / 50) * 20, 20);
                
                // Verification bonus (10 points)
                if ($artisan->is_verified) {
                    $score += 10;
                }

                return [
                    'artisan' => $artisan,
                    'match_score' => round($score, 2),
                    'match_percentage' => round($score, 0) . '%'
                ];
            });

            // Sort by match score
            $matchesWithScore = $matchesWithScore->sortByDesc('match_score')->values();

            return response()->json([
                'status' => 'success',
                'message' => 'Job matches retrieved successfully',
                'data' => [
                    'job' => $job,
                    'matches' => $matchesWithScore
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error getting job matches: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get search suggestions
     */
    public function getSearchSuggestions(Request $request)
    {
        try {
            $query = $request->get('query', '');
            $type = $request->get('type', 'jobs');

            if (empty($query)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Query parameter is required'
                ], 400);
            }

            $suggestions = [];

            if ($type === 'jobs') {
                // Get job title suggestions
                $jobTitles = Job::where('title', 'LIKE', "%{$query}%")
                    ->where('status', 'open')
                    ->select('title')
                    ->distinct()
                    ->limit(5)
                    ->pluck('title')
                    ->toArray();

                $suggestions = array_merge($suggestions, $jobTitles);

            } elseif ($type === 'artisans') {
                // Get artisan name suggestions
                $artisanNames = User::where('type', 'artisan')
                    ->where('name', 'LIKE', "%{$query}%")
                    ->select('name')
                    ->distinct()
                    ->limit(5)
                    ->pluck('name')
                    ->toArray();

                $suggestions = array_merge($suggestions, $artisanNames);
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'suggestions' => array_unique($suggestions)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error getting suggestions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get featured artisans (top-rated, verified)
     */
    public function getFeaturedArtisans(Request $request)
    {
        try {
            $limit = $request->get('limit', 10);

            $artisans = User::where('type', 'artisan')
                ->where('is_verified', true)
                ->where('rating', '>=', 4.0)
                ->orderBy('rating', 'desc')
                ->orderBy('jobs_completed', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Featured artisans retrieved successfully',
                'data' => $artisans
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching featured artisans: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get popular jobs (most applicants, recent)
     */
    public function getPopularJobs(Request $request)
    {
        try {
            $limit = $request->get('limit', 10);

            $jobs = Job::where('status', 'open')
                ->withCount(['applicants' => function($query) {
                    // This would require a proper applicants relationship
                    // For now, we'll use a raw query to count JSON array length
                }])
                ->with(['client:id,name,avatar'])
                ->orderByRaw('JSON_LENGTH(COALESCE(applicants, "[]")) DESC')
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Popular jobs retrieved successfully',
                'data' => $jobs
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching popular jobs: ' . $e->getMessage()
            ], 500);
        }
    }
}
