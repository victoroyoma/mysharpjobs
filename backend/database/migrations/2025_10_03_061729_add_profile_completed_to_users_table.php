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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('profile_completed')->default(false)->after('is_email_verified');
            $table->timestamp('profile_completed_at')->nullable()->after('profile_completed');
            $table->tinyInteger('profile_completion_percentage')->default(0)->after('profile_completed_at');
            
            // Add index for faster queries
            $table->index('profile_completed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['profile_completed']);
            $table->dropColumn(['profile_completed', 'profile_completed_at', 'profile_completion_percentage']);
        });
    }
};
