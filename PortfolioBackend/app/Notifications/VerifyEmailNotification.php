<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyEmailNotification extends Notification
{
    use Queueable;

    public function __construct()
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);
        
        return (new MailMessage)
            ->subject('Verify Your Email Address')
            ->line('Please click the button below to verify your email address.')
            ->action('Verify Email Address', $verificationUrl)
            ->line('If you did not create an account, no further action is required.');
    }

    protected function verificationUrl($notifiable): string
    {
        $backendUrl = config('app.url', 'http://localhost:8000');
        $id = $notifiable->getKey();
        $hash = sha1($notifiable->getEmailForVerification());
        
        $backendUrl = rtrim($backendUrl, '/');
        
        return "{$backendUrl}/verify-email/{$id}/{$hash}";
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
