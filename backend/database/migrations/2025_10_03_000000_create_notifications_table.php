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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Notification details
            $table->string('type', 50); // job_application, job_update, payment, message, review, system, verification, dispute
            $table->string('title', 255);
            $table->text('message');
            $table->json('data')->nullable(); // Additional data (job_id, payment_id, etc.)
            
            // Read status
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            
            // Priority and action
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->string('action_url')->nullable();
            $table->string('action_text', 100)->nullable();
            
            // Metadata
            $table->timestamp('expires_at')->nullable();
            $table->json('metadata')->nullable(); // Additional flexible metadata
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('type');
            $table->index('is_read');
            $table->index(['user_id', 'is_read']);
            $table->index(['user_id', 'created_at']);
            $table->index('expires_at');
            $table->index('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
