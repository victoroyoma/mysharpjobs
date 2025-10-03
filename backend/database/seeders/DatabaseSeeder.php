<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User with full CRUD rights
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@mysharpjobs.ng',
            'password' => Hash::make('Admin@123'),
            'type' => 'admin',
            'location' => 'Warri, Delta State, Nigeria',
            'phone' => '+2348012345678',
            'is_verified' => true,
            'is_email_verified' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff',
            'bio' => 'System Administrator with full access to all platform features and user management capabilities.',
            'last_active' => now(),
        ]);

        $this->command->info('✅ Admin user created: admin@mysharpjobs.ng (Password: Admin@123)');

        // Create Artisan User
        User::create([
            'name' => 'John Carpenter',
            'email' => 'artisan@mysharpjobs.ng',
            'password' => Hash::make('Artisan@123'),
            'type' => 'artisan',
            'location' => 'Warri, Delta State, Nigeria',
            'phone' => '+2348023456789',
            'is_verified' => true,
            'is_email_verified' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=John+Carpenter&background=10b981&color=fff',
            'bio' => 'Professional carpenter with 8+ years of experience in custom furniture, cabinet installation, and woodworking. Specialized in residential and commercial projects.',
            'skills' => [
                'Carpentry',
                'Cabinet Installation',
                'Custom Furniture',
                'Woodworking',
                'Door & Window Installation',
                'Deck Building',
            ],
            'experience' => 8,
            'rating' => 4.85,
            'review_count' => 127,
            'completed_jobs' => 145,
            'hourly_rate' => 5000.00,
            'is_available' => true,
            'certifications' => [
                'Certified Professional Carpenter',
                'Safety Training Certificate',
                'Advanced Woodworking Diploma',
            ],
            'portfolio_images' => [
                'https://images.unsplash.com/photo-1504148455328-c376907d081c',
                'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d',
                'https://images.unsplash.com/photo-1615529328331-f8917597711f',
            ],
            'response_time' => 'Within 1 hour',
            'working_hours' => '8:00 AM - 6:00 PM',
            'service_radius' => 25,
            'preferred_categories' => ['carpentry', 'installation', 'repair'],
            'emergency_service' => true,
            'insurance_verified' => true,
            'verification_documents' => [
                'government_id' => 'verified',
                'professional_license' => 'verified',
                'insurance_certificate' => 'verified',
            ],
            'location_settings' => [
                'enable_tracking' => true,
                'share_location' => true,
                'current_latitude' => 5.5167,
                'current_longitude' => 5.75,
            ],
            'bank_details' => [
                'bank_name' => 'Access Bank',
                'account_number' => '0123456789',
                'account_name' => 'John Carpenter',
            ],
            'last_active' => now(),
        ]);

        $this->command->info('✅ Artisan user created: artisan@mysharpjobs.ng (Password: Artisan@123)');

        // Create Client User
        User::create([
            'name' => 'Sarah Johnson',
            'email' => 'client@mysharpjobs.ng',
            'password' => Hash::make('Client@123'),
            'type' => 'client',
            'location' => 'Warri, Delta State, Nigeria',
            'phone' => '+2348034567890',
            'is_verified' => true,
            'is_email_verified' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=f59e0b&color=fff',
            'bio' => 'Homeowner and property manager looking for reliable artisans for home improvement and maintenance projects.',
            'jobs_posted' => 23,
            'total_spent' => 450000.00,
            'preferred_payment_method' => 'Credit Card',
            'business_type' => 'individual',
            'company_name' => null,
            'company_registration_number' => null,
            'tax_id' => null,
            'last_active' => now(),
        ]);

        $this->command->info('✅ Client user created: client@mysharpjobs.ng (Password: Client@123)');

        // Create additional sample users
        $this->createAdditionalUsers();

        $this->command->info('');
        $this->command->info('═══════════════════════════════════════════════════════════');
        $this->command->info('🎉 Database seeding completed successfully!');
        $this->command->info('═══════════════════════════════════════════════════════════');
        $this->command->info('');
        $this->command->info('📋 Login Credentials:');
        $this->command->info('');
        $this->command->info('👤 Admin User:');
        $this->command->info('   Email: admin@mysharpjobs.ng');
        $this->command->info('   Password: Admin@123');
        $this->command->info('   Access: Full CRUD rights & system administration');
        $this->command->info('');
        $this->command->info('🔧 Artisan User:');
        $this->command->info('   Email: artisan@mysharpjobs.ng');
        $this->command->info('   Password: Artisan@123');
        $this->command->info('   Role: Professional Carpenter');
        $this->command->info('');
        $this->command->info('👨‍💼 Client User:');
        $this->command->info('   Email: client@mysharpjobs.ng');
        $this->command->info('   Password: Client@123');
        $this->command->info('   Role: Job Poster & Client');
        $this->command->info('');
        $this->command->info('═══════════════════════════════════════════════════════════');
    }

    /**
     * Create additional sample users for testing
     */
    private function createAdditionalUsers(): void
    {
        // Additional Artisans
        $artisans = [
            [
                'name' => 'Emmanuel Plumber',
                'email' => 'plumber@mysharpjobs.ng',
                'skills' => ['Plumbing', 'Pipe Installation', 'Leak Repair', 'Water Heater'],
                'experience' => 5,
                'hourly_rate' => 4000.00,
                'category' => 'plumbing',
            ],
            [
                'name' => 'David Electrician',
                'email' => 'electrician@mysharpjobs.ng',
                'skills' => ['Electrical Wiring', 'Installation', 'Repair', 'Maintenance'],
                'experience' => 7,
                'hourly_rate' => 4500.00,
                'category' => 'electrical',
            ],
            [
                'name' => 'Michael Painter',
                'email' => 'painter@mysharpjobs.ng',
                'skills' => ['Interior Painting', 'Exterior Painting', 'Wall Preparation', 'Finishing'],
                'experience' => 4,
                'hourly_rate' => 3500.00,
                'category' => 'painting',
            ],
        ];

        foreach ($artisans as $artisan) {
            User::create([
                'name' => $artisan['name'],
                'email' => $artisan['email'],
                'password' => Hash::make('Password@123'),
                'type' => 'artisan',
                'location' => 'Warri, Delta State, Nigeria',
                'phone' => '+234' . rand(8000000000, 8999999999),
                'is_verified' => true,
                'is_email_verified' => true,
                'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($artisan['name']) . '&background=random&color=fff',
                'bio' => 'Experienced ' . $artisan['category'] . ' professional providing quality services.',
                'skills' => $artisan['skills'],
                'experience' => $artisan['experience'],
                'rating' => rand(40, 50) / 10,
                'review_count' => rand(20, 80),
                'completed_jobs' => rand(30, 100),
                'hourly_rate' => $artisan['hourly_rate'],
                'is_available' => true,
                'response_time' => 'Within 2 hours',
                'working_hours' => '8:00 AM - 6:00 PM',
                'service_radius' => rand(15, 30),
                'preferred_categories' => [$artisan['category']],
                'emergency_service' => (bool)rand(0, 1),
                'insurance_verified' => true,
                'last_active' => now(),
            ]);

            $this->command->info("✅ {$artisan['name']} created: {$artisan['email']} (Password: Password@123)");
        }

        // Additional Clients
        $clients = [
            [
                'name' => 'James Property Owner',
                'email' => 'james@mysharpjobs.ng',
            ],
            [
                'name' => 'Grace Business Manager',
                'email' => 'grace@mysharpjobs.ng',
            ],
        ];

        foreach ($clients as $client) {
            $paymentMethods = ['Credit Card', 'Bank Transfer', 'Wallet'];
            User::create([
                'name' => $client['name'],
                'email' => $client['email'],
                'password' => Hash::make('Password@123'),
                'type' => 'client',
                'location' => 'Warri, Delta State, Nigeria',
                'phone' => '+234' . rand(8000000000, 8999999999),
                'is_verified' => true,
                'is_email_verified' => true,
                'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($client['name']) . '&background=random&color=fff',
                'bio' => 'Looking for reliable artisans for various projects.',
                'jobs_posted' => rand(5, 20),
                'total_spent' => rand(50000, 300000),
                'preferred_payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'business_type' => 'individual',
                'last_active' => now(),
            ]);

            $this->command->info("✅ {$client['name']} created: {$client['email']} (Password: Password@123)");
        }
    }
}
