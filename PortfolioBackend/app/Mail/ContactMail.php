<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public array $data
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Contact Form Submission from ' . $this->data['name'],
            replyTo: [
                $this->data['email'],
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact',
            with: [
                'data' => $this->data,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

