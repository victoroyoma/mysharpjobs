<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\WebhookController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now()->toIso8601String(),
        'service' => 'MySharpJob API',
    ]);
});

// Public routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refreshToken']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Public job routes
Route::prefix('jobs')->group(function () {
    Route::get('/', [JobController::class, 'index']);
    Route::get('/{id}', [JobController::class, 'show']);
});

// Public search routes
Route::prefix('search')->group(function () {
    Route::get('/artisans', [SearchController::class, 'searchArtisans']);
    Route::get('/jobs', [SearchController::class, 'searchJobs']);
});

// Public profile routes
Route::get('/profiles/artisan/{id}', [ProfileController::class, 'showArtisan']);

// Webhook routes (no authentication/CSRF protection)
Route::prefix('webhooks')->group(function () {
    Route::post('/paystack', [WebhookController::class, 'paystackWebhook'])->name('webhook.paystack');
    Route::post('/flutterwave', [WebhookController::class, 'flutterwaveWebhook'])->name('webhook.flutterwave');
});

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/password', [AuthController::class, 'updatePassword']);
    });
    
    // User routes
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });
    
    // Profile routes
    Route::prefix('profiles')->group(function () {
        Route::get('/me', [ProfileController::class, 'getMyProfile']);
        Route::put('/me', [ProfileController::class, 'update']);
        Route::post('/avatar', [ProfileController::class, 'uploadProfilePicture']);
        Route::post('/portfolio', [ProfileController::class, 'uploadPortfolioImages']);
        Route::delete('/portfolio/{index}', [ProfileController::class, 'deletePortfolioImage']);
    });
    
    // Dashboard routes
    Route::get('/dashboard/client', [ProfileController::class, 'getClientDashboard']);
    Route::get('/dashboard/artisan', [ProfileController::class, 'getArtisanDashboard']);
    
    // Job routes
    Route::prefix('jobs')->group(function () {
        Route::post('/', [JobController::class, 'store']);
        Route::put('/{id}', [JobController::class, 'update']);
        Route::delete('/{id}', [JobController::class, 'destroy']);
        Route::post('/{id}/apply', [JobController::class, 'apply']);
        Route::post('/{id}/accept/{artisanId}', [JobController::class, 'acceptApplication']);
        Route::post('/{id}/start', [JobController::class, 'start']);
        Route::post('/{id}/complete', [JobController::class, 'complete']);
        Route::post('/{id}/cancel', [JobController::class, 'cancel']);
        Route::post('/{id}/review', [JobController::class, 'addReview']);
        Route::post('/{id}/milestone', [JobController::class, 'addMilestone']);
        Route::put('/{id}/milestone/{milestoneId}', [JobController::class, 'updateMilestone']);
        Route::post('/{id}/progress', [JobController::class, 'addProgressUpdate']);
        Route::get('/my-jobs', [JobController::class, 'myJobs']);
        Route::get('/my-applications', [JobController::class, 'myApplications']);
    });
    
    // Message routes
    Route::prefix('messages')->group(function () {
        Route::get('/', [MessageController::class, 'index']);
        Route::get('/conversations', [MessageController::class, 'conversations']);
        Route::get('/conversation/{userId}', [MessageController::class, 'conversation']);
        Route::post('/', [MessageController::class, 'store']);
        Route::put('/{id}/read', [MessageController::class, 'markAsRead']);
        Route::delete('/{id}', [MessageController::class, 'destroy']);
        Route::get('/unread-count', [MessageController::class, 'unreadCount']);
    });
    
    // Payment routes
    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::get('/{id}', [PaymentController::class, 'show']);
        Route::post('/initialize', [PaymentController::class, 'initialize']);
        Route::post('/verify/{reference}', [PaymentController::class, 'verify']);
        Route::post('/{id}/release', [PaymentController::class, 'releaseEscrow']);
        Route::post('/{id}/dispute', [PaymentController::class, 'raiseDispute']);
        Route::get('/job/{jobId}', [PaymentController::class, 'jobPayments']);
        Route::get('/config', [PaymentController::class, 'getConfig']);
    });
    
    // Admin routes
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'getDashboardStats']);
        Route::get('/users', [AdminController::class, 'getAllUsers']);
        Route::get('/jobs', [AdminController::class, 'getAllJobs']);
        Route::get('/disputes', [AdminController::class, 'getDisputes']);
        Route::post('/disputes/{id}/resolve', [AdminController::class, 'resolveDispute']);
        Route::put('/users/{id}/suspend', [AdminController::class, 'suspendUser']);
        Route::put('/users/{id}/unsuspend', [AdminController::class, 'unsuspendUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/verifications/pending', [AdminController::class, 'getPendingVerifications']);
        Route::post('/verifications/{id}/approve', [AdminController::class, 'approveVerification']);
        Route::post('/verifications/{id}/reject', [AdminController::class, 'rejectVerification']);
        Route::get('/analytics', [AdminController::class, 'getAnalytics']);
    });
});
