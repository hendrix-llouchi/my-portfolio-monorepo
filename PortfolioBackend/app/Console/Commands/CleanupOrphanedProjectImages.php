<?php

namespace App\Console\Commands;

use App\Models\Project;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanupOrphanedProjectImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'projects:cleanup-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove image files that are not associated with any project';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting cleanup of orphaned project images...');

        // Get all project image URLs from database
        $projects = Project::whereNotNull('image_url')->get();
        $usedImages = [];

        foreach ($projects as $project) {
            if ($project->image_url) {
                $path = $this->extractStoragePath($project->image_url);
                if ($path) {
                    $usedImages[] = $path;
                }
            }
        }

        $this->info('Found ' . count($usedImages) . ' images in use by projects.');

        // Get all image files in storage
        $allImages = Storage::disk('public')->files('projects');
        $orphanedImages = [];

        foreach ($allImages as $imagePath) {
            // Extract just the filename part for comparison
            $filename = basename($imagePath);
            $isUsed = false;

            foreach ($usedImages as $usedPath) {
                if (basename($usedPath) === $filename) {
                    $isUsed = true;
                    break;
                }
            }

            if (!$isUsed) {
                $orphanedImages[] = $imagePath;
            }
        }

        if (empty($orphanedImages)) {
            $this->info('No orphaned images found.');
            return 0;
        }

        $this->warn('Found ' . count($orphanedImages) . ' orphaned image(s):');
        foreach ($orphanedImages as $image) {
            $this->line('  - ' . $image);
        }

        if ($this->confirm('Do you want to delete these orphaned images?', true)) {
            $deleted = 0;
            foreach ($orphanedImages as $image) {
                if (Storage::disk('public')->delete($image)) {
                    $deleted++;
                    $this->info('Deleted: ' . $image);
                } else {
                    $this->error('Failed to delete: ' . $image);
                }
            }
            $this->info("Successfully deleted {$deleted} orphaned image(s).");
        } else {
            $this->info('Cleanup cancelled.');
        }

        return 0;
    }

    /**
     * Extract storage path from image URL.
     *
     * @param string $imageUrl
     * @return string|null
     */
    private function extractStoragePath(string $imageUrl): ?string
    {
        $path = parse_url($imageUrl, PHP_URL_PATH);
        
        if ($path) {
            $path = ltrim($path, '/');
            
            if (strpos($path, 'storage/') === 0) {
                return str_replace('storage/', '', $path);
            } elseif (strpos($path, 'projects/') !== false) {
                return $path;
            }
        }
        
        return null;
    }
}

