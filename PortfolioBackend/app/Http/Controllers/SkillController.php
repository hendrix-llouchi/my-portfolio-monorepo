<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $skills = Skill::all();

        return response()->json($skills);
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
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'proficiency' => 'nullable|integer|min:0|max:100',
        ]);

        $skill = Skill::create($validated);

        return response()->json($skill, 201);
    }

    /**
     * Update the specified resource in storage.
     */
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skill $skill): JsonResponse
    {
        $skill->delete();

        return response()->json(['message' => 'Skill deleted successfully'], 200);
    }
}
