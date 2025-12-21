<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $skills = Skill::all();
            return response()->json($skills);
        } catch (\Exception $e) {
            \Log::error('Error fetching skills', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to fetch skills',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'proficiency' => 'nullable|integer|min:0|max:100',
        ]);

        $skill = Skill::create($validated);

        return response()->json($skill, 201);
    }

    public function update(Request $request, Skill $skill): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'proficiency' => 'nullable|integer|min:0|max:100',
        ]);

        $skill->update($validated);

        return response()->json($skill);
    }

    public function destroy(Skill $skill): JsonResponse
    {
        $skill->delete();

        return response()->json(['message' => 'Skill deleted successfully'], 200);
    }
}
