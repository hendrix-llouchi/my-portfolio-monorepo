<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $experiences = Experience::all()->map(function ($experience) {
                // Ensure technologies is always an array
                $technologies = $experience->technologies;
                if (is_string($technologies)) {
                    $decoded = json_decode($technologies, true);
                    $technologies = (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) 
                        ? $decoded 
                        : [];
                }
                if (!is_array($technologies)) {
                    $technologies = [];
                }
                
                return [
                    'id' => $experience->id,
                    'company' => $experience->company,
                    'role' => $experience->role,
                    'period' => $experience->period,
                    'description' => $experience->description,
                    'technologies' => $technologies,
                    'created_at' => $experience->created_at,
                    'updated_at' => $experience->updated_at,
                ];
            });

            return response()->json($experiences);
        } catch (\Exception $e) {
            \Log::error('Error fetching experiences', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to fetch experiences',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'period' => 'required|string|max:255',
            'description' => 'required|string',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string',
        ]);

        $experience = Experience::create($validated);

        return response()->json($experience, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Experience $experience): JsonResponse
    {
        $validated = $request->validate([
            'company' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'period' => 'required|string|max:255',
            'description' => 'required|string',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string',
        ]);

        $experience->update($validated);

        return response()->json($experience);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Experience $experience): JsonResponse
    {
        $experience->delete();

        return response()->json(['message' => 'Experience deleted successfully'], 200);
    }
}
