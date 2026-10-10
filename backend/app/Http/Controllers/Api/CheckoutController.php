<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\IssuedTicket;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\TicketType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'ticket_type_id' => 'required|exists:ticket_types,id',
            'quantity' => 'required|integer|min:1|max:10',
            'attendee_name' => 'required|string|max:255',
            'attendee_email' => 'required|email|max:255',
        ]);

        $user = $request->user();
        $event = Event::findOrFail($validated['event_id']);
        $ticketType = TicketType::where('event_id', $event->id)->findOrFail($validated['ticket_type_id']);

        if ($ticketType->quantity_available !== null && $ticketType->quantity_available < $validated['quantity']) {
            return response()->json(['success' => false, 'message' => 'Not enough tickets available'], 400);
        }

        try {
            DB::beginTransaction();

            $totalAmount = $ticketType->price * $validated['quantity'];

            // Create Order
            $order = Order::create([
                'order_number' => 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(6)),
                'user_id' => $user->id,
                'event_id' => $event->id,
                'total_amount' => $totalAmount,
                'status' => 'PENDING',
            ]);

            // Create Order Item
            OrderItem::create([
                'order_id' => $order->id,
                'ticket_type_id' => $ticketType->id,
                'quantity' => $validated['quantity'],
                'unit_price' => $ticketType->price,
                'subtotal' => $totalAmount,
            ]);

            // Deduct quantity if not infinite
            if ($ticketType->quantity_available !== null) {
                $ticketType->decrement('quantity_available', $validated['quantity']);
            }

            // Generate Xendit Invoice
            $xenditService = new \App\Services\XenditService();
            $invoice = $xenditService->createInvoice($order, [
                'name' => $validated['attendee_name'],
                'email' => $validated['attendee_email'],
            ]);

            DB::commit();

            // NOTE: Tickets should ideally be generated ONLY AFTER webhook confirms payment.
            // For now, we will return the payment_url so the frontend can redirect the user.

            return response()->json([
                'success' => true,
                'message' => 'Order created. Please proceed to payment.',
                'data' => [
                    'order' => $order,
                    'payment_url' => $invoice['invoice_url']
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Checkout failed: ' . $e->getMessage()], 500);
        }
    }

    public function myTickets(Request $request)
    {
        $tickets = IssuedTicket::with(['event', 'ticketType'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tickets
        ]);
    }

    public function checkin(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
        ]);

        $ticket = IssuedTicket::with(['event', 'ticketType'])
            ->where('qr_token', $validated['token'])
            ->orWhere('ticket_number', $validated['token'])
            ->first();

        if (!$ticket) {
            return response()->json(['success' => false, 'message' => 'KODE TIKET TIDAK VALID. Tiket tidak ditemukan dalam basis data sistem.', 'status' => 'invalid'], 404);
        }

        // Authorization Guard: Only the organizer of this event can check in tickets
        // Future: Or someone with a staff role associated with this organizer
        if ($ticket->event->organizer_id !== $request->user()->id && !$request->user()->hasRole('super-admin')) {
            return response()->json(['success' => false, 'message' => 'AKSES DITOLAK. Anda bukan Organizer atau Staff untuk event ini.', 'status' => 'unauthorized'], 403);
        }

        if ($ticket->status === 'CHECKED_IN') {
            return response()->json(['success' => false, 'message' => 'PERINGATAN: TIKET SUDAH DIGUNAKAN SEBELUMNYA!', 'status' => 'duplicate', 'data' => $ticket], 409);
        }

        $ticket->status = 'CHECKED_IN';
        $ticket->checked_in_at = now();
        $ticket->save();

        return response()->json([
            'success' => true,
            'message' => 'VALID! Check-in berhasil. Selamat datang di acara!',
            'status' => 'success',
            'data' => $ticket
        ]);
    }

    public function downloadTicketPdf(Request $request, $ticketNumber)
    {
        $ticket = IssuedTicket::with(['event', 'ticketType', 'order'])
            ->where('ticket_number', $ticketNumber)
            ->firstOrFail();

        // Ensure the user owns this ticket or is an admin/organizer
        if ($ticket->user_id !== $request->user()->id && $ticket->event->organizer_id !== $request->user()->id && !$request->user()->hasRole('super-admin')) {
            abort(403, 'Unauthorized access to this ticket.');
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::setOptions(['isRemoteEnabled' => true])
            ->loadView('pdf.ticket', compact('ticket'))
            ->setPaper('a4', 'portrait');
        
        return $pdf->download('ticket_' . $ticket->ticket_number . '.pdf');
    }
}
