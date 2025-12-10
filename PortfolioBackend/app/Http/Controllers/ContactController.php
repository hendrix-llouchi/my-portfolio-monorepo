<?php

namespace App\Http\Controllers;

use App\Events\NewContactMessage;
use App\Http\Requests\ContactFormRequest;
use App\Mail\ContactMail;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /**
     * Handle the contact form submission.
     */
    public function submit(ContactFormRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Save the message to the database
        $message = ContactMessage::create($validated);

        // Broadcast real-time event
        event(new NewContactMessage($message));

        // Send email notification
        Mail::to('henricobb2@gmail.com')->send(new ContactMail($validated));

        return response()->json([
            'success' => true,
            'message' => 'Thank you for your message! We will get back to you soon.',
        ], 200);
    }

    /**
     * Get all contact messages (admin only).
     */
    public function messages(): JsonResponse
    {
        $messages = ContactMessage::latest()->get();

        return response()->json($messages, 200);
    }
}
