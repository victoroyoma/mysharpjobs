<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\PaystackService;
use App\Services\FlutterwaveService;
use App\Models\Payment;
use App\Models\Job;

class WebhookController extends Controller
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
     * Handle Paystack webhook
     */
    public function paystackWebhook(Request $request)
    {
        try {
            // Verify webhook signature
            $signature = $request->header('x-paystack-signature');
            $payload = $request->getContent();

            if (!$this->paystackService->verifyWebhookSignature($payload, $signature)) {
                Log::warning('Invalid Paystack webhook signature');
                return response()->json(['message' => 'Invalid signature'], 401);
            }

            $data = $request->all();
            $event = $data['event'] ?? '';

            Log::info('Paystack webhook received', ['event' => $event, 'data' => $data]);

            // Handle different event types
            switch ($event) {
                case 'charge.success':
                    $this->handlePaystackChargeSuccess($data['data']);
                    break;
                    
                case 'charge.failed':
                    $this->handlePaystackChargeFailed($data['data']);
                    break;
                    
                case 'transfer.success':
                    $this->handlePaystackTransferSuccess($data['data']);
                    break;
                    
                case 'transfer.failed':
                    $this->handlePaystackTransferFailed($data['data']);
                    break;
                    
                default:
                    Log::info('Unhandled Paystack webhook event: ' . $event);
            }

            return response()->json(['message' => 'Webhook processed'], 200);

        } catch (\Exception $e) {
            Log::error('Paystack webhook error: ' . $e->getMessage());
            return response()->json(['message' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Handle Flutterwave webhook
     */
    public function flutterwaveWebhook(Request $request)
    {
        try {
            // Verify webhook signature
            $signature = $request->header('verif-hash');
            
            if (config('payment.webhooks.verify_signature')) {
                $webhookSecret = config('payment.gateways.flutterwave.webhook_secret');
                if ($signature !== $webhookSecret) {
                    Log::warning('Invalid Flutterwave webhook signature');
                    return response()->json(['message' => 'Invalid signature'], 401);
                }
            }

            $data = $request->all();
            $event = $data['event'] ?? '';

            Log::info('Flutterwave webhook received', ['event' => $event, 'data' => $data]);

            // Handle different event types
            switch ($event) {
                case 'charge.completed':
                    $this->handleFlutterwaveChargeCompleted($data['data']);
                    break;
                    
                case 'charge.failed':
                    $this->handleFlutterwaveChargeFailed($data['data']);
                    break;
                    
                case 'transfer.completed':
                    $this->handleFlutterwaveTransferCompleted($data['data']);
                    break;
                    
                default:
                    Log::info('Unhandled Flutterwave webhook event: ' . $event);
            }

            return response()->json(['message' => 'Webhook processed'], 200);

        } catch (\Exception $e) {
            Log::error('Flutterwave webhook error: ' . $e->getMessage());
            return response()->json(['message' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Handle successful Paystack charge
     */
    private function handlePaystackChargeSuccess($data)
    {
        $reference = $data['reference'] ?? null;
        
        if (!$reference) {
            Log::warning('Paystack charge success without reference');
            return;
        }

        $payment = Payment::where('gateway_reference', $reference)->first();
        
        if (!$payment) {
            Log::warning('Payment not found for reference: ' . $reference);
            return;
        }

        if ($payment->status === 'completed') {
            Log::info('Payment already completed: ' . $reference);
            return;
        }

        // Update payment
        $payment->status = 'completed';
        $payment->escrow_status = 'held';
        $payment->gateway_response = $data;
        $payment->fees = array_merge($payment->fees ?? [], [
            'gateway_fee' => ($data['fees'] ?? 0) / 100,
        ]);
        $payment->save();

        // Update job status
        $job = Job::find($payment->job_id);
        if ($job && $job->status === 'open') {
            $job->status = 'in-progress';
            $job->save();
        }

        Log::info('Payment completed successfully: ' . $reference);
    }

    /**
     * Handle failed Paystack charge
     */
    private function handlePaystackChargeFailed($data)
    {
        $reference = $data['reference'] ?? null;
        
        if (!$reference) {
            return;
        }

        $payment = Payment::where('gateway_reference', $reference)->first();
        
        if ($payment && $payment->status !== 'failed') {
            $payment->status = 'failed';
            $payment->gateway_response = $data;
            $payment->save();
            
            Log::info('Payment failed: ' . $reference);
        }
    }

    /**
     * Handle successful Flutterwave charge
     */
    private function handleFlutterwaveChargeCompleted($data)
    {
        $reference = $data['tx_ref'] ?? null;
        
        if (!$reference) {
            Log::warning('Flutterwave charge completed without reference');
            return;
        }

        $payment = Payment::where('gateway_reference', $reference)->first();
        
        if (!$payment) {
            Log::warning('Payment not found for reference: ' . $reference);
            return;
        }

        if ($payment->status === 'completed') {
            Log::info('Payment already completed: ' . $reference);
            return;
        }

        // Update payment
        $payment->status = 'completed';
        $payment->escrow_status = 'held';
        $payment->gateway_response = $data;
        $payment->fees = array_merge($payment->fees ?? [], [
            'gateway_fee' => $data['app_fee'] ?? 0,
        ]);
        $payment->save();

        // Update job status
        $job = Job::find($payment->job_id);
        if ($job && $job->status === 'open') {
            $job->status = 'in-progress';
            $job->save();
        }

        Log::info('Payment completed successfully: ' . $reference);
    }

    /**
     * Handle failed Flutterwave charge
     */
    private function handleFlutterwaveChargeFailed($data)
    {
        $reference = $data['tx_ref'] ?? null;
        
        if (!$reference) {
            return;
        }

        $payment = Payment::where('gateway_reference', $reference)->first();
        
        if ($payment && $payment->status !== 'failed') {
            $payment->status = 'failed';
            $payment->gateway_response = $data;
            $payment->save();
            
            Log::info('Payment failed: ' . $reference);
        }
    }

    /**
     * Handle Paystack transfer success (for payouts)
     */
    private function handlePaystackTransferSuccess($data)
    {
        // Implement payout handling logic here
        Log::info('Paystack transfer success', $data);
    }

    /**
     * Handle Paystack transfer failed
     */
    private function handlePaystackTransferFailed($data)
    {
        // Implement payout failure handling
        Log::warning('Paystack transfer failed', $data);
    }

    /**
     * Handle Flutterwave transfer completed
     */
    private function handleFlutterwaveTransferCompleted($data)
    {
        // Implement payout handling logic here
        Log::info('Flutterwave transfer completed', $data);
    }
}
