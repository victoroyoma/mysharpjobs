<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
        'avatar',
        'avatar_updated_at',
        'location',
        'is_verified',
        'phone',
        'last_active',
        'is_email_verified',
        'profile_completed',
        'profile_completed_at',
        'profile_completion_percentage',
        'profile_updated_at',
        'profile_views',
        // Artisan fields
        'skills',
        'specializations',
        'experience',
        'years_experience',
        'rating',
        'review_count',
        'completed_jobs',
        'hourly_rate',
        'is_available',
        'bio',
        'languages',
        'social_links',
        'certifications',
        'certifications_verified',
        'portfolio_images',
        'portfolio_updated_at',
        'response_time',
        'working_hours',
        'service_radius',
        'preferred_categories',
        'emergency_service',
        'insurance_verified',
        'verification_documents',
        'location_settings',
        'bank_details',
        // Client fields
        'jobs_posted',
        'total_spent',
        'preferred_payment_method',
        'business_type',
        'company_name',
        'company_registration_number',
        'tax_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'refresh_token',
        'email_verification_token',
        'password_reset_token',
        'password_reset_expires',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'joined_date' => 'datetime',
            'last_active' => 'datetime',
            'is_verified' => 'boolean',
            'is_email_verified' => 'boolean',
            'password_reset_expires' => 'datetime',
            'avatar_updated_at' => 'datetime',
            'portfolio_updated_at' => 'datetime',
            'profile_updated_at' => 'datetime',
            'skills' => 'array',
            'specializations' => 'array',
            'certifications' => 'array',
            'portfolio_images' => 'array',
            'preferred_categories' => 'array',
            'verification_documents' => 'array',
            'location_settings' => 'array',
            'bank_details' => 'array',
            'languages' => 'array',
            'social_links' => 'array',
            'rating' => 'decimal:2',
            'hourly_rate' => 'decimal:2',
            'total_spent' => 'decimal:2',
            'years_experience' => 'decimal:1',
            'is_available' => 'boolean',
            'emergency_service' => 'boolean',
            'insurance_verified' => 'boolean',
            'certifications_verified' => 'boolean',
            'password' => 'hashed',
        ];
    }

    /**
     * Scope a query to only include artisans.
     */
    public function scopeArtisan($query)
    {
        return $query->where('type', 'artisan');
    }

    /**
     * Scope a query to only include clients.
     */
    public function scopeClient($query)
    {
        return $query->where('type', 'client');
    }

    /**
     * Scope a query to only include verified users.
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope a query to only include available artisans.
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Get the jobs posted by this client.
     */
    public function postedJobs(): HasMany
    {
        return $this->hasMany(Job::class, 'client_id');
    }

    /**
     * Get the jobs assigned to this artisan.
     */
    public function assignedJobs(): HasMany
    {
        return $this->hasMany(Job::class, 'artisan_id');
    }

    /**
     * Get messages sent by this user.
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Get messages received by this user.
     */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'recipient_id');
    }

    /**
     * Get payments made by this user (as client).
     */
    public function paymentsMade(): HasMany
    {
        return $this->hasMany(Payment::class, 'client_id');
    }

    /**
     * Get payments received by this user (as artisan).
     */
    public function paymentsReceived(): HasMany
    {
        return $this->hasMany(Payment::class, 'artisan_id');
    }

    /**
     * Update last active timestamp.
     */
    public function updateLastActive(): void
    {
        $this->last_active = now();
        $this->save();
    }

    /**
     * Check if user is an artisan.
     */
    public function isArtisan(): bool
    {
        return $this->type === 'artisan';
    }

    /**
     * Check if user is a client.
     */
    public function isClient(): bool
    {
        return $this->type === 'client';
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->type === 'admin';
    }

    /**
     * Calculate profile completion percentage based on user type.
     */
    public function calculateProfileCompletion(): int
    {
        if ($this->type === 'artisan') {
            return $this->calculateArtisanProfileCompletion();
        } elseif ($this->type === 'client') {
            return $this->calculateClientProfileCompletion();
        }
        
        return 100; // Admin profiles are always complete
    }

    /**
     * Calculate artisan profile completion percentage.
     */
    private function calculateArtisanProfileCompletion(): int
    {
        $completionPoints = 0;
        
        // Bio (15%)
        if (!empty($this->bio) && strlen($this->bio) >= 100) {
            $completionPoints += 15;
        }
        
        // Skills (15%)
        $skills = json_decode($this->skills, true) ?? [];
        if (count($skills) >= 3) {
            $completionPoints += 15;
        }
        
        // Hourly rate (15%)
        if ($this->hourly_rate && $this->hourly_rate > 0) {
            $completionPoints += 15;
        }
        
        // Portfolio images (20%)
        $portfolio = json_decode($this->portfolio_images, true) ?? [];
        if (count($portfolio) >= 3) {
            $completionPoints += 20;
        }
        
        // Bank details (15%)
        if (!empty($this->bank_details)) {
            $completionPoints += 15;
        }
        
        // Profile picture (10%)
        if (!empty($this->avatar)) {
            $completionPoints += 10;
        }
        
        // Service radius (10%)
        if ($this->service_radius && $this->service_radius > 0) {
            $completionPoints += 10;
        }
        
        return $completionPoints;
    }

    /**
     * Calculate client profile completion percentage.
     */
    private function calculateClientProfileCompletion(): int
    {
        $completionPoints = 0;
        
        // Business type (20%)
        if (!empty($this->business_type)) {
            $completionPoints += 20;
        }
        
        // Preferred payment method (20%)
        if (!empty($this->preferred_payment_method)) {
            $completionPoints += 20;
        }
        
        // Company details (20%)
        if ($this->business_type === 'individual' || !empty($this->company_name)) {
            $completionPoints += 20;
        }
        
        // Profile picture (20%)
        if (!empty($this->avatar)) {
            $completionPoints += 20;
        }
        
        // Location (20%)
        if (!empty($this->location)) {
            $completionPoints += 20;
        }
        
        return $completionPoints;
    }

    /**
     * Mark profile as completed.
     */
    public function markProfileAsCompleted(): void
    {
        $this->profile_completed = true;
        $this->profile_completed_at = now();
        $this->profile_completion_percentage = $this->calculateProfileCompletion();
        $this->save();
    }

    /**
     * Check if profile is complete based on percentage.
     */
    public function hasCompleteProfile(): bool
    {
        return $this->calculateProfileCompletion() >= 100;
    }
}

