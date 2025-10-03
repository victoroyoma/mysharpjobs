<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Reactivated</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Welcome Back!</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{{ $userName }}</strong>,</p>
            
            <div class="success-box">
                <strong>Good News!</strong><br>
                Your MySharpJob account has been reactivated and you now have full access to all features.
            </div>
            
            <p><strong>You Can Now:</strong></p>
            <ul>
                <li>Access your dashboard</li>
                <li>Post or apply for jobs</li>
                <li>Send and receive messages</li>
                <li>Manage your profile</li>
                <li>Use all platform features</li>
            </ul>
            
            <p>We're glad to have you back! Please review our Terms of Service to ensure continued compliance.</p>
            
            <p style="text-align: center;">
                <a href="{{ $dashboardUrl }}" class="button">Go to Dashboard</a>
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
