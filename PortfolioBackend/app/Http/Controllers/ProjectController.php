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
            return response()->json([
                'message' => 'Failed to fetch projects',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
            'image_url' => 'nullable|string|max:255',
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
            'image_url' => 'nullable|string|max:255',
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
        } elseif ($request->has('image_url')) {
            $imageUrlValue = $request->input('image_url', '');
            
            if ($imageUrlValue === '' || $imageUrlValue === null) {
                if ($project->image_url && $this->isLocalImage($project->image_url)) {
                    $this->deleteImageFile($project->image_url);
                }
                $imageUrl = null;
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
        if ($project->image_url) {
            $this->deleteImageFile($project->image_url);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }

    private function deleteImageFile(string $imageUrl): void
    {
        if (!$this->isLocalImage($imageUrl)) {
            return;
        }

        try {
            $path = parse_url($imageUrl, PHP_URL_PATH);
            
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
                    return;
                }
                
                if (Storage::disk('public')->exists($storagePath)) {
                    Storage::disk('public')->delete($storagePath);
                }
            }
        } catch (\Exception $e) {
        }
    }

    private function isLocalImage(string $imageUrl): bool
    {
        return strpos($imageUrl, '/storage/') !== false;
    }
}

