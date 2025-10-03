<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Verification Approved!</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{{ $userName }}</strong>,</p>
            
            <p>Great news! Your <strong>{{ $verificationType }}</strong> verification has been approved.</p>
            
            <div class="success-badge">✓ Verified {{ ucfirst($userType) }}</div>
            
            @if($userType === 'artisan')
                <p>You can now:</p>
                <ul>
                    <li>Apply for jobs posted by clients</li>
                    <li>Receive direct job invitations</li>
                    <li>Access the payment system</li>
                    <li>Build your reputation with reviews</li>
                </ul>
            @else
                <p>You can now post jobs and hire verified artisans with confidence!</p>
            @endif
            
            <p style="text-align: center;">
                <a href="{{ $dashboardUrl }}" class="button">Go to Dashboard</a>
            </p>
            
            <p>Welcome to the MySharpJob community!</p>
            
            <p>Best regards,<br>The MySharpJob Team</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} MySharpJob. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
