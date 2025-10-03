<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Payment Gateway
    |--------------------------------------------------------------------------
    |
    | This option controls the default payment gateway that will be used
    | when no specific gateway is specified. Supported: "paystack", "flutterwave"
    |
    */

    'default' => env('PAYMENT_GATEWAY', 'paystack'),

    /*
    |--------------------------------------------------------------------------
    | Payment Gateways
    |--------------------------------------------------------------------------
    |
    | Here are the payment gateway configurations for the application.
    | You can add multiple gateways and switch between them.
    |
    */

    'gateways' => [

        'paystack' => [
            'enabled' => env('PAYSTACK_ENABLED', true),
            'public_key' => env('PAYSTACK_PUBLIC_KEY'),
            'secret_key' => env('PAYSTACK_SECRET_KEY'),
            'webhook_secret' => env('PAYSTACK_WEBHOOK_SECRET'),
            'url' => 'https://api.paystack.co',
            'supported_currencies' => ['NGN', 'GHS', 'ZAR', 'USD'],
            'fee_percentage' => 0.015, // 1.5%
            'fee_cap' => 2000, // NGN 2000 maximum fee
        ],

        'flutterwave' => [
            'enabled' => env('FLUTTERWAVE_ENABLED', true),
            'public_key' => env('FLUTTERWAVE_PUBLIC_KEY'),
            'secret_key' => env('FLUTTERWAVE_SECRET_KEY'),
            'encryption_key' => env('FLUTTERWAVE_ENCRYPTION_KEY'),
            'webhook_secret' => env('FLUTTERWAVE_WEBHOOK_SECRET'),
            'url' => 'https://api.flutterwave.com/v3',
            'supported_currencies' => ['NGN', 'USD', 'GHS', 'KES', 'UGX', 'ZAR'],
            'fee_percentage' => 0.014, // 1.4%
        ],

        'stripe' => [
            'enabled' => env('STRIPE_ENABLED', false),
            'public_key' => env('STRIPE_PUBLIC_KEY'),
            'secret_key' => env('STRIPE_SECRET_KEY'),
            'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
            'url' => 'https://api.stripe.com/v1',
            'supported_currencies' => ['USD', 'EUR', 'GBP'],
            'fee_percentage' => 0.029, // 2.9%
            'fee_fixed' => 30, // $0.30 per transaction
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Platform Fees
    |--------------------------------------------------------------------------
    |
    | Configure platform fees and escrow settings
    |
    */

    'platform_fee_percentage' => env('PLATFORM_FEE_PERCENTAGE', 0.10), // 10% platform fee
    'minimum_amount' => 100, // Minimum payment amount in smallest currency unit
    'maximum_amount' => 10000000, // Maximum payment amount
    'currency' => env('PAYMENT_CURRENCY', 'NGN'),
    
    /*
    |--------------------------------------------------------------------------
    | Escrow Settings
    |--------------------------------------------------------------------------
    */

    'escrow' => [
        'enabled' => true,
        'release_delay_days' => env('ESCROW_RELEASE_DELAY_DAYS', 7),
        'auto_release_enabled' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Webhook Settings
    |--------------------------------------------------------------------------
    */

    'webhooks' => [
        'verify_signature' => env('WEBHOOK_VERIFY_SIGNATURE', true),
        'log_all_events' => env('WEBHOOK_LOG_EVENTS', true),
    ],

];
