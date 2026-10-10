<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IssuedTicket;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class WebhookController extends Controller
{
    /**
     * Handle Xendit Invoice Webhook
     */
    public function xenditWebhook(Request $request)
    {
        // 1. Validate Xendit Callback Token (Security)
        $xenditToken = env('XENDIT_WEBHOOK_TOKEN');
        if ($xenditToken && $request->header('x-callback-token') !== $xenditToken) {
            Log::warning('Xendit webhook invalid token attempt');
            return response()->json(['success' => false, 'message' => 'Invalid token'], 403);
        }

        $payload = $request->all();
        Log::info('Xendit Webhook Received', $payload);

        // 2. Extract Data
        $orderNumber = $payload['external_id'] ?? null;
        $status = $payload['status'] ?? null;

        if (!$orderNumber || $status !== 'PAID') {
            return response()->json(['success' => true, 'message' => 'Not a PAID event or missing external_id']);
        }

        // 3. Find Order
        $order = Order::with(['items.ticketType', 'event', 'user'])->where('order_number', $orderNumber)->first();

        if (!$order) {
            Log::error('Order not found for webhook: ' . $orderNumber);
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        // Check if already paid to prevent double issuance
        if ($order->status === 'PAID') {
            return response()->json(['success' => true, 'message' => 'Order already processed']);
        }

        try {
            DB::beginTransaction();

            // 4. Mark Order as PAID
            $order->update([
                'status' => 'PAID',
                'payment_method' => $payload['payment_method'] ?? 'XENDIT',
                'payment_reference' => $payload['id'] ?? null,
                'paid_at' => now(),
            ]);

            // 5. Generate Tickets
            $issuedTickets = [];
            foreach ($order->items as $item) {
                for ($i = 0; $i < $item->quantity; $i++) {
                    $ticketNumber = 'TIX-' . date('Ymd') . '-' . strtoupper(Str::random(6));
                    $qrToken = 'PASS-' . Str::random(12) . '-' . $ticketNumber;
                    
                    $issuedTickets[] = IssuedTicket::create([
                        'ticket_number' => $ticketNumber,
                        'qr_token' => $qrToken,
                        'order_id' => $order->id,
                        'event_id' => $order->event_id,
                        'ticket_type_id' => $item->ticket_type_id,
                        'user_id' => $order->user_id,
                        // We extract attendee details from the payload customer if available, 
                        // or fallback to the user's name since we don't store per-ticket names in order items yet.
                        'participant_name' => $payload['payer_email'] ?? $order->user->name,
                        'participant_email' => $payload['payer_email'] ?? $order->user->email,
                        'status' => 'ISSUED',
                    ]);
                }
            }

            DB::commit();

            // 6. Send Email Notification
            try {
                Mail::to($order->user->email)->send(
                    new \App\Mail\OrderConfirmedMail($order, collect($issuedTickets))
                );
            } catch (\Exception $mailEx) {
                Log::error('Failed to send OrderConfirmedMail from webhook: ' . $mailEx->getMessage());
            }

            return response()->json(['success' => true, 'message' => 'Order processed and tickets issued.']);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to process webhook order: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Internal server error'], 500);
        }
    }

    public function simulatePayment(Request $request, $orderNumber)
    {
        // Only for local/development use
        if (app()->environment('production')) {
            abort(404);
        }

        // Simulate Xendit Webhook Payload
        $request->merge([
            'external_id' => $orderNumber,
            'status' => 'PAID',
            'payment_method' => 'BANK_TRANSFER',
            'id' => 'sim_' . time(),
        ]);

        return $this->xenditWebhook($request);
    }
}
