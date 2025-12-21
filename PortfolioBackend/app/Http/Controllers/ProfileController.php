<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function index(): JsonResponse
    {
        $profile = Profile::first();
        
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json($profile);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'headline' => 'required|string|max:255',
            'sub_headline' => 'nullable|string|max:255',
            'short_bio' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // 5MB max for resume
            'linkedin' => 'nullable|string|max:255',
            'github' => 'nullable|string|max:255',
            'status_text' => 'nullable|string|max:255',
        ]);

        $profileData = [
            'name' => $validated['name'],
            'headline' => $validated['headline'],
            'sub_headline' => $validated['sub_headline'] ?? null,
            'short_bio' => $validated['short_bio'] ?? null,
            'linkedin' => $validated['linkedin'] ?? null,
            'github' => $validated['github'] ?? null,
            'status_text' => $validated['status_text'] ?? 'System Online',
        ];

        $existingProfile = Profile::first();

        if ($request->input('delete_avatar') === 'true' || $request->input('delete_avatar') === true) {
            if ($existingProfile && $existingProfile->avatar_url) {
                $oldPath = $this->extractPathFromUrl($existingProfile->avatar_url);
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $profileData['avatar_url'] = null;
        }
        elseif ($request->hasFile('avatar')) {
            if ($existingProfile && $existingProfile->avatar_url) {
                $oldPath = $this->extractPathFromUrl($existingProfile->avatar_url);
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('avatar')->store('profile', 'public');
            $profileData['avatar_url'] = 'storage/' . $path;
        }

        if ($request->input('delete_resume') === 'true' || $request->input('delete_resume') === true) {
            if ($existingProfile && $existingProfile->resume_url) {
                $oldPath = $this->extractPathFromUrl($existingProfile->resume_url);
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $profileData['resume_url'] = null;
        }
        elseif ($request->hasFile('resume')) {
            if ($existingProfile && $existingProfile->resume_url) {
                $oldPath = $this->extractPathFromUrl($existingProfile->resume_url);
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('resume')->store('profile', 'public');
            $profileData['resume_url'] = 'storage/' . $path;
        }

        $profile = Profile::updateOrCreate(
            ['id' => $existingProfile?->id ?? 1],
            $profileData
        );

        return response()->json($profile);
    }

    private function extractPathFromUrl(string $url): ?string
    {
        if (str_starts_with($url, 'storage/')) {
            return substr($url, 8);
        }
        
        $urlPath = parse_url($url, PHP_URL_PATH);
        if ($urlPath) {
            $path = ltrim($urlPath, '/');
            if (str_starts_with($path, 'storage/')) {
                return substr($path, 8);
            }
            return $path;
        }
        
        return null;
    }
}
