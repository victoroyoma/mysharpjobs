<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Suspended</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .alert-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚫 Account Suspended</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{{ $userName }}</strong>,</p>
            
            <p>Your MySharpJob account has been temporarily suspended.</p>
            
            <div class="alert-box">
                <strong>Reason for Suspension:</strong><br>
                {{ $reason }}
                @if($duration)
                    <br><br>
                    <strong>Duration:</strong> {{ $duration }}
                @endif
            </div>
            
            <p><strong>What This Means:</strong></p>
            <ul>
                <li>You cannot access your account</li>
                <li>Your profile is hidden from search results</li>
                <li>You cannot post or apply for jobs</li>
                <li>You cannot send or receive messages</li>
            </ul>
            
            <p><strong>What You Can Do:</strong></p>
            <ul>
                <li>Review our Terms of Service</li>
                <li>Contact support if you believe this is an error</li>
                <li>Wait for the suspension period to end (if temporary)</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="{{ $supportUrl }}" class="button">Contact Support</a>
            </p>
            
            <p>Best regards,<br>The MySharpJob Team</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} MySharpJob. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
