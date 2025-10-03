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
        Schema::create('jobs_custom', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->text('description');
            $table->enum('category', [
                'carpentry', 'electrical', 'plumbing', 'painting', 'welding',
                'masonry', 'gardening', 'cleaning', 'automobile', 'tailoring'
            ]);
            $table->decimal('budget', 12, 2);
            $table->string('location', 200);
            $table->json('coordinates')->nullable(); // [latitude, longitude]
            $table->enum('status', ['open', 'in-progress', 'completed', 'cancelled'])->default('open');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('artisan_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('deadline')->nullable();
            $table->json('requirements')->nullable();
            $table->json('applicants')->nullable(); // Array of user IDs
            $table->timestamp('completion_date')->nullable();
            $table->integer('rating')->nullable();
            $table->text('review')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->string('estimated_duration', 100)->nullable();
            $table->json('materials')->nullable();
            $table->json('safety_requirements')->nullable();
            $table->enum('contact_preference', ['phone', 'message', 'email'])->default('message');
            $table->json('images')->nullable();
            $table->json('milestones')->nullable();
            $table->json('progress_updates')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('client_id');
            $table->index('artisan_id');
            $table->index('category');
            $table->index('status');
            $table->index('priority');
            $table->index('location');
            $table->index('created_at');
            $table->index('deadline');
            $table->index('budget');
            $table->index(['category', 'status']);
            $table->index(['location', 'category']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs_custom');
    }
};
