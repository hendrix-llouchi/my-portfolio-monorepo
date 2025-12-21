<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $projects = Project::all()->map(function ($project) {
                $techStack = $project->tech_stack;
                if (is_string($techStack)) {
                    $decoded = json_decode($techStack, true);
                    $techStack = (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) 
                        ? $decoded 
                        : array_filter(array_map('trim', explode(',', $techStack)));
                }
                if (!is_array($techStack)) {
                    $techStack = [];
                }
                
                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'description' => $project->description,
                    'tech_stack' => $techStack,
                    'image_url' => $project->image_url,
                    'demo_link' => $project->demo_link,
                    'repo_link' => $project->repo_link,
                    'created_at' => $project->created_at,
                    'updated_at' => $project->updated_at,
                ];
            });

            return response()->json($projects);
        } catch (\Exception $e) {
            \Log::error('Error fetching projects', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to fetch projects',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
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

        $techStack = $this->normalizeTechStack($validated['tech_stack']);
        
        if (empty($techStack)) {
            return response()->json([
                'message' => 'The tech stack field is required and must contain at least one technology.',
                'errors' => ['tech_stack' => ['The tech stack must contain at least one technology.']]
            ], 422);
        }

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('projects', 'public');
            $baseUrl = $request->getSchemeAndHttpHost();
            $imageUrl = $baseUrl . '/storage/' . $imagePath;
            \Log::info('Image uploaded', ['path' => $imagePath, 'url' => $imageUrl, 'base_url' => $baseUrl]);
        } elseif (!empty($validated['image_url'])) {
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

    public function update(Request $request, Project $project): JsonResponse
    {
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

        $techStack = $this->normalizeTechStack($validated['tech_stack']);
        
        if (empty($techStack)) {
            return response()->json([
                'message' => 'The tech stack field is required and must contain at least one technology.',
                'errors' => ['tech_stack' => ['The tech stack must contain at least one technology.']]
            ], 422);
        }

        $imageUrl = $project->image_url;
        
        if ($request->hasFile('image')) {
            if ($project->image_url) {
                $this->deleteImageFile($project->image_url);
            }
            
            $imagePath = $request->file('image')->store('projects', 'public');
            $baseUrl = $request->getSchemeAndHttpHost();
            $imageUrl = $baseUrl . '/storage/' . $imagePath;
            \Log::info('Image updated', ['path' => $imagePath, 'url' => $imageUrl, 'base_url' => $baseUrl]);
        } elseif ($request->has('image_url')) {
            $imageUrlValue = $request->input('image_url', '');
            \Log::info('Image URL in request', ['value' => $imageUrlValue, 'is_empty' => $imageUrlValue === '', 'project_current' => $project->image_url]);
            
            if ($imageUrlValue === '' || $imageUrlValue === null) {
                if ($project->image_url && $this->isLocalImage($project->image_url)) {
                    $this->deleteImageFile($project->image_url);
                }
                $imageUrl = null;
                \Log::info('Image removed from project', ['project_id' => $project->id]);
            } elseif ($imageUrlValue !== $project->image_url) {
                if ($project->image_url && $this->isLocalImage($project->image_url)) {
                    $this->deleteImageFile($project->image_url);
                }
                $imageUrl = !empty($imageUrlValue) ? $imageUrlValue : null;
            }
        }

        $demoLink = null;
        $repoLink = null;
        
        if (array_key_exists('demo_link', $request->all())) {
            $demoLinkValue = $request->input('demo_link');
            if ($demoLinkValue === null || $demoLinkValue === '' || (is_string($demoLinkValue) && trim($demoLinkValue) === '')) {
                $demoLink = null;
            } else {
                $demoLink = is_string($demoLinkValue) ? trim($demoLinkValue) : $demoLinkValue;
            }
            \Log::info('Demo link updated', ['value' => $demoLinkValue, 'result' => $demoLink, 'type' => gettype($demoLinkValue)]);
        } else {
            $demoLink = $project->demo_link;
        }
        
        if (array_key_exists('repo_link', $request->all())) {
            $repoLinkValue = $request->input('repo_link');
            if ($repoLinkValue === null || $repoLinkValue === '' || (is_string($repoLinkValue) && trim($repoLinkValue) === '')) {
                $repoLink = null;
            } else {
                $repoLink = is_string($repoLinkValue) ? trim($repoLinkValue) : $repoLinkValue;
            }
            \Log::info('Repo link updated', ['value' => $repoLinkValue, 'result' => $repoLink, 'type' => gettype($repoLinkValue)]);
        } else {
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

    private function normalizeTechStack($techStack): array
    {
        if (is_array($techStack)) {
            return array_filter(array_map('trim', $techStack));
        }

        if (is_string($techStack)) {
            $decoded = json_decode($techStack, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return array_filter(array_map('trim', $decoded));
            }
            return array_filter(array_map('trim', explode(',', $techStack)));
        }

        return [];
    }

    public function destroy(Project $project): JsonResponse
    {
        \Log::info('Deleting project', ['id' => $project->id, 'title' => $project->title, 'image_url' => $project->image_url]);
        
        if ($project->image_url) {
            $this->deleteImageFile($project->image_url);
        }

        $project->delete();

        \Log::info('Project deleted successfully', ['id' => $project->id]);

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }

    private function deleteImageFile(string $imageUrl): void
    {
        \Log::info('Attempting to delete image file', ['url' => $imageUrl]);
        
        if (!$this->isLocalImage($imageUrl)) {
            \Log::info('Image URL is not a local file, skipping deletion', ['url' => $imageUrl]);
            return;
        }

        try {
            $path = parse_url($imageUrl, PHP_URL_PATH);
            \Log::info('Parsed URL path', ['url' => $imageUrl, 'parsed_path' => $path]);
            
            if ($path) {
                $path = ltrim($path, '/');
                
                if (str_starts_with($path, 'storage/')) {
                    $storagePath = substr($path, 8);
                } elseif (str_contains($path, 'projects/')) {
                    $parts = explode('/', $path);
                    $projectsIndex = array_search('projects', $parts);
                    if ($projectsIndex !== false) {
                        $storagePath = implode('/', array_slice($parts, $projectsIndex));
                    } else {
                        $storagePath = $path;
                    }
                } else {
                    \Log::warning('Could not extract storage path from URL', ['url' => $imageUrl, 'path' => $path]);
                    return;
                }
                
                \Log::info('Extracted storage path', ['storage_path' => $storagePath, 'original_url' => $imageUrl]);
                
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

    private function isLocalImage(string $imageUrl): bool
    {
        return strpos($imageUrl, '/storage/') !== false;
    }
}

