<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Update Required</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Verification Update Required</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{{ $userName }}</strong>,</p>
            
            <p>Thank you for submitting your verification documents. Unfortunately, we couldn't approve your verification at this time.</p>
            
            <div class="warning-box">
                <strong>Reason:</strong><br>
                {{ $reason }}
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review the reason for rejection above</li>
                <li>Prepare updated documents that address the concerns</li>
                <li>Resubmit your verification documents</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="{{ $resubmitUrl }}" class="button">Resubmit Documents</a>
            </p>
            
            <p>If you have any questions, please contact our support team.</p>
            
            <p>Best regards,<br>The MySharpJob Team</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} MySharpJob. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
