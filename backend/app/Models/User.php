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
        'location',
        'is_verified',
        'phone',
        'last_active',
        'is_email_verified',
        // Artisan fields
        'skills',
        'experience',
        'rating',
        'review_count',
        'completed_jobs',
        'hourly_rate',
        'is_available',
        'bio',
        'certifications',
        'portfolio_images',
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
            'skills' => 'array',
            'certifications' => 'array',
            'portfolio_images' => 'array',
            'preferred_categories' => 'array',
            'verification_documents' => 'array',
            'location_settings' => 'array',
            'bank_details' => 'array',
            'rating' => 'decimal:2',
            'hourly_rate' => 'decimal:2',
            'total_spent' => 'decimal:2',
            'is_available' => 'boolean',
            'emergency_service' => 'boolean',
            'insurance_verified' => 'boolean',
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
}
