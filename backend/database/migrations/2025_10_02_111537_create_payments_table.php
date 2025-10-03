<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('jobs_custom')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('artisan_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('NGN');
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded'])->default('pending');
            $table->enum('payment_method', ['paystack', 'flutterwave', 'bank_transfer']);
            $table->string('gateway_reference')->unique();
            $table->json('gateway_response')->nullable();
            $table->string('milestone_id')->nullable();
            $table->string('milestone_description')->nullable();
            $table->enum('escrow_status', ['held', 'released', 'disputed'])->default('held');
            $table->timestamp('escrow_release_date')->nullable();
            $table->json('fees')->nullable(); // {platform, gateway, total}
            $table->enum('dispute_status', ['none', 'raised', 'investigating', 'resolved'])->default('none');
            $table->text('dispute_reason')->nullable();
            $table->timestamp('dispute_date')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('job_id');
            $table->index('client_id');
            $table->index('artisan_id');
            $table->index('status');
            $table->index('gateway_reference');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
