<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class ServeAll extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'serve:all 
                            {--host=127.0.0.1 : The host address to serve the application on}
                            {--port=8000 : The port to serve the application on}
                            {--reverb-port=6001 : The port for Reverb WebSocket server}
                            {--frontend-port=5173 : The port for the frontend development server}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start Laravel backend, Reverb WebSocket server, and React frontend simultaneously';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Starting MySharpJobs Full Stack Development Server...');
        $this->newLine();

        // Display startup information
        $this->displayStartupInfo();
        
        // Check if concurrently is installed
        if (!$this->checkConcurrentlyInstalled()) {
            $this->error('❌ "concurrently" package not found!');
            $this->info('Installing concurrently...');
            $this->executeCommand('npm install -g concurrently', base_path());
        }

        $this->newLine();
        $this->info('Starting all services...');
        $this->newLine();

        // Run the dev command
        $this->runDevServer();

        return Command::SUCCESS;
    }

    /**
     * Display startup information
     */
    protected function displayStartupInfo(): void
    {
        $this->components->twoColumnDetail('<fg=cyan>Backend Server</fg>', "http://{$this->option('host')}:{$this->option('port')}");
        $this->components->twoColumnDetail('<fg=magenta>Reverb WebSocket</fg>', "ws://{$this->option('host')}:{$this->option('reverb-port')}");
        $this->components->twoColumnDetail('<fg=green>Frontend (React)</fg>', "http://{$this->option('host')}:{$this->option('frontend-port')}");
        $this->newLine();
        
        $this->components->info('Press Ctrl+C to stop all servers');
    }

    /**
     * Check if concurrently is installed
     */
    protected function checkConcurrentlyInstalled(): bool
    {
        $process = Process::fromShellCommandline('npx concurrently --version');
        $process->run();
        
        return $process->isSuccessful();
    }

    /**
     * Run the development server
     */
    protected function runDevServer(): void
    {
        $host = $this->option('host');
        $port = $this->option('port');
        $reverbPort = $this->option('reverb-port');
        
        // Build the command
        $command = sprintf(
            'npx concurrently -c "#93c5fd,#c4b5fd,#4ade80,#fb7185" ' .
            '"php artisan serve --host=%s --port=%s" ' .
            '"php artisan reverb:start --host=%s --port=%s" ' .
            '"cd .. && npm run dev" ' .
            '"php artisan queue:listen --tries=1" ' .
            '--names=backend,reverb,frontend,queue ' .
            '--kill-others-on-fail',
            $host,
            $port,
            $host,
            $reverbPort
        );

        $this->info('🎯 All services starting...');
        $this->newLine();

        // Execute the command
        passthru($command);
    }

    /**
     * Run a shell command in a specific directory
     */
    protected function executeCommand(string $command, string $directory): void
    {
        $process = Process::fromShellCommandline($command, $directory);
        $process->setTimeout(300);
        $process->run();
    }
}
