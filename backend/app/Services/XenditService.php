<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class XenditService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.xendit.co';

    public function __construct()
    {
        $this->apiKey = env('XENDIT_SECRET_KEY');
    }

    /**
     * Create an Invoice in Xendit
     */
    public function createInvoice($order, $customer)
    {
        if (empty($this->apiKey)) {
            // Fallback for local testing without API Key
            return [
                'invoice_url' => config('app.frontend_url') . '/payment-simulation/' . $order->order_number,
                'status' => 'PENDING'
            ];
        }

        try {
            $response = Http::withBasicAuth($this->apiKey, '')
                ->post($this->baseUrl . '/v2/invoices', [
                    'external_id' => $order->order_number,
                    'amount' => $order->total_amount,
                    'description' => 'Pembayaran Tiket: ' . $order->event->name,
                    'customer' => [
                        'given_names' => $customer['name'],
                        'email' => $customer['email'],
                    ],
                    'success_redirect_url' => config('app.frontend_url') . '/my-tickets?status=success',
                    'failure_redirect_url' => config('app.frontend_url') . '/dashboard?status=failed',
                ]);

            if ($response->successful()) {
                return [
                    'invoice_url' => $response->json('invoice_url'),
                    'status' => $response->json('status'),
                ];
            }

            Log::error('Xendit Invoice Creation Failed', ['response' => $response->json()]);
            throw new \Exception('Failed to create payment invoice.');
        } catch (\Exception $e) {
            Log::error('Xendit Exception: ' . $e->getMessage());
            throw $e;
        }
    }
}
