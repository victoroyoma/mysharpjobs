<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration adds additional fields needed for the editable artisan profile
     * including enhanced portfolio management and certification tracking.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add avatar_updated_at timestamp to track profile picture changes
            if (!Schema::hasColumn('users', 'avatar_updated_at')) {
                $table->timestamp('avatar_updated_at')->nullable()->after('avatar');
            }
            
            // Add portfolio_updated_at timestamp
            if (!Schema::hasColumn('users', 'portfolio_updated_at')) {
                $table->timestamp('portfolio_updated_at')->nullable()->after('portfolio_images');
            }
            
            // Add certifications_verified flag
            if (!Schema::hasColumn('users', 'certifications_verified')) {
                $table->boolean('certifications_verified')->default(false)->after('certifications');
            }
            
            // Add profile views counter
            if (!Schema::hasColumn('users', 'profile_views')) {
                $table->integer('profile_views')->default(0)->after('review_count');
            }
            
            // Add profile updated timestamp
            if (!Schema::hasColumn('users', 'profile_updated_at')) {
                $table->timestamp('profile_updated_at')->nullable()->after('updated_at');
            }
            
            // Add years_of_experience as decimal for more precision
            if (!Schema::hasColumn('users', 'years_experience')) {
                $table->decimal('years_experience', 4, 1)->nullable()->after('experience');
            }
            
            // Add specializations JSON field (more structured than skills)
            if (!Schema::hasColumn('users', 'specializations')) {
                $table->json('specializations')->nullable()->after('skills');
            }
            
            // Add languages spoken
            if (!Schema::hasColumn('users', 'languages')) {
                $table->json('languages')->nullable()->after('bio');
            }
            
            // Add social media links
            if (!Schema::hasColumn('users', 'social_links')) {
                $table->json('social_links')->nullable()->after('languages');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar_updated_at',
                'portfolio_updated_at',
                'certifications_verified',
                'profile_views',
                'profile_updated_at',
                'years_experience',
                'specializations',
                'languages',
                'social_links',
            ]);
        });
    }
};
