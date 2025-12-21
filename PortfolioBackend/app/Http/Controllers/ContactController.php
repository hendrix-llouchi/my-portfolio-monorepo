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
    public function submit(ContactFormRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $message = ContactMessage::create($validated);
        event(new NewContactMessage($message));
        Mail::to('henricobb2@gmail.com')->send(new ContactMail($validated));

        return response()->json([
            'success' => true,
            'message' => 'Thank you for your message! We will get back to you soon.',
        ], 200);
    }

    public function messages(): JsonResponse
    {
        $messages = ContactMessage::latest()->get();

        return response()->json($messages, 200);
    }

    public function destroy(ContactMessage $message): JsonResponse
    {
        $message->delete();

        return response()->json(['message' => 'Message deleted successfully'], 200);
    }
}
