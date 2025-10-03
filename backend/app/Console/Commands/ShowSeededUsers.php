<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ShowSeededUsers extends Command
{
    protected $signature = 'users:show';
    protected $description = 'Display all seeded users with their credentials';

    public function handle()
    {
        $this->info('');
        $this->info('═══════════════════════════════════════════════════════════');
        $this->info('           📊 SEEDED USERS SUMMARY');
        $this->info('═══════════════════════════════════════════════════════════');
        $this->info('');

        $totalUsers = User::count();
        $admins = User::where('type', 'admin')->count();
        $artisans = User::where('type', 'artisan')->count();
        $clients = User::where('type', 'client')->count();

        $this->line("Total Users: <fg=cyan>{$totalUsers}</>");
        $this->line("├─ Admins: <fg=blue>{$admins}</>");
        $this->line("├─ Artisans: <fg=green>{$artisans}</>");
        $this->line("└─ Clients: <fg=yellow>{$clients}</>");
        $this->info('');

        // Display Admin Users
        $this->info('👤 ADMIN USERS:');
        $this->info('─────────────────────────────────────────────────────────');
        $adminUsers = User::where('type', 'admin')->get();
        foreach ($adminUsers as $admin) {
            $this->line("  • {$admin->name}");
            $this->line("    Email: <fg=cyan>{$admin->email}</>");
            $this->line("    Access: Full CRUD rights");
        }
        $this->info('');

        // Display Artisan Users
        $this->info('🔧 ARTISAN USERS:');
        $this->info('─────────────────────────────────────────────────────────');
        $artisanUsers = User::where('type', 'artisan')->get();
        foreach ($artisanUsers as $artisan) {
            $this->line("  • {$artisan->name}");
            $this->line("    Email: <fg=cyan>{$artisan->email}</>");
            $this->line("    Skills: " . (is_array($artisan->skills) ? implode(', ', array_slice($artisan->skills, 0, 3)) : 'N/A'));
            if ($artisan->hourly_rate) {
                $this->line("    Rate: ₦" . number_format($artisan->hourly_rate, 2) . "/hour");
            }
        }
        $this->info('');

        // Display Client Users
        $this->info('👨‍💼 CLIENT USERS:');
        $this->info('─────────────────────────────────────────────────────────');
        $clientUsers = User::where('type', 'client')->get();
        foreach ($clientUsers as $client) {
            $this->line("  • {$client->name}");
            $this->line("    Email: <fg=cyan>{$client->email}</>");
            $this->line("    Jobs Posted: {$client->jobs_posted}");
            $this->line("    Total Spent: ₦" . number_format($client->total_spent, 2));
        }
        $this->info('');

        $this->info('═══════════════════════════════════════════════════════════');
        $this->info('📝 DEFAULT PASSWORDS:');
        $this->info('─────────────────────────────────────────────────────────');
        $this->line('  Admin: <fg=yellow>Admin@123</>');
        $this->line('  Artisan: <fg=yellow>Artisan@123</>');
        $this->line('  Client: <fg=yellow>Client@123</>');
        $this->line('  Others: <fg=yellow>Password@123</>');
        $this->info('═══════════════════════════════════════════════════════════');
        $this->info('');

        return 0;
    }
}
