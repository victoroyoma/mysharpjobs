<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Job extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'jobs_custom';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'category',
        'budget',
        'location',
        'coordinates',
        'status',
        'client_id',
        'artisan_id',
        'deadline',
        'requirements',
        'applicants',
        'completion_date',
        'rating',
        'review',
        'priority',
        'estimated_duration',
        'materials',
        'safety_requirements',
        'contact_preference',
        'images',
        'milestones',
        'progress_updates',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'coordinates' => 'array',
            'requirements' => 'array',
            'applicants' => 'array',
            'materials' => 'array',
            'safety_requirements' => 'array',
            'images' => 'array',
            'milestones' => 'array',
            'progress_updates' => 'array',
            'budget' => 'decimal:2',
            'deadline' => 'datetime',
            'completion_date' => 'datetime',
        ];
    }

    /**
     * Get the client that posted this job.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Get the artisan assigned to this job.
     */
    public function artisan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'artisan_id');
    }

    /**
     * Get the messages for this job.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Get the payments for this job.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope a query to only include open jobs.
     */
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    /**
     * Scope a query to only include jobs by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to only include jobs by location.
     */
    public function scopeByLocation($query, $location)
    {
        return $query->where('location', 'LIKE', "%{$location}%");
    }

    /**
     * Calculate days until deadline.
     */
    public function getDaysUntilDeadline(): ?int
    {
        if (!$this->deadline) {
            return null;
        }
        
        return now()->diffInDays($this->deadline, false);
    }

    /**
     * Check if job is overdue.
     */
    public function isOverdue(): bool
    {
        if (!$this->deadline) {
            return false;
        }
        
        return now()->isAfter($this->deadline) && $this->status !== 'completed';
    }

    /**
     * Add an applicant to the job.
     */
    public function addApplicant(int $userId): void
    {
        $applicants = $this->applicants ?? [];
        
        if (!in_array($userId, $applicants)) {
            $applicants[] = $userId;
            $this->applicants = $applicants;
            $this->save();
        }
    }

    /**
     * Check if a user has applied to this job.
     */
    public function hasApplicant(int $userId): bool
    {
        return in_array($userId, $this->applicants ?? []);
    }
}
