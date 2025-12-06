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
    public function index()
    {
        $experiences = Experience::all();

        return response()->json($experiences);
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
