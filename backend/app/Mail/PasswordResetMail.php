<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public string $email,
        public string $token,
        public string $userName = 'User'
    )
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Password Reset Request - MySharpJob',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $resetUrl = config('app.frontend_url', 'http://localhost:3000') . '/reset-password?token=' . $this->token . '&email=' . urlencode($this->email);
        
        return new Content(
            view: 'emails.password-reset',
            with: [
                'userName' => $this->userName,
                'resetUrl' => $resetUrl,
                'token' => $this->token,
                'expiryMinutes' => 60,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
