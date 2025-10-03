<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_id',
        'client_id',
        'artisan_id',
        'amount',
        'currency',
        'status',
        'payment_method',
        'gateway_reference',
        'gateway_response',
        'milestone_id',
        'milestone_description',
        'escrow_status',
        'escrow_release_date',
        'fees',
        'dispute_status',
        'dispute_reason',
        'dispute_date',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'gateway_response' => 'array',
            'fees' => 'array',
            'metadata' => 'array',
            'escrow_release_date' => 'datetime',
            'dispute_date' => 'datetime',
        ];
    }

    /**
     * Get the job related to this payment.
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    /**
     * Get the client who made the payment.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Get the artisan receiving the payment.
     */
    public function artisan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'artisan_id');
    }

    /**
     * Scope a query to only include completed payments.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include pending payments.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Calculate net amount after fees.
     */
    public function getNetAmountAttribute(): float
    {
        $fees = $this->fees ?? [];
        $totalFees = $fees['total'] ?? 0;
        
        return $this->amount - $totalFees;
    }

    /**
     * Check if payment is in escrow.
     */
    public function isInEscrow(): bool
    {
        return $this->escrow_status === 'held';
    }

    /**
     * Release payment from escrow.
     */
    public function releaseFromEscrow(): void
    {
        $this->escrow_status = 'released';
        $this->escrow_release_date = now();
        $this->status = 'completed';
        $this->save();
    }

    /**
     * Raise a dispute for the payment.
     */
    public function raiseDispute(string $reason): void
    {
        $this->dispute_status = 'raised';
        $this->dispute_reason = $reason;
        $this->dispute_date = now();
        $this->escrow_status = 'disputed';
        $this->save();
    }
}
