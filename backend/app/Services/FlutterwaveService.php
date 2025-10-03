<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class FlutterwaveService
{
    private string $secretKey;
    private string $publicKey;
    private string $encryptionKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->secretKey = config('payment.gateways.flutterwave.secret_key');
        $this->publicKey = config('payment.gateways.flutterwave.public_key');
        $this->encryptionKey = config('payment.gateways.flutterwave.encryption_key');
        $this->baseUrl = config('payment.gateways.flutterwave.url');
    }

    /**
     * Initialize a payment transaction
     *
     * @param array $data Payment data
     * @return array
     */
    public function initializeTransaction(array $data): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/payments', [
                'tx_ref' => $data['reference'],
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? 'NGN',
                'redirect_url' => $data['callback_url'] ?? null,
                'payment_options' => $data['payment_options'] ?? 'card,banktransfer,ussd,mobilemoney',
                'customer' => [
                    'email' => $data['email'],
                    'name' => $data['name'] ?? 'Customer',
                    'phonenumber' => $data['phone'] ?? '',
                ],
                'customizations' => [
                    'title' => $data['title'] ?? 'MySharpJob Payment',
                    'description' => $data['description'] ?? 'Payment for service',
                    'logo' => $data['logo'] ?? config('app.url') . '/images/logo.png',
                ],
                'meta' => $data['metadata'] ?? [],
            ]);

            $result = $response->json();

            if ($result['status'] === 'success') {
                return [
                    'success' => true,
                    'data' => [
                        'authorization_url' => $result['data']['link'],
                        'reference' => $data['reference'],
                    ]
                ];
            }

            Log::error('Flutterwave initialization failed', $result);
            
            return [
                'success' => false,
                'message' => $result['message'] ?? 'Payment initialization failed',
                'errors' => $result['errors'] ?? []
            ];

        } catch (Exception $e) {
            Log::error('Flutterwave API error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to connect to payment gateway',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Verify a transaction
     *
     * @param string $transactionId Transaction ID from Flutterwave
     * @return array
     */
    public function verifyTransaction(string $transactionId): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
            ])->get($this->baseUrl . "/transactions/{$transactionId}/verify");

            $result = $response->json();

            if ($result['status'] === 'success') {
                $data = $result['data'];
                
                return [
                    'success' => true,
                    'data' => [
                        'status' => $data['status'], // successful, failed, abandoned
                        'reference' => $data['tx_ref'],
                        'transaction_id' => $data['id'],
                        'amount' => $data['amount'],
                        'currency' => $data['currency'],
                        'charged_amount' => $data['charged_amount'],
                        'created_at' => $data['created_at'],
                        'customer' => [
                            'email' => $data['customer']['email'],
                            'name' => $data['customer']['name'],
                        ],
                        'app_fee' => $data['app_fee'] ?? 0,
                        'merchant_fee' => $data['merchant_fee'] ?? 0,
                        'processor_response' => $data['processor_response'] ?? '',
                        'payment_type' => $data['payment_type'] ?? '',
                        'metadata' => $data['meta'] ?? [],
                    ]
                ];
            }

            return [
                'success' => false,
                'message' => $result['message'] ?? 'Transaction verification failed'
            ];

        } catch (Exception $e) {
            Log::error('Flutterwave verification error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to verify transaction',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Verify transaction by reference
     *
     * @param string $reference Transaction reference
     * @return array
     */
    public function verifyTransactionByReference(string $reference): array
    {
        try {
            // First, get transaction by reference
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
            ])->get($this->baseUrl . "/transactions/verify_by_reference", [
                'tx_ref' => $reference
            ]);

            $result = $response->json();

            if ($result['status'] === 'success') {
                $data = $result['data'];
                
                return [
                    'success' => true,
                    'data' => [
                        'status' => $data['status'],
                        'reference' => $data['tx_ref'],
                        'transaction_id' => $data['id'],
                        'amount' => $data['amount'],
                        'currency' => $data['currency'],
                        'charged_amount' => $data['charged_amount'],
                        'customer' => [
                            'email' => $data['customer']['email'],
                            'name' => $data['customer']['name'],
                        ],
                        'app_fee' => $data['app_fee'] ?? 0,
                        'metadata' => $data['meta'] ?? [],
                    ]
                ];
            }

            return [
                'success' => false,
                'message' => $result['message'] ?? 'Transaction verification failed'
            ];

        } catch (Exception $e) {
            Log::error('Flutterwave verify by reference error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to verify transaction',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Verify webhook signature
     *
     * @param array $payload Webhook payload
     * @param string $signature X-Flutterwave-Signature header
     * @return bool
     */
    public function verifyWebhookSignature(array $payload, string $signature): bool
    {
        $webhookSecret = config('payment.gateways.flutterwave.webhook_secret');
        $hash = hash_hmac('sha256', json_encode($payload), $webhookSecret);
        
        return hash_equals($hash, $signature);
    }

    /**
     * Get transaction details
     *
     * @param int $transactionId Transaction ID
     * @return array
     */
    public function getTransaction(int $transactionId): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
            ])->get($this->baseUrl . "/transactions/{$transactionId}");

            $result = $response->json();

            if ($result['status'] === 'success') {
                return [
                    'success' => true,
                    'data' => $result['data']
                ];
            }

            return [
                'success' => false,
                'message' => $result['message'] ?? 'Failed to fetch transaction'
            ];

        } catch (Exception $e) {
            Log::error('Flutterwave get transaction error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to fetch transaction details',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get public key for client-side integration
     *
     * @return string
     */
    public function getPublicKey(): string
    {
        return $this->publicKey;
    }

    /**
     * Get encryption key for client-side integration
     *
     * @return string
     */
    public function getEncryptionKey(): string
    {
        return $this->encryptionKey;
    }
}
