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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 191)->unique();
            $table->string('password');
            $table->enum('type', ['artisan', 'client', 'admin']);
            $table->string('avatar')->nullable();
            $table->string('location', 200);
            $table->timestamp('joined_date')->useCurrent();
            $table->boolean('is_verified')->default(false);
            $table->string('phone')->nullable();
            $table->timestamp('last_active')->useCurrent();
            $table->text('refresh_token')->nullable();
            $table->string('email_verification_token')->nullable();
            $table->boolean('is_email_verified')->default(false);
            $table->string('password_reset_token')->nullable();
            $table->timestamp('password_reset_expires')->nullable();
            
            // Artisan-specific fields
            $table->json('skills')->nullable();
            $table->integer('experience')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('review_count')->default(0);
            $table->integer('completed_jobs')->default(0);
            $table->decimal('hourly_rate', 10, 2)->nullable();
            $table->boolean('is_available')->default(true);
            $table->text('bio')->nullable();
            $table->json('certifications')->nullable();
            $table->json('portfolio_images')->nullable();
            $table->string('response_time')->default('Within 2 hours');
            $table->string('working_hours')->default('9:00 AM - 6:00 PM');
            $table->integer('service_radius')->default(20);
            $table->json('preferred_categories')->nullable();
            $table->boolean('emergency_service')->default(false);
            $table->boolean('insurance_verified')->default(false);
            
            // Verification documents (JSON)
            $table->json('verification_documents')->nullable();
            
            // Location settings (JSON)
            $table->json('location_settings')->nullable();
            
            // Bank details (JSON)
            $table->json('bank_details')->nullable();
            
            // Client-specific fields
            $table->integer('jobs_posted')->default(0);
            $table->decimal('total_spent', 12, 2)->default(0);
            $table->enum('preferred_payment_method', ['Credit Card', 'Bank Transfer', 'Wallet'])->default('Credit Card');
            $table->enum('business_type', ['individual', 'business'])->default('individual');
            $table->string('company_name')->nullable();
            $table->string('company_registration_number')->nullable();
            $table->string('tax_id')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('email');
            $table->index('type');
            $table->index('location');
            $table->index('is_verified');
            $table->index('last_active');
            $table->index('rating');
            $table->index('hourly_rate');
            $table->index('is_available');
            $table->index('business_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
