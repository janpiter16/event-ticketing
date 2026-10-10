<x-mail::message>
# Halo {{ $order->user->name }},

Pembayaran tiket untuk acara **{{ $order->event->name }}** telah berhasil dikonfirmasi. Berikut adalah rincian pesanan Anda:

**Nomor Pesanan:** {{ $order->order_number }}  
**Tanggal Pesan:** {{ $order->created_at->format('d M Y H:i') }}  
**Total Pembayaran:** Rp {{ number_format($order->total_amount, 0, ',', '.') }}  

---

### Jadwal & Lokasi Acara
**Waktu:** {{ \Carbon\Carbon::parse($order->event->start_at)->format('d M Y H:i') }}  
**Tempat:** {{ $order->event->is_online ? 'Webinar Online' : $order->event->venue_name }}  

---

### E-Ticket Anda

Berikut adalah tiket Anda. Harap tunjukkan QR Code dari tiket ini pada saat masuk ke acara.

@foreach($tickets as $index => $ticket)
<div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e2e8f0;">
<strong>#{{ $index + 1 }} - {{ $ticket->ticketType->name }}</strong><br>
Peserta: {{ $ticket->participant_name }} ({{ $ticket->participant_email }})<br>
Kode Tiket: {{ $ticket->ticket_number }}<br>
Status: {{ $ticket->status }}
</div>
@endforeach

<x-mail::button :url="config('app.frontend_url', 'http://localhost:3000') . '/my-tickets'">
Lihat Tiket & QR Code di Aplikasi
</x-mail::button>

Terima kasih atas partisipasinya!

Salam hangat,<br>
Tim {{ config('app.name') }}
</x-mail::message>
