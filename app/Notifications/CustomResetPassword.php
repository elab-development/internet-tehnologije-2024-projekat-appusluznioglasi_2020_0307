<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class CustomResetPassword extends Notification
{
    use Queueable;

    public string $url;

    public function __construct(string $url)
    {
        $this->url = $url;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Reset lozinke')
            ->line('Kliknite na dugme ispod da resetujete svoju lozinku.')
            ->action('Resetuj lozinku', $this->url)
            ->line('Ako niste tražili reset lozinke, ignorišite ovaj email.');
    }
}
