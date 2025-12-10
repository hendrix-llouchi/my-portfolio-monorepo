<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /**
     * Display a listing of all projects.
     */
    public function index(): JsonResponse
    {
        $projects = Project::all();

        return response()->json($projects);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request): JsonResponse
    {
        // Debug: Log what we're receiving
        \Log::info('Project Store Request', [
            'all' => $request->all(),
            'has_file' => $request->hasFile('image'),
            'input' => $request->input(),
            'method' => $request->method(),
        ]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240', // 10MB max
            'image_url' => 'nullable|string|max:255', // Keep for backward compatibility
            'demo_link' => 'nullable|string|max:255',
            'repo_link' => 'nullable|string|max:255',
        ]);

        // Handle tech_stack (can be JSON string, array, or comma-separated string from FormData)
        $techStack = $this->normalizeTechStack($validated['tech_stack']);
        
        // Validate that tech_stack is not empty after normalization
        if (empty($techStack)) {
            return response()->json([
                'message' => 'The tech stack field is required and must contain at least one technology.',
                'errors' => ['tech_stack' => ['The tech stack must contain at least one technology.']]
            ], 422);
        }

        // Handle image upload
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('projects', 'public');
            // Generate full URL - use request URL to ensure correct host/port
            $baseUrl = $request->getSchemeAndHttpHost();
            $imageUrl = $baseUrl . '/storage/' . $imagePath;
            \Log::info('Image uploaded', ['path' => $imagePath, 'url' => $imageUrl, 'base_url' => $baseUrl]);
        } elseif (!empty($validated['image_url'])) {
            // Fallback to image_url for backward compatibility
            $imageUrl = $validated['image_url'];
        }

        $projectData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'tech_stack' => $techStack,
            'image_url' => $imageUrl,
            'demo_link' => !empty($validated['demo_link']) ? $validated['demo_link'] : null,
            'repo_link' => !empty($validated['repo_link']) ? $validated['repo_link'] : null,
        ];

        $project = Project::create($projectData);

        return response()->json($project, 201);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        // Debug: Log what we're receiving
        \Log::info('Project Update Request', [
            'all' => $request->all(),
            'has_file' => $request->hasFile('image'),
            'input' => $request->input(),
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'demo_link_raw' => $request->input('demo_link'),
            'repo_link_raw' => $request->input('repo_link'),
            'has_demo_link' => $request->has('demo_link'),
            'has_repo_link' => $request->has('repo_link'),
            'array_key_demo' => array_key_exists('demo_link', $request->all()),
            'array_key_repo' => array_key_exists('repo_link', $request->all()),
        ]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240', // 10MB max
            'image_url' => 'nullable|string|max:255', // Keep for backward compatibility
            'demo_link' => 'nullable|string|max:255',
            'repo_link' => 'nullable|string|max:255',
        ]);

        // Handle tech_stack (can be JSON string, array, or comma-separated string)
        $techStack = $this->normalizeTechStack($validated['tech_stack']);
        
        // Validate that tech_stack is not empty after normalization
        if (empty($techStack)) {
            return response()->json([
                'message' => 'The tech stack field is required and must contain at least one technology.',
                'errors' => ['tech_stack' => ['The tech stack must contain at least one technology.']]
            ], 422);
        }

        // Handle image upload - delete old image if new one is uploaded
        $imageUrl = $project->image_url; // Keep existing image by default
        
        if ($request->hasFile('image')) {
            // Delete old image if it exists and is stored locally
            if ($project->image_url) {
                $this->deleteImageFile($project->image_url);
            }
            
            // Store new image
            $imagePath = $request->file('image')->store('projects', 'public');
            // Generate full URL - use request URL to ensure correct host/port
            $baseUrl = $request->getSchemeAndHttpHost();
            $imageUrl = $baseUrl . '/storage/' . $imagePath;
            \Log::info('Image updated', ['path' => $imagePath, 'url' => $imageUrl, 'base_url' => $baseUrl]);
        } elseif ($request->has('image_url')) {
            // Check if image should be removed (empty string)
            // Use raw input because empty strings might not be in validated array
            $imageUrlValue = $request->input('image_url', '');
            \Log::info('Image URL in request', ['value' => $imageUrlValue, 'is_empty' => $imageUrlValue === '', 'project_current' => $project->image_url]);
            
            if ($imageUrlValue === '' || $imageUrlValue === null) {
                // Delete old image if it exists
                if ($project->image_url && $this->isLocalImage($project->image_url)) {
                    $this->deleteImageFile($project->image_url);
                }
                $imageUrl = null;
                \Log::info('Image removed from project', ['project_id' => $project->id]);
            } elseif ($imageUrlValue !== $project->image_url) {
                // If image_url changed and no new file uploaded, delete old local file if it exists
                if ($project->image_url && $this->isLocalImage($project->image_url)) {
                    $this->deleteImageFile($project->image_url);
                }
                $imageUrl = !empty($imageUrlValue) ? $imageUrlValue : null;
            }
        }

        // Handle demo_link and repo_link - always check input (even if empty string)
        // FormData always sends these fields, so we check if they exist in input
        $demoLink = null;
        $repoLink = null;
        
        // Check if demo_link exists in request (even if empty string or null)
        if (array_key_exists('demo_link', $request->all())) {
            $demoLinkValue = $request->input('demo_link');
            // Handle both empty string and null - both mean "clear this field"
            if ($demoLinkValue === null || $demoLinkValue === '' || (is_string($demoLinkValue) && trim($demoLinkValue) === '')) {
                $demoLink = null;
            } else {
                $demoLink = is_string($demoLinkValue) ? trim($demoLinkValue) : $demoLinkValue;
            }
            \Log::info('Demo link updated', ['value' => $demoLinkValue, 'result' => $demoLink, 'type' => gettype($demoLinkValue)]);
        } else {
            // If not sent, keep existing value
            $demoLink = $project->demo_link;
        }
        
        // Check if repo_link exists in request (even if empty string or null)
        if (array_key_exists('repo_link', $request->all())) {
            $repoLinkValue = $request->input('repo_link');
            // Handle both empty string and null - both mean "clear this field"
            if ($repoLinkValue === null || $repoLinkValue === '' || (is_string($repoLinkValue) && trim($repoLinkValue) === '')) {
                $repoLink = null;
            } else {
                $repoLink = is_string($repoLinkValue) ? trim($repoLinkValue) : $repoLinkValue;
            }
            \Log::info('Repo link updated', ['value' => $repoLinkValue, 'result' => $repoLink, 'type' => gettype($repoLinkValue)]);
        } else {
            // If not sent, keep existing value
            $repoLink = $project->repo_link;
        }

        $projectData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'tech_stack' => $techStack,
            'image_url' => $imageUrl,
            'demo_link' => $demoLink,
            'repo_link' => $repoLink,
        ];

        $project->update($projectData);

        return response()->json($project);
    }

    /**
     * Normalize tech_stack from various input formats.
     *
     * @param mixed $techStack
     * @return array
     */
    private function normalizeTechStack($techStack): array
    {
        // If it's already an array, return it
        if (is_array($techStack)) {
            return array_filter(array_map('trim', $techStack));
        }

        // If it's a JSON string, decode it
        if (is_string($techStack)) {
            $decoded = json_decode($techStack, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return array_filter(array_map('trim', $decoded));
            }

            // If not JSON, treat as comma-separated string
            return array_filter(array_map('trim', explode(',', $techStack)));
        }

        // Fallback to empty array
        return [];
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): JsonResponse
    {
        \Log::info('Deleting project', ['id' => $project->id, 'title' => $project->title, 'image_url' => $project->image_url]);
        
        // Delete associated image file if it exists and is stored locally
        if ($project->image_url) {
            $this->deleteImageFile($project->image_url);
        }

        $project->delete();

        \Log::info('Project deleted successfully', ['id' => $project->id]);

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }

    /**
     * Delete image file from storage if it's a local file.
     *
     * @param string $imageUrl
     * @return void
     */
    private function deleteImageFile(string $imageUrl): void
    {
        \Log::info('Attempting to delete image file', ['url' => $imageUrl]);
        
        if (!$this->isLocalImage($imageUrl)) {
            \Log::info('Image URL is not a local file, skipping deletion', ['url' => $imageUrl]);
            return; // Don't delete external URLs
        }

        try {
            // Extract the path from the URL
            // URL format: http://127.0.0.1:8000/storage/projects/filename.jpg
            // We need: projects/filename.jpg
            $path = parse_url($imageUrl, PHP_URL_PATH);
            \Log::info('Parsed URL path', ['url' => $imageUrl, 'parsed_path' => $path]);
            
            if ($path) {
                // Remove leading slash
                $path = ltrim($path, '/');
                
                // Handle different URL formats
                if (strpos($path, 'storage/') === 0) {
                    // Format: storage/projects/filename.jpg
                    $storagePath = str_replace('storage/', '', $path);
                } elseif (strpos($path, 'projects/') !== false) {
                    // Format: projects/filename.jpg (direct)
                    $storagePath = $path;
                } else {
                    // Try to extract projects/ part
                    $parts = explode('/', $path);
                    $projectsIndex = array_search('projects', $parts);
                    if ($projectsIndex !== false) {
                        $storagePath = implode('/', array_slice($parts, $projectsIndex));
                    } else {
                        \Log::warning('Could not extract storage path from URL', ['url' => $imageUrl, 'path' => $path]);
                        return;
                    }
                }
                
                \Log::info('Extracted storage path', ['storage_path' => $storagePath, 'original_url' => $imageUrl]);
                
                // Delete the file if it exists
                if (Storage::disk('public')->exists($storagePath)) {
                    $deleted = Storage::disk('public')->delete($storagePath);
                    if ($deleted) {
                        \Log::info('Deleted project image successfully', ['path' => $storagePath, 'url' => $imageUrl]);
                    } else {
                        \Log::error('Failed to delete project image file - Storage::delete returned false', ['path' => $storagePath, 'url' => $imageUrl]);
                    }
                } else {
                    \Log::warning('Project image file not found for deletion', ['path' => $storagePath, 'url' => $imageUrl, 'full_storage_path' => storage_path('app/public/' . $storagePath)]);
                }
            } else {
                \Log::warning('Could not parse URL path', ['url' => $imageUrl]);
            }
        } catch (\Exception $e) {
            \Log::error('Error deleting project image', [
                'url' => $imageUrl,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Check if image URL is a local storage file.
     *
     * @param string $imageUrl
     * @return bool
     */
    private function isLocalImage(string $imageUrl): bool
    {
        // Check if URL contains /storage/ which indicates it's a local file
        return strpos($imageUrl, '/storage/') !== false;
    }
}

