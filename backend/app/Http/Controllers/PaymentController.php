<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\Payment;
use App\Models\Job;
use App\Models\User;
use App\Services\PaystackService;
use App\Services\FlutterwaveService;

class PaymentController extends Controller
{
    private PaystackService $paystackService;
    private FlutterwaveService $flutterwaveService;

    public function __construct(
        PaystackService $paystackService,
        FlutterwaveService $flutterwaveService
    ) {
        $this->paystackService = $paystackService;
        $this->flutterwaveService = $flutterwaveService;
    }

    /**
     * Initialize payment
     */
    public function initializePayment(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'job_id' => 'required|exists:jobs_custom,id',
                'amount' => 'required|numeric|min:0',
                'currency' => 'required|string|in:NGN,USD,GHS,KES',
                'payment_method' => 'required|string|in:paystack,flutterwave,stripe',
                'callback_url' => 'sometimes|url',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $job = Job::find($request->job_id);
            $user = $request->user();

            // Verify user is the client for this job
            if ($job->client_id != $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized. Only the job client can make payments.'
                ], 403);
            }

            // Generate unique reference
            $reference = 'MSJOB_' . strtoupper(Str::random(10)) . '_' . time();

            // Calculate platform fees (10% of amount)
            $platformFeePercentage = 0.10;
            $platformFee = $request->amount * $platformFeePercentage;
            $fees = [
                'platform_fee' => $platformFee,
                'gateway_fee' => 0, // Will be calculated by gateway
            ];

            // Create payment record
            $payment = Payment::create([
                'job_id' => $request->job_id,
                'client_id' => $user->id,
                'artisan_id' => $job->artisan_id,
                'amount' => $request->amount,
                'currency' => $request->currency,
                'status' => 'pending',
                'payment_method' => $request->payment_method,
                'gateway_reference' => $reference,
                'escrow_status' => 'pending',
                'fees' => $fees,
                'metadata' => [
                    'job_title' => $job->title,
                    'client_email' => $user->email,
                    'callback_url' => $request->callback_url
                ]
            ]);

            // Initialize payment with selected gateway
            $initResult = null;
            if ($request->payment_method === 'paystack') {
                $initResult = $this->paystackService->initializeTransaction([
                    'email' => $user->email,
                    'amount' => $request->amount,
                    'reference' => $reference,
                    'callback_url' => $request->callback_url,
                    'metadata' => [
                        'job_id' => $job->id,
                        'job_title' => $job->title,
                        'payment_id' => $payment->id,
                    ]
                ]);
            } elseif ($request->payment_method === 'flutterwave') {
                $initResult = $this->flutterwaveService->initializeTransaction([
                    'tx_ref' => $reference,
                    'amount' => $request->amount,
                    'currency' => $request->currency,
                    'redirect_url' => $request->callback_url,
                    'customer' => [
                        'email' => $user->email,
                        'name' => $user->name,
                    ],
                    'customizations' => [
                        'title' => 'MySharpJob Payment',
                        'description' => 'Payment for job: ' . $job->title,
                    ],
                    'meta' => [
                        'job_id' => $job->id,
                        'payment_id' => $payment->id,
                    ]
                ]);
            }

            if ($initResult && $initResult['success']) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Payment initialized successfully',
                    'data' => [
                        'payment_id' => $payment->id,
                        'reference' => $reference,
                        'authorization_url' => $initResult['data']['authorization_url'] ?? $initResult['data']['link'],
                        'access_code' => $initResult['data']['access_code'] ?? null,
                    ]
                ]);
            } else {
                $payment->status = 'failed';
                $payment->save();

                return response()->json([
                    'status' => 'error',
                    'message' => $initResult['message'] ?? 'Payment initialization failed'
                ], 400);
            }

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error initializing payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment configuration for frontend
     */
    public function getConfig()
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'default_gateway' => config('payment.default_gateway'),
                    'gateways' => [
                        'paystack' => [
                            'enabled' => config('payment.gateways.paystack.enabled'),
                            'public_key' => $this->paystackService->getPublicKey(),
                            'supported_currencies' => config('payment.gateways.paystack.supported_currencies'),
                            'fee_percentage' => config('payment.gateways.paystack.fee_percentage'),
                            'fee_cap' => config('payment.gateways.paystack.fee_cap'),
                        ],
                        'flutterwave' => [
                            'enabled' => config('payment.gateways.flutterwave.enabled'),
                            'public_key' => $this->flutterwaveService->getPublicKey(),
                            'supported_currencies' => config('payment.gateways.flutterwave.supported_currencies'),
                            'fee_percentage' => config('payment.gateways.flutterwave.fee_percentage'),
                        ],
                    ],
                    'currency' => config('payment.currency'),
                    'platform_fee' => [
                        'percentage' => config('payment.platform_fee.percentage') * 100, // Convert to percentage
                        'min_amount' => config('payment.platform_fee.min_amount'),
                        'max_amount' => config('payment.platform_fee.max_amount'),
                    ],
                    'escrow' => [
                        'enabled' => true,
                        'release_delay_days' => config('payment.escrow.release_delay_days'),
                    ],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching payment configuration: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify payment
     */
    public function verifyPayment($reference)
    {
        try {
            $payment = Payment::where('gateway_reference', $reference)->first();

            if (!$payment) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment not found'
                ], 404);
            }

            $verifyResult = null;
            if ($payment->payment_method === 'paystack') {
                $verifyResult = $this->paystackService->verifyTransaction($reference);
            } elseif ($payment->payment_method === 'flutterwave') {
                $verifyResult = $this->flutterwaveService->verifyTransactionByReference($reference);
            }

            if ($verifyResult && $verifyResult['success']) {
                $data = $verifyResult['data'];
                
                if ($data['status'] === 'success' || $data['status'] === 'successful') {
                    $payment->status = 'completed';
                    $payment->escrow_status = 'held';
                    $payment->gateway_response = $data;
                    
                    // Update gateway fees
                    $gatewayFee = 0;
                    if ($payment->payment_method === 'paystack') {
                        $gatewayFee = ($data['fees'] ?? 0) / 100; // Convert from kobo
                    } elseif ($payment->payment_method === 'flutterwave') {
                        $gatewayFee = $data['app_fee'] ?? 0;
                    }
                    
                    $payment->fees = array_merge($payment->fees ?? [], [
                        'gateway_fee' => $gatewayFee,
                    ]);
                    $payment->save();

                    // Update job status if needed
                    $job = Job::find($payment->job_id);
                    if ($job && $job->status === 'open') {
                        $job->status = 'in-progress';
                        $job->save();
                    }

                    return response()->json([
                        'status' => 'success',
                        'message' => 'Payment verified successfully',
                        'data' => $payment
                    ]);
                } else {
                    $payment->status = 'failed';
                    $payment->gateway_response = $data;
                    $payment->save();

                    return response()->json([
                        'status' => 'error',
                        'message' => 'Payment verification failed'
                    ], 400);
                }
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => $verifyResult['message'] ?? 'Payment verification failed'
                ], 400);
            }

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error verifying payment: ' . $e->getMessage()
            ], 500);
        }
    }



    /**
     * Release payment from escrow
     */
    public function releaseFromEscrow(Request $request, $id)
    {
        try {
            $payment = Payment::find($id);

            if (!$payment) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment not found'
                ], 404);
            }

            $user = $request->user();

            // Only client can release payment
            if ($payment->client_id != $user->id && !$user->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to release this payment'
                ], 403);
            }

            if ($payment->escrow_status !== 'held') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment is not in escrow'
                ], 400);
            }

            $payment->escrow_status = 'released';
            $payment->save();

            // Update artisan's total earned
            $artisan = User::find($payment->artisan_id);
            if ($artisan) {
                $artisan->total_earned += $payment->amount;
                $artisan->save();
            }

            // Update client's total spent
            $client = User::find($payment->client_id);
            if ($client) {
                $client->total_spent += $payment->amount;
                $client->save();
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Payment released successfully',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error releasing payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Raise dispute
     */
    public function raiseDispute(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'reason' => 'required|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $payment = Payment::find($id);

            if (!$payment) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment not found'
                ], 404);
            }

            $user = $request->user();

            // Only client or artisan can raise dispute
            if ($payment->client_id != $user->id && $payment->artisan_id != $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to raise dispute'
                ], 403);
            }

            $payment->dispute_status = 'open';
            $payment->dispute_reason = $request->reason;
            $payment->dispute_raised_by = $user->id;
            $payment->dispute_raised_at = now();
            $payment->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Dispute raised successfully',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error raising dispute: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment history
     */
    public function getPaymentHistory(Request $request)
    {
        try {
            $user = $request->user();

            $query = Payment::where(function($q) use ($user) {
                $q->where('client_id', $user->id)
                  ->orWhere('artisan_id', $user->id);
            })->with(['job:id,title', 'client:id,name', 'artisan:id,name']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $payments = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Payment history retrieved successfully',
                'data' => $payments->items(),
                'pagination' => [
                    'total' => $payments->total(),
                    'per_page' => $payments->perPage(),
                    'current_page' => $payments->currentPage(),
                    'last_page' => $payments->lastPage(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching payment history: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single payment details
     */
    public function getPayment($id)
    {
        try {
            $payment = Payment::with(['job', 'client', 'artisan'])->find($id);

            if (!$payment) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Payment retrieved successfully',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Webhook handler for payment gateways
     */
    public function handleWebhook(Request $request)
    {
        try {
            $gateway = $request->route('gateway'); // paystack or flutterwave

            if ($gateway === 'paystack') {
                return $this->handlePaystackWebhook($request);
            } elseif ($gateway === 'flutterwave') {
                return $this->handleFlutterwaveWebhook($request);
            }

            return response()->json(['message' => 'Invalid gateway'], 400);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Webhook error: ' . $e->getMessage()
            ], 500);
        }
    }

    private function handlePaystackWebhook($request)
    {
        // Verify webhook signature
        $signature = $request->header('X-Paystack-Signature');
        $body = $request->getContent();
        
        if ($signature !== hash_hmac('sha512', $body, $this->paystackSecretKey)) {
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $event = $request->input('event');
        $data = $request->input('data');

        if ($event === 'charge.success') {
            $reference = $data['reference'];
            $payment = Payment::where('gateway_reference', $reference)->first();

            if ($payment) {
                $payment->status = 'completed';
                $payment->escrow_status = 'held';
                $payment->save();
            }
        }

        return response()->json(['message' => 'Webhook processed'], 200);
    }

    private function handleFlutterwaveWebhook($request)
    {
        // Verify webhook signature
        $signature = $request->header('verif-hash');
        
        if ($signature !== env('FLUTTERWAVE_WEBHOOK_HASH')) {
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $event = $request->input('event');
        $data = $request->input('data');

        if ($event === 'charge.completed') {
            $reference = $data['tx_ref'];
            $payment = Payment::where('gateway_reference', $reference)->first();

            if ($payment && $data['status'] === 'successful') {
                $payment->status = 'completed';
                $payment->escrow_status = 'held';
                $payment->save();
            }
        }

        return response()->json(['message' => 'Webhook processed'], 200);
    }
}
