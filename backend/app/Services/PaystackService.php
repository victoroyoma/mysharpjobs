<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class PaystackService
{
    private string $secretKey;
    private string $publicKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->secretKey = config('payment.gateways.paystack.secret_key');
        $this->publicKey = config('payment.gateways.paystack.public_key');
        $this->baseUrl = config('payment.gateways.paystack.url');
    }

    /**
     * Initialize a payment transaction
     *
     * @param array $data Payment data including email, amount, reference, etc.
     * @return array
     */
    public function initializeTransaction(array $data): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/transaction/initialize', [
                'email' => $data['email'],
                'amount' => $data['amount'] * 100, // Convert to kobo (smallest currency unit)
                'currency' => $data['currency'] ?? 'NGN',
                'reference' => $data['reference'],
                'callback_url' => $data['callback_url'] ?? null,
                'metadata' => $data['metadata'] ?? [],
                'channels' => $data['channels'] ?? ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
            ]);

            $result = $response->json();

            if ($result['status'] ?? false) {
                return [
                    'success' => true,
                    'data' => [
                        'authorization_url' => $result['data']['authorization_url'],
                        'access_code' => $result['data']['access_code'],
                        'reference' => $result['data']['reference'],
                    ]
                ];
            }

            Log::error('Paystack initialization failed', $result);
            
            return [
                'success' => false,
                'message' => $result['message'] ?? 'Payment initialization failed',
                'errors' => $result['errors'] ?? []
            ];

        } catch (Exception $e) {
            Log::error('Paystack API error: ' . $e->getMessage());
            
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
     * @param string $reference Transaction reference
     * @return array
     */
    public function verifyTransaction(string $reference): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
            ])->get($this->baseUrl . "/transaction/verify/{$reference}");

            $result = $response->json();

            if ($result['status'] ?? false) {
                $data = $result['data'];
                
                return [
                    'success' => true,
                    'data' => [
                        'status' => $data['status'], // success, failed, abandoned
                        'reference' => $data['reference'],
                        'amount' => $data['amount'] / 100, // Convert from kobo
                        'currency' => $data['currency'],
                        'paid_at' => $data['paid_at'],
                        'customer' => [
                            'email' => $data['customer']['email'],
                            'customer_code' => $data['customer']['customer_code'],
                        ],
                        'fees' => $data['fees'] / 100,
                        'metadata' => $data['metadata'],
                        'gateway_response' => $data['gateway_response'],
                    ]
                ];
            }

            return [
                'success' => false,
                'message' => $result['message'] ?? 'Transaction verification failed'
            ];

        } catch (Exception $e) {
            Log::error('Paystack verification error: ' . $e->getMessage());
            
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
     * @param string $payload Raw POST data
     * @param string $signature X-Paystack-Signature header
     * @return bool
     */
    public function verifyWebhookSignature(string $payload, string $signature): bool
    {
        $webhookSecret = config('payment.gateways.paystack.webhook_secret');
        $hash = hash_hmac('sha512', $payload, $webhookSecret);
        
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
            ])->get($this->baseUrl . "/transaction/{$transactionId}");

            $result = $response->json();

            if ($result['status'] ?? false) {
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
            Log::error('Paystack get transaction error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to fetch transaction details',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * List transactions
     *
     * @param array $filters Filters for listing transactions
     * @return array
     */
    public function listTransactions(array $filters = []): array
    {
        try {
            $query = http_build_query($filters);
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
            ])->get($this->baseUrl . "/transaction?{$query}");

            $result = $response->json();

            if ($result['status'] ?? false) {
                return [
                    'success' => true,
                    'data' => $result['data'],
                    'meta' => $result['meta'] ?? []
                ];
            }

            return [
                'success' => false,
                'message' => $result['message'] ?? 'Failed to list transactions'
            ];

        } catch (Exception $e) {
            Log::error('Paystack list transactions error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to list transactions',
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
}
