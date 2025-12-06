<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Display the profile (public endpoint).
     */
    public function index(): JsonResponse
    {
        $profile = Profile::first();
        
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json($profile);
    }

    /**
     * Update or create the profile (protected endpoint).
     */
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

        // Get existing profile to check for old files
        $existingProfile = Profile::first();

        // Handle avatar deletion
        if ($request->input('delete_avatar') === 'true' || $request->input('delete_avatar') === true) {
            if ($existingProfile && $existingProfile->avatar_url) {
                $oldPath = $this->extractPathFromUrl($existingProfile->avatar_url);
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $profileData['avatar_url'] = null;
        }
        // Handle avatar upload
        elseif ($request->hasFile('avatar')) {
            // Delete old avatar if it exists
            if ($existingProfile && $existingProfile->avatar_url) {
                $oldPath = $this->extractPathFromUrl($existingProfile->avatar_url);
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Store new avatar - save as actual file
            $path = $request->file('avatar')->store('profile', 'public');
            // Store just the relative path, not full URL - frontend will construct the URL
            $profileData['avatar_url'] = 'storage/' . $path;
        }

        // Handle resume deletion
        if ($request->input('delete_resume') === 'true' || $request->input('delete_resume') === true) {
            if ($existingProfile && $existingProfile->resume_url) {
                $oldPath = $this->extractPathFromUrl($existingProfile->resume_url);
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $profileData['resume_url'] = null;
        }
        // Handle resume upload
        elseif ($request->hasFile('resume')) {
            // Delete old resume if it exists
            if ($existingProfile && $existingProfile->resume_url) {
                $oldPath = $this->extractPathFromUrl($existingProfile->resume_url);
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Store new resume - save as actual file
            $path = $request->file('resume')->store('profile', 'public');
            // Store just the relative path, not full URL - frontend will construct the URL
            $profileData['resume_url'] = 'storage/' . $path;
        }

        // Update or create profile (singleton - only one record)
        $profile = Profile::updateOrCreate(
            ['id' => $existingProfile?->id ?? 1],
            $profileData
        );

        return response()->json($profile);
    }

    /**
     * Extract the relative path from a URL or path.
     *
     * @param string $url
     * @return string|null
     */
    private function extractPathFromUrl(string $url): ?string
    {
        // If it's already a relative path (starts with 'storage/'), return it
        if (str_starts_with($url, 'storage/')) {
            return $url;
        }
        
        // If it's a full URL, extract the path
        $urlPath = parse_url($url, PHP_URL_PATH);
        if ($urlPath) {
            // Remove leading slash and 'storage/' if present
            $path = ltrim($urlPath, '/');
            if (str_starts_with($path, 'storage/')) {
                return $path;
            }
            return 'storage/' . $path;
        }
        
        return null;
    }
}
