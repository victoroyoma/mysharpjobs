<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dispute Resolved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .resolution-box { background: #ede9fe; border-left: 4px solid #8b5cf6; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚖️ Dispute Resolved</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{{ $userName }}</strong>,</p>
            
            <p>The dispute <strong>#{{ $disputeId }}</strong> has been reviewed and resolved by our team.</p>
            
            <div class="resolution-box">
                <strong>Resolution Details:</strong><br>
                {{ $resolution }}
            </div>
            
            <p><strong>What This Means:</strong></p>
            <ul>
                <li>The case has been closed</li>
                <li>Any necessary actions have been taken</li>
                <li>You can view the full details in your dashboard</li>
            </ul>
            
            <p>If you have any questions about this resolution, please contact our support team.</p>
            
            <p style="text-align: center;">
                <a href="{{ $dashboardUrl }}" class="button">View Dashboard</a>
            </p>
            
            <p>Thank you for your patience and cooperation.</p>
            
            <p>Best regards,<br>The MySharpJob Team</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} MySharpJob. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
