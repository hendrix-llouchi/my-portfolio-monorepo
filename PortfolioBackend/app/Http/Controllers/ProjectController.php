<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack' => 'required',
            'image_url' => 'nullable|string|max:255',
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

        $projectData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'tech_stack' => $techStack,
            'image_url' => !empty($validated['image_url']) ? $validated['image_url'] : null,
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack' => 'required',
            'image_url' => 'nullable|string|max:255',
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

        $projectData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'tech_stack' => $techStack,
            'image_url' => !empty($validated['image_url']) ? $validated['image_url'] : null,
            'demo_link' => !empty($validated['demo_link']) ? $validated['demo_link'] : null,
            'repo_link' => !empty($validated['repo_link']) ? $validated['repo_link'] : null,
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
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }
}

