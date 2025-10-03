<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .info-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
        .token-box { background: #f3f4f6; padding: 15px; text-align: center; font-family: monospace; font-size: 18px; letter-spacing: 2px; margin: 20px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{{ $userName }}</strong>,</p>
            
            <p>We received a request to reset your MySharpJob account password. Click the button below to create a new password:</p>
            
            <p style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">Reset Password</a>
            </p>
            
            <p>Or copy and paste this link into your browser:</p>
            <div style="background: #f3f4f6; padding: 10px; word-break: break-all; border-radius: 5px;">
                {{ $resetUrl }}
            </div>
            
            <div class="info-box">
                <strong>⏰ Important:</strong><br>
                This password reset link will expire in <strong>{{ $expiryMinutes }} minutes</strong>.
            </div>
            
            <p><strong>Didn't request this?</strong></p>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p><strong>Security Tips:</strong></p>
            <ul>
                <li>Never share your password with anyone</li>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication if available</li>
            </ul>
            
            <p>Best regards,<br>The MySharpJob Team</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} MySharpJob. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
