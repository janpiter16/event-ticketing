<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>E-Ticket {{ $ticket->ticket_number }}</title>
    <style>
        body {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 20px;
            background-color: #f1f5f9;
        }
        .ticket-wrapper {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
        }
        .ticket {
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4f46e5;
            color: #ffffff;
            padding: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
        }
        .header .event-date {
            margin-top: 8px;
            font-size: 14px;
            opacity: 0.9;
        }
        .header .ticket-type {
            display: inline-block;
            background-color: #ffffff;
            color: #4f46e5;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 15px;
            text-transform: uppercase;
        }
        table.content-table {
            width: 100%;
            border-collapse: collapse;
        }
        table.content-table td {
            padding: 25px 30px;
            vertical-align: top;
        }
        .details-col {
            width: 65%;
            border-right: 2px dashed #e2e8f0;
        }
        .qr-col {
            width: 35%;
            text-align: center;
            background-color: #f8fafc;
        }
        .info-group {
            margin-bottom: 20px;
        }
        .info-label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 15px;
            color: #0f172a;
            font-weight: bold;
        }
        .qr-placeholder {
            width: 130px;
            height: 130px;
            margin: 0 auto 15px;
            border: 4px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            background: #e2e8f0;
            display: block;
        }
        .token-text {
            font-family: monospace;
            font-size: 12px;
            color: #475569;
            background: #f1f5f9;
            padding: 6px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
            word-break: break-all;
        }
        .footer {
            background-color: #0f172a;
            color: #94a3b8;
            text-align: center;
            padding: 15px;
            font-size: 11px;
        }
        .brand {
            font-weight: bold;
            color: #ffffff;
        }
    </style>
</head>
<body>
    <div class="ticket-wrapper">
        <div class="ticket">
            <div class="header">
                <h1>{{ $ticket->event->name }}</h1>
                <div class="event-date">
                    {{ \Carbon\Carbon::parse($ticket->event->start_at)->translatedFormat("l, d F Y - H:i") }}
                </div>
                <div class="ticket-type">
                    {{ $ticket->ticketType->name }}
                </div>
            </div>

            <table class="content-table">
                <tr>
                    <td class="details-col">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td width="50%">
                                    <div class="info-group">
                                        <div class="info-label">Nama Peserta</div>
                                        <div class="info-value">{{ $ticket->participant_name }}</div>
                                    </div>
                                </td>
                                <td width="50%">
                                    <div class="info-group">
                                        <div class="info-label">No. Registrasi</div>
                                        <div class="info-value" style="color: #4f46e5;">{{ $ticket->ticket_number }}</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <div class="info-group">
                                        <div class="info-label">Lokasi / Venue</div>
                                        <div class="info-value">
                                            {{ $ticket->event->is_online ? "Webinar Online" : ($ticket->event->venue_name ?? "Lokasi Fisik") }}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <div class="info-group" style="margin-bottom: 0;">
                                        <div class="info-label">Status Pembayaran</div>
                                        <div class="info-value" style="color: #10b981;">LUNAS (PAID)</div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>

                    <td class="qr-col">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data={{ urlencode($ticket->qr_token) }}" alt="QR Code" class="qr-placeholder" />
                        
                        <div class="info-label" style="margin-top: 10px;">Token Keamanan</div>
                        <div class="token-text">{{ substr($ticket->qr_token, 0, 16) }}...</div>
                        <div style="font-size: 9px; color: #94a3b8; margin-top: 10px;">
                            Pindai kode QR ini pada pintu masuk.
                        </div>
                    </td>
                </tr>
            </table>

            <div class="footer">
                Diterbitkan secara resmi oleh <span class="brand">EventFlow</span> &bull; 
                {{ now()->translatedFormat("d M Y H:i") }}
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #64748b;">
            Harap simpan tiket ini. Tiket ini merupakan bukti sah pendaftaran Anda.
        </div>
    </div>
</body>
</html>

